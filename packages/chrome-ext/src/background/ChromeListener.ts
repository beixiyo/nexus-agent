import type { ListenerCallback, ListenerOptions, MessageData, ResourceType, ResponseData, StorageChange, UrlType } from '@/types'
import { ChromeEvent } from './ChromeEvent'

/**
 * Chrome 扩展监听器管理器
 * 提供网络请求、标签页、存储等事件的监听功能
 */
export class ChromeListener {
  static options: ListenerOptions = {
    debug: true,
    name: 'ListenerManager',
  }

  /**
   * 记录调试日志
   */
  private static log(message: string, ...data: any[]) {
    if (this.options.debug) {
      console.log(`[${this.options.name}] ${message}`, ...data)
    }
  }

  /**
   * 监听网络请求
   */
  static listenWebRequest(config: {
    /** URL 模式数组 */
    urls?: UrlType[]
    /** 资源类型数组 */
    types?: ResourceType[]
    /** 标签页 ID 数组 */
    tabId?: number
    /** 窗口 ID 数组 */
    windowId?: number
    /** 是否向 content scripts 发送事件 */
    notifyContentScripts?: boolean
    /** 请求发起前回调 */
    onBeforeRequest?: ListenerCallback<chrome.webRequest.OnBeforeRequestDetails>
    /** 请求头修改前回调 */
    onBeforeSendHeaders?: ListenerCallback<chrome.webRequest.OnBeforeSendHeadersDetails>
    /** 响应头接收后回调 */
    onHeadersReceived?: ListenerCallback<chrome.webRequest.OnHeadersReceivedDetails>
    /** 请求完成回调 */
    onCompleted?: ListenerCallback<chrome.webRequest.OnCompletedDetails>
    /** 请求错误回调 */
    onErrorOccurred?: ListenerCallback<chrome.webRequest.OnErrorOccurredDetails>
    /** 请求重定向回调 */
    onBeforeRedirect?: ListenerCallback<chrome.webRequest.OnBeforeRedirectDetails>
  }) {
    const {
      urls = ['<all_urls>'],
      types = ['main_frame'],
      tabId,
      windowId,
      notifyContentScripts = true,
      ...callbacks
    } = config

    const filter: chrome.webRequest.RequestFilter = { urls, types, tabId, windowId }

    ChromeListener.log('注册网络请求监听器', filter)

    /** 请求发起前 */
    if (callbacks.onBeforeRequest) {
      const listener = (details: chrome.webRequest.OnBeforeRequestDetails) => {
        ChromeListener.log('请求发起前', details.url)
        if (notifyContentScripts && details.tabId) {
          ChromeEvent.sendToContentScripts(details.tabId, {
            type: 'webRequest.onBeforeRequest',
            data: details,
          })
        }

        return callbacks.onBeforeRequest!(details)
      }
      chrome.webRequest.onBeforeRequest.addListener(
        listener,
        filter,
        ['requestBody'],
      )
    }

    /** 请求头修改前 */
    if (callbacks.onBeforeSendHeaders) {
      const listener = (details: chrome.webRequest.OnBeforeSendHeadersDetails) => {
        ChromeListener.log('请求头修改前', details.url)
        if (notifyContentScripts && details.tabId) {
          ChromeEvent.sendToContentScripts(details.tabId, {
            type: 'webRequest.onBeforeSendHeaders',
            data: details,
          })
        }
        return callbacks.onBeforeSendHeaders!(details)
      }
      chrome.webRequest.onBeforeSendHeaders.addListener(
        listener,
        filter,
        ['requestHeaders'],
      )
    }

    /** 响应头接收后 */
    if (callbacks.onHeadersReceived) {
      const listener = (details: chrome.webRequest.OnHeadersReceivedDetails) => {
        ChromeListener.log('响应头接收后', details.url)
        if (notifyContentScripts && details.tabId) {
          ChromeEvent.sendToContentScripts(details.tabId, {
            type: 'webRequest.onHeadersReceived',
            data: details,
          })
        }
        return callbacks.onHeadersReceived!(details)
      }
      chrome.webRequest.onHeadersReceived.addListener(
        listener,
        filter,
        ['responseHeaders'],
      )
    }

    /** 请求完成 */
    if (callbacks.onCompleted) {
      const listener = (details: chrome.webRequest.OnCompletedDetails) => {
        ChromeListener.log('请求完成', details.url)
        if (notifyContentScripts && details.tabId) {
          ChromeEvent.sendToContentScripts(details.tabId, {
            type: 'webRequest.onCompleted',
            data: details,
          })
        }
        return callbacks.onCompleted!(details)
      }
      chrome.webRequest.onCompleted.addListener(
        listener,
        filter,
      )
    }

    /** 请求错误 */
    if (callbacks.onErrorOccurred) {
      const listener = (details: chrome.webRequest.OnErrorOccurredDetails) => {
        ChromeListener.log('请求错误', details.url, details.error)
        if (notifyContentScripts && details.tabId) {
          ChromeEvent.sendToContentScripts(details.tabId, {
            type: 'webRequest.onErrorOccurred',
            data: details,
          })
        }
        return callbacks.onErrorOccurred!(details)
      }
      chrome.webRequest.onErrorOccurred.addListener(
        listener,
        filter,
      )
    }

    /** 请求重定向 */
    if (callbacks.onBeforeRedirect) {
      const listener = (details: chrome.webRequest.OnBeforeRedirectDetails) => {
        ChromeListener.log('请求重定向', details.url, details.redirectUrl)
        if (notifyContentScripts && details.tabId) {
          ChromeEvent.sendToContentScripts(details.tabId, {
            type: 'webRequest.onBeforeRedirect',
            data: details,
          })
        }
        return callbacks.onBeforeRedirect!(details)
      }
      chrome.webRequest.onBeforeRedirect.addListener(
        listener,
        filter,
      )
    }
  }

  /**
   * 监听标签页事件
   */
  static listenTabs(config: {
    /** 标签页创建回调 */
    onCreated?: ListenerCallback<chrome.tabs.Tab>
    /** 标签页更新回调 */
    onUpdated?: ListenerCallback<{ tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab }>
    /** 标签页移除回调 */
    onRemoved?: ListenerCallback<{ tabId: number, removeInfo: chrome.tabs.TabRemoveInfo }>
    /** 标签页激活回调 */
    onActivated?: ListenerCallback<chrome.tabs.TabActiveInfo>
  }) {
    ChromeListener.log('注册标签页监听器')

    if (config.onCreated) {
      const listener = (tab: chrome.tabs.Tab) => {
        ChromeListener.log('标签页创建', tab.url)
        config.onCreated!(tab)
      }
      chrome.tabs.onCreated.addListener(listener)
    }

    if (config.onUpdated) {
      const listener = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
        ChromeListener.log('标签页更新', { url: tab.url, changeInfo })
        config.onUpdated!({ tabId, changeInfo, tab })
      }
      chrome.tabs.onUpdated.addListener(listener)
    }

    if (config.onRemoved) {
      const listener = (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
        ChromeListener.log('标签页移除', tabId)
        config.onRemoved!({ tabId, removeInfo })
      }
      chrome.tabs.onRemoved.addListener(listener)
    }

    if (config.onActivated) {
      const listener = (activeInfo: chrome.tabs.TabActiveInfo) => {
        ChromeListener.log('标签页激活', activeInfo)
        config.onActivated!(activeInfo)
      }
      chrome.tabs.onActivated.addListener(listener)
    }
  }

  /**
   * 监听存储变化
   */
  static listenStorage(config: {
    /** 存储变化回调 */
    onChange: ListenerCallback<{ changes: { [key: string]: StorageChange }, areaName: string }>
  }) {
    ChromeListener.log('注册存储监听器')

    const listener = (changes: { [key: string]: StorageChange }, areaName: string) => {
      ChromeListener.log('存储变化', { areaName, changes })
      config.onChange({ changes, areaName })
    }

    chrome.storage.onChanged.addListener(listener)
  }

  /**
   * 监听扩展事件
   */
  static listenLifecycle(config: {
    /** 扩展安装/更新回调 */
    onInstalled?: ListenerCallback<chrome.runtime.InstalledDetails>
    /** 扩展启动回调 */
    onStartup?: ListenerCallback<void>
    /** 消息通信回调 */
    onMessage?: (message: MessageData, sender: chrome.runtime.MessageSender, sendResponse: (response: ResponseData) => void) => void
  }) {
    ChromeListener.log('注册扩展事件监听器')

    if (config.onInstalled) {
      const listener = (details: chrome.runtime.InstalledDetails) => {
        ChromeListener.log('扩展安装/更新', details.reason)
        config.onInstalled!(details)
      }
      chrome.runtime.onInstalled.addListener(listener)
    }

    if (config.onStartup) {
      const listener = () => {
        ChromeListener.log('扩展启动')
        config.onStartup!()
      }
      chrome.runtime.onStartup.addListener(listener)
    }

    if (config.onMessage) {
      const listener = (
        message: MessageData,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: ResponseData) => void,
      ) => {
        ChromeListener.log('收到消息', { message, sender })
        config.onMessage!(message, sender, sendResponse)
        return true
      }
      chrome.runtime.onMessage.addListener(listener)
    }
  }
}
