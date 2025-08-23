import { PlatformAdapter } from '@/content/PlatformAdapter'
import { waitForElement, waitForElements } from '@/utils'

/**
 * 千问平台适配器
 * 实现 PlatformAdapter 接口以适配千问平台
 */
export class QwenAgent extends PlatformAdapter {
  async getUserInputSelector() {
    const el = await waitForElement('textarea.ant-input')
    return [el]
  }

  async getSendButtonSelector() {
    const el = await waitForElement('.operateBtn--qMhYIdIu')
    return [el]
  }

  getObserveSendingSelector() {
    return this.getSendButtonSelector()
  }

  async getQSelector() {
    const el = await waitForElements('.questionItem--UrcRIuHd', 1000)
    return el
  }

  async getASelector() {
    const el = await waitForElements('.answerItem--Fjp8fBsN', 1000)
    return el
  }

  async getNewChatSelector() {
    const selectors = ['button.tongyi-ui-button', '.createBtn--CjdYR1Br']
    return Promise.all(selectors.map(selector => waitForElement(selector, 800)))
  }

  isSending(el: HTMLElement): boolean {
    return el.classList.contains('stop--P_jcrPFo')
  }
}
