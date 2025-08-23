import type { PlatformAdapter } from '../PlatformAdapter'
import type { InterceptorEventListener } from '@/utils'
import { getPrompt, qToTaskXML } from '@/config/prompt'
import { EventInterceptor, hackClickEvent, hackInputEvent, modifyInputValue } from '@/utils'

/**
 * 事件管理器
 * 负责事件劫持和输入处理
 */
export class EventManager {
  private userInputEl: HTMLTextAreaElement | null = null
  private sendButtonEl: HTMLElement | null = null

  private unhackSendBtnClickFn: VoidFunction = () => { }
  private unhackInputEventFn: VoidFunction = () => { }
  private hackSendBtnClickFn: VoidFunction = () => { }
  private hackInputFn: VoidFunction = () => { }

  constructor(private readonly platformAdapter: PlatformAdapter) { }

  /**
   * 劫持输入事件
   */
  async hackInput(opts: HackEventOpts): Promise<void> {
    const input = await this.getUserInputEl()

    this.hackInputFn = () => {
      this.unhackInputEventFn()
      this.unhackInputEventFn = hackInputEvent(
        input,
        async () => {
          const userTask = input.value.trim()

          await opts.onBeforeHack?.()

          const prompt = opts.checkHasSystemPrompt()
            ? qToTaskXML(userTask)
            : getPrompt(userTask)
          modifyInputValue(input, prompt)

          /**
           * 此次为用户输入，说明是用户要交互
           */
          this.platformAdapter.isServerProcessing = false

          opts.onAfterHack?.()
        },
        {
          preventDefault: () => false,
        },
      )
    }

    this.hackInputFn()
  }

  /**
   * 劫持发送按钮点击事件
   */
  async hackSendBtnClick(opts: HackEventOpts): Promise<void> {
    const submitButton = await this.getSendButtonEl()
    const input = await this.getUserInputEl() as HTMLTextAreaElement

    this.hackSendBtnClickFn = () => {
      this.unhackSendBtnClickFn()
      this.unhackSendBtnClickFn = hackClickEvent(
        submitButton,
        async () => {
          const userTask = input.value.trim()

          await opts.onBeforeHack?.()

          const prompt = opts.checkHasSystemPrompt()
            ? qToTaskXML(userTask)
            : getPrompt(userTask)
          modifyInputValue(input, prompt)

          await opts.onAfterHack?.()
        },
        {
          preventDefault: () => false,
        },
      )
    }

    this.hackSendBtnClickFn()
  }

  /**
   * 劫持新聊天按钮点击事件
   * @param onNewChat 新聊天事件回调
   */
  async hackNewChatClick(onNewChat: (event: MouseEvent, originalListeners: InterceptorEventListener[]) => void): Promise<void> {
    if (!this.platformAdapter.getNewChatSelector()) {
      return
    }

    const newChatEls = await this.platformAdapter.getNewChatSelector()
    for (const newChatEl of newChatEls) {
      hackClickEvent(newChatEl, async (event: MouseEvent, originalListeners: InterceptorEventListener[]) => {
        onNewChat(event, originalListeners)
      })
    }
  }

  /**
   * 获取用户输入框元素
   */
  async getUserInputEl(): Promise<HTMLTextAreaElement> {
    if (this.userInputEl) {
      return this.userInputEl
    }

    const element = await this.platformAdapter.getUserInputSelector()
    if (!element) {
      throw new Error('未找到用户输入框')
    }

    this.userInputEl = element[0] as HTMLTextAreaElement
    return this.userInputEl
  }

  /**
   * 获取发送按钮元素
   */
  async getSendButtonEl(): Promise<HTMLElement> {
    if (this.sendButtonEl) {
      return this.sendButtonEl
    }

    const element = await this.platformAdapter.getSendButtonSelector()
    if (!element) {
      throw new Error('未找到发送按钮')
    }

    this.sendButtonEl = element[0] as HTMLElement
    return this.sendButtonEl
  }

  /**
   * 将服务器返回的结果发送给 LLM
   * @param result 工具执行结果
   */
  async sendServerResultToLLM(result: string): Promise<void> {
    this.unhackInputEventFn()
    this.unhackSendBtnClickFn()
    const inputEl = await this.getUserInputEl()
    modifyInputValue(inputEl, result)

    const btn = await this.getSendButtonEl()
    btn.click()
    /**
     * 此次为服务器返回的结果，需要设置标志位，无需处理
     */
    this.platformAdapter.isServerProcessing = true

    requestAnimationFrame(() => {
      modifyInputValue(inputEl, '')
      this.hackInputFn()
      this.hackSendBtnClickFn()
    })
  }

  /**
   * 释放资源
   */
  dispose(): void {
    this.userInputEl = null
    this.sendButtonEl = null
    /** 清理被拦截的事件 */
    EventInterceptor.dispose()
  }
}

type HackEventOpts = {
  checkHasSystemPrompt: () => boolean
  onBeforeHack?: () => Promise<void>
  onAfterHack?: () => Promise<void>
}
