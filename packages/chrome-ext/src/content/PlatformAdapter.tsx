import type { MessageData } from '@/types'
import type { InterceptorEventListener } from '@/utils'
import { EventBus } from '@jl-org/tool'
import { Log } from '@/utils/Logger'
import { EventManager, MessageManager, PermissionManager, XMLProcessor } from './managers'

/**
 * 平台适配器基础接口
 * 所有LLM平台的适配器都需要实现这些方法
 */
export abstract class PlatformAdapter extends EventBus<EventMap> {
  abstract getUserInputEl(): SelectorType
  abstract getSendButtonEl(): SelectorType
  abstract getObserveSendingEl(): SelectorType

  abstract getQAEls(): Promise<{ qEls: HTMLElement[], aEls: HTMLElement[] }>

  abstract getNewChatEls(): SelectorType
  abstract isSending(el: HTMLElement): boolean

  isServerProcessing = false

  private eventManager: EventManager | null = null
  private messageManager: MessageManager | null = null
  private unbindEvents: Set<Function> = new Set()

  /**
   * 初始化事件劫持
   */
  async init() {
    Log.info('开始初始化平台适配器')

    this.eventManager = new EventManager(this)
    this.messageManager = new MessageManager(this)

    await this.initSelector(this.eventManager, this.messageManager)
    this.subscribeEvents()

    Log.info('平台适配器初始化完成')
  }

  async initSelector(
    eventManager: EventManager,
    messageManager: MessageManager,
  ) {
    await Promise.all([
      eventManager.hackInput({
        checkHasSystemPrompt: () => messageManager.checkHasSystemPrompt(),
      }),
      eventManager.hackSendBtnClick({
        checkHasSystemPrompt: () => messageManager.checkHasSystemPrompt(),
      }),
      eventManager.hackNewChatClick((event, originalListeners) => {
        this.emit('newChat', { event, originalListeners })
      }),

      messageManager.refreshMessages(),
    ])
  }

  subscribeEvents() {
    this.unbindEvents.forEach(unbind => unbind())
    this.unbindEvents.clear()

    const unbindOnBeforeRequest = this.on('onBeforeRequest', (message) => {
      this.obMessage()
    })
    const unbindOnCompleted = this.on('onCompleted', (message) => {
      this.processRequest()
    })

    this.unbindEvents.add(unbindOnBeforeRequest)
    this.unbindEvents.add(unbindOnCompleted)
  }

  obMessage() {
    if (!this.messageManager) {
      throw new Error('MessageManager is not initialized')
    }

    this.messageManager?.unobserveMessage()
    this.messageManager.observeMessage(async (entries) => {
      const target = entries[0].target
      const isLLMSending = this.isSending(target as HTMLElement)

      if (isLLMSending || this.isServerProcessing) {
        return
      }

      await this.processRequest()
    })
  }

  get messages() {
    return this.messageManager?.getMessages(true) || []
  }

  /**
   * 处理工具调用请求
   */
  async processRequest() {
    if (!this.messageManager || !this.eventManager) {
      throw new Error('MessageManager or EventManager is not initialized')
    }

    const lastAnswer = await this.messageManager.getLastAnswer()
    if (!lastAnswer.trim()) {
      return
    }

    const toolsCallArr = XMLProcessor.parseTools(lastAnswer)
    if (toolsCallArr.length > 0) {
      this.isServerProcessing = false
    }

    if (this.isServerProcessing) {
      Log.info('此次为服务器返回的结果，并且没有工具调用，无需处理')
      return
    }

    await PermissionManager.processRequest(
      lastAnswer,
      result => this.eventManager!.sendServerResultToLLM(result),
    )
    this.messageManager?.unobserveMessage()
  }

  dispose() {
    Log.info('释放平台适配器资源')

    this.eventManager?.dispose()
    this.messageManager?.dispose()
  }
}

export type EventMap = {
  newChat: {
    event: MouseEvent
    originalListeners: InterceptorEventListener[]
  }
  onBeforeRequest: MessageData<chrome.webRequest.OnBeforeRequestDetails>
  onCompleted: MessageData<chrome.webRequest.OnCompletedDetails>
}

export type SelectorType = Promise<HTMLElement[]>
