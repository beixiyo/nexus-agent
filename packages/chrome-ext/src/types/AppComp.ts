/**
 * @description 首页组件类型
 */

/**
 * 统一的状态类型定义
 * 用于连接状态、处理状态、活动状态等
 */
export type Status
  = | 'connected' // 已连接
    | 'disconnected' // 未连接
    | 'connecting' // 连接中
    | 'idle' // 空闲
    | 'processing' // 处理中
    | 'success' // 成功
    | 'error' // 错误
    | 'pending' // 等待中

/**
 * 活动项目类型定义
 */
export interface ActivityItem {
  id: number
  type: string
  action: string
  target: string
  time: string
  status: Status
}
