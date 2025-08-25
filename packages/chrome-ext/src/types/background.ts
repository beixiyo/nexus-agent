/**
 * 存储变化类型
 */
export type StorageChange = {
  /** 旧值 */
  oldValue?: any
  /** 新值 */
  newValue?: any
}

export type ResourceType = `${chrome.webRequest.ResourceType}`

export type UrlType = '<all_urls>' | (string & {})

/**
 * 监听器配置选项
 */
export type ListenerOptions = {
  /** 是否启用调试日志 */
  debug?: boolean
  /** 监听器名称 */
  name?: string
}

/**
 * 监听器回调函数类型
 */
export type ListenerCallback<T = any> = (details: T) => undefined | chrome.webRequest.BlockingResponse

/**
 * 消息类型枚举
 */
export type MessageType
  /** 网络请求相关消息类型 */
  = | 'webRequest.onBeforeRequest'
    | 'webRequest.onBeforeSendHeaders'
    | 'webRequest.onHeadersReceived'
    | 'webRequest.onCompleted'
    | 'webRequest.onErrorOccurred'
    | 'webRequest.onBeforeRedirect'
    /** 插件状态相关消息类型 */
    | 'agent.enable'
    | 'agent.disable'

/**
 * 消息通信类型
 */
export type MessageData<T = any> = {
  /** 消息类型 */
  type: MessageType
  /** 消息数据 */
  data: T
  /** 消息 ID */
  id?: string
  /** 时间戳 */
  timestamp?: number
}

/**
 * 响应数据类型
 */
export type ResponseData = {
  /** 是否成功 */
  success: boolean
  /** 响应数据 */
  data?: any
  /** 错误信息 */
  error?: string
  /** 消息 ID */
  id?: string
}
