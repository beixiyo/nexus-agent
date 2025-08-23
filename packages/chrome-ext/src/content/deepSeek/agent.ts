import type { EventManager, MessageManager } from '../managers'
import { PlatformAdapter } from '@/content/PlatformAdapter'
import { waitForElement } from '@/utils'

/**
 * DeepSeek 平台适配器
 * 实现 PlatformAdapter 接口以适配 DeepSeek 平台
 */
export class DeepSeekAgent extends PlatformAdapter {
  async getUserInputSelector() {
    const el = await waitForElement('#chat-input')
    return [el]
  }

  async getSendButtonSelector() {
    const el = await waitForElement('div._7436101.bcc55ca1[role="button"]')
    return [el]
  }

  getObserveSendingSelector() {
    return this.getSendButtonSelector()
  }

  async getQSelector() {
    const el = await waitForElement('._9663006')
    return [el]
  }

  async getASelector() {
    const el = await waitForElement('._4f9bf79._43c05b5')
    return [el]
  }

  async getNewChatSelector() {
    const selectors = ['.c7dddcde', '.a7f3a288.f0d4f23d>div:nth-child(3) .ds-icon-button']
    return Promise.all(selectors.map(selector => waitForElement(selector)))
  }

  isSending(el: HTMLElement): boolean {
    return !el.querySelector('div')?.querySelector('svg')
  }
}
