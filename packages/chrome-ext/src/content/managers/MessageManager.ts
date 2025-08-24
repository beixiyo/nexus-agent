import type { PlatformAdapter } from '../PlatformAdapter'
import type { QA } from '@/types'
import { HTMLToStr } from '@jl-org/tool'
import { getPrompt } from '@/config/prompt'

/**
 * 消息管理器
 * 负责消息的获取、刷新和状态管理
 */
export class MessageManager {
  private messages: QA[] = []
  private messageObserver: MutationObserver | null = null
  private hasSystemPrompt = false

  constructor(private readonly platformAdapter: PlatformAdapter) { }

  /**
   * 获取消息列表
   */
  getMessages(forceRefresh = false): QA[] {
    if (forceRefresh) {
      this.refreshMessages()
    }

    return [...this.messages]
  }

  /**
   * 检查是否存在系统提示
   * @returns 是否存在系统提示
   */
  checkHasSystemPrompt(): boolean {
    if (this.hasSystemPrompt) {
      return true
    }

    this.refreshMessages()
    const firstMessage = this.messages[0]
    if (!firstMessage) {
      return false
    }

    if (firstMessage.q.startsWith(getPrompt())) {
      this.hasSystemPrompt = true
      return true
    }

    return false
  }

  /**
   * 获取最后一条问题
   * @param refresh 是否刷新消息
   * @returns 最后一条问题
   */
  async getLastQuestion(refresh = false): Promise<string> {
    if (refresh) {
      this.messages = await this.refreshMessages()
    }

    return this.messages[this.messages.length - 1]?.q || ''
  }

  /**
   * 获取最后一条答案
   * @param refresh 是否刷新消息
   * @returns 最后一条答案
   */
  async getLastAnswer(refresh = true): Promise<string> {
    if (refresh) {
      this.messages = await this.refreshMessages()
    }

    return this.messages[this.messages.length - 1]?.a || ''
  }

  /**
   * 刷新消息
   * @returns 消息列表
   */
  async refreshMessages(): Promise<QA[]> {
    const qas: QA[] = []

    try {
      const { aEls, qEls } = await this.platformAdapter.getQAEls()
      const len = Math.max(qEls.length, aEls.length)

      for (let i = 0; i < len; i++) {
        const qEl = qEls[i]
        const aEl = aEls[i]
        const qa: QA = { q: '', a: '' }

        if (qEl) {
          qa.q = HTMLToStr(qEl.outerHTML) || ''
        }
        if (aEl) {
          qa.a = HTMLToStr(aEl.outerHTML) || ''
        }
        qas.push(qa)
      }
      this.messages = qas

      return qas
    }
    catch (error) {
      return []
    }
  }

  /**
   * 监听消息变化
   * @param callback 回调函数
   */
  async observeMessage(callback: MutationCallback): Promise<MutationObserver> {
    if (this.messageObserver) {
      this.messageObserver.disconnect()
    }

    const sendingSelector = await this.platformAdapter.getObserveSendingEl()
    if (!sendingSelector?.length) {
      throw new Error('未找到监听发送中按钮')
    }

    const observer = new MutationObserver(callback)
    observer.observe(sendingSelector[0], {
      attributes: true,
      subtree: true,
      childList: true,
    })

    this.messageObserver = observer
    return observer
  }

  unobserveMessage(): void {
    this.messageObserver?.disconnect()
    this.messageObserver = null
  }

  /**
   * 释放资源
   */
  dispose(): void {
    this.messages = []
    this.messageObserver?.disconnect()
    this.messageObserver = null
    this.hasSystemPrompt = true
  }
}
