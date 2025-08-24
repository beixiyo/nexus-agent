import type { SelectorType } from '../PlatformAdapter'
import { PlatformAdapter } from '@/content/PlatformAdapter'
import { isCtrlEnterKey, waitForElement, waitForElements } from '@/utils'

/**
 * AI Studio Gemini 平台适配器
 * 实现 PlatformAdapter 接口以适配 AI Studio Gemini 平台
 */
export class AiStudioGeminiAgent extends PlatformAdapter {
  override inputSendKeyEvent = isCtrlEnterKey

  async getQAEls(): Promise<{ qEls: HTMLElement[], aEls: HTMLElement[] }> {
    const qEls: HTMLElement[] = []
    const aEls: HTMLElement[] = []

    /** 获取所有聊天回合的元素，以便按顺序遍历。 */
    const allTurns = Array.from(document.body.querySelectorAll('ms-chat-turn')) as HTMLElement[]
    let i = 0
    let isUser = false
    let isModel = false
    let isThought = false
    let isInit = true
    let currentTurn = allTurns[i]

    while (currentTurn) {
      if ((isUser || isThought) && !isInit) {
        const isModelTurn = currentTurn.querySelector('[data-turn-role="Model"]')
        if (isModelTurn) {
          const isThoughtChunk = currentTurn.querySelector('ms-thought-chunk')
          if (isThoughtChunk) {
            isThought = true
            isModel = false
            isUser = false
            currentTurn = allTurns[++i]
            continue
          }
          else {
            aEls.push(currentTurn)
            isModel = true
            isUser = false
            isThought = false
          }
        }
      }

      if (isModel || isInit) {
        const isUserTurn = currentTurn.querySelector('[data-turn-role="User"]')
        if (isUserTurn) {
          qEls.push(currentTurn)
          isUser = true
          isModel = false
          isThought = false
          isInit = false
        }
      }

      currentTurn = allTurns[++i]
    }

    return { qEls, aEls }
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

  override extraHandleQA(outHTML: string = ''): string {
    return outHTML
      .replace(/editmore_vert|more_vert/g, '')
      .replace(/thumb_upthumb_down(\s*\d+.\d+s)?/g, '')
  }
}
