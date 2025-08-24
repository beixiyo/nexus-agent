import { PlatformAdapter } from '@/content/PlatformAdapter'
import { waitForElement, waitForElements } from '@/utils'

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
    const el = await waitForElement('div._7436101[role="button"]')
    return [el]
  }

  async getObserveSendingSelector() {
    const el = await waitForElement('.bf38813a')
    return [el]
  }

  async getQSelector() {
    const el = await waitForElements('._9663006')
    return el
  }

  async getASelector() {
    const el = await waitForElements('._4f9bf79._43c05b5')
    return el
  }

  async getNewChatSelector() {
    const selectors = ['.c7dddcde', '.a7f3a288.f0d4f23d>div:nth-child(3) .ds-icon-button']
    return Promise.all(selectors.map(selector => waitForElement(selector, 800)))
  }

  isSending(el: HTMLElement): boolean {
    return !!el.querySelector('.480132b')
  }
}
