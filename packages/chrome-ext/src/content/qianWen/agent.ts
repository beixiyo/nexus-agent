import { PlatformAdapter } from '@/content/PlatformAdapter'
import { waitForElement, waitForElements } from '@/utils'

/**
 * 千问平台适配器
 * 实现 PlatformAdapter 接口以适配千问平台
 */
export class QwenAgent extends PlatformAdapter {
  async getQAEls(): Promise<{ qEls: HTMLElement[], aEls: HTMLElement[] }> {
    const qEls = await waitForElements('.questionItem--UrcRIuHd')
    const aEls = await waitForElements('.answerItem--Fjp8fBsN')
    return { qEls, aEls }
  }

  async getUserInputEl() {
    const el = await waitForElement('textarea.ant-input')
    return [el]
  }

  async getSendButtonEl() {
    const el = await waitForElement('.operateBtn--qMhYIdIu')
    return [el]
  }

  getObserveSendingEl() {
    return this.getSendButtonEl()
  }

  async getNewChatEls() {
    const selectors = ['button.tongyi-ui-button', '.createBtn--CjdYR1Br']
    return Promise.all(selectors.map(selector => waitForElement(selector, 800)))
  }

  isSending(el: HTMLElement): boolean {
    return el.classList.contains('stop--P_jcrPFo')
  }
}
