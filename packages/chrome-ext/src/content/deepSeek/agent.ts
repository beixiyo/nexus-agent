import { PlatformAdapter } from '@/content/PlatformAdapter'
import { waitForElement, waitForElements } from '@/utils'

/**
 * DeepSeek 平台适配器
 * 实现 PlatformAdapter 接口以适配 DeepSeek 平台
 */
export class DeepSeekAgent extends PlatformAdapter {
  async getQAEls(): Promise<{ qEls: HTMLElement[], aEls: HTMLElement[] }> {
    const qEls = await waitForElements('._9663006')
    const aEls = await waitForElements('._4f9bf79._43c05b5 .ds-markdown.ds-markdown--block')
    return { qEls, aEls }
  }

  async getUserInputEl() {
    const el = await waitForElement('#chat-input')
    return [el]
  }

  async getSendButtonEl() {
    const el = await waitForElement('div._7436101[role="button"]')
    return [el]
  }

  async getObserveSendingEl() {
    const el = await waitForElement('.bf38813a')
    return [el]
  }

  async getNewChatEls() {
    const selectors = ['.c7dddcde', '.a7f3a288.f0d4f23d>div:nth-child(3) .ds-icon-button']
    return Promise.all(selectors.map(selector => waitForElement(selector, 800)))
  }

  isSending(el: HTMLElement): boolean {
    return !!el.querySelector('.480132b')
  }
}
