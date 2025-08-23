import type { SelectorType } from '../PlatformAdapter'
import { PlatformAdapter } from '@/content/PlatformAdapter'

/**
 * Gemini 平台适配器
 * 实现 PlatformAdapter 接口以适配 Gemini 平台
 */
export class GeminiAgent extends PlatformAdapter {
  getUserInputSelector(): SelectorType {
    throw new Error('Method not implemented.')
  }

  getSendButtonSelector(): SelectorType {
    throw new Error('Method not implemented.')
  }

  getQSelector(): SelectorType {
    throw new Error('Method not implemented.')
  }

  getASelector(): SelectorType {
    throw new Error('Method not implemented.')
  }

  getLLMSendingSelector(): SelectorType {
    throw new Error('Method not implemented.')
  }

  getMessageContainerSelector(): SelectorType {
    throw new Error('Method not implemented.')
  }

  getNewChatSelector(): SelectorType {
    throw new Error('Method not implemented.')
  }
}
