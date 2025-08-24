import type { SelectorType } from '../PlatformAdapter'
import { PlatformAdapter } from '@/content/PlatformAdapter'
import { waitForElement, waitForElements } from '@/utils'

/**
 * AI Studio Gemini 平台适配器
 * 实现 PlatformAdapter 接口以适配 AI Studio Gemini 平台
 */
export class AiStudioGeminiAgent extends PlatformAdapter {
  async getQAEls(): Promise<{ qEls: HTMLElement[], aEls: HTMLElement[] }> {
    const qEls = await waitForElements('.chat-turn-container.user')
    const aEls = await waitForElements('.model-prompt-container')

    const clonedAEls = aEls.map((el) => {
      const clonedEl = el.cloneNode(true) as HTMLElement
      clonedEl.querySelector('ms-thought-chunk')?.remove()
      return clonedEl
    })

    return { qEls, aEls: clonedAEls }
  }

  async getUserInputEl(): SelectorType {
    const el = await waitForElement('ms-chunk-input textarea')
    return [el]
  }

  async getSendButtonEl(): SelectorType {
    const el = await waitForElement('button[aria-label="Run"]')
    return [el]
  }

  getObserveSendingEl(): SelectorType {
    return this.getSendButtonEl()
  }

  async getNewChatEls(): SelectorType {
    const els = await waitForElements('.nav-item[href*="new_chat"]', 1000)
    return els
  }

  isSending(el: HTMLElement): boolean {
    return el.getAttribute('type') === 'button'
  }
}
