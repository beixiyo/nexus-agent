import type { MessageData, ResponseData } from '@/types'

export class ChromeEvent {
  /**
   * 向指定 content scripts 发送消息
   */
  static async sendToContentScripts(tabId: number, message: MessageData): Promise<ResponseData> {
    try {
      /** 先检查标签页是否存在 */
      const tab = await chrome.tabs.get(tabId)
      if (!tab) {
        console.warn(`标签页 ${tabId} 不存在`)
        return { success: false, error: '标签页不存在' }
      }

      /** 发送消息 */
      const response = await chrome.tabs.sendMessage(tabId, message)
      return response || { success: true, data: null }
    }
    catch (error) {
      console.warn('发送消息到 content script 失败:', error)
      return {
        success: false,
        error: error instanceof Error
          ? error.message
          : '未知错误',
      }
    }
  }
}
