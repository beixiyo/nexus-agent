import { AgentApi } from '@/api/AgentApi'
import { ChromeStorage } from './storage'

/**
 * 连接状态类型
 */
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error'

/**
 * 连接状态信息
 */
export interface ConnectionState {
  status: ConnectionStatus
  lastChecked: number
  error?: string
}

/**
 * 验证服务器地址是否有效
 */
export async function validateServerUrl(url: string): Promise<{ valid: boolean, error?: string }> {
  try {
    /** 验证 URL 格式 */
    const urlObj = new URL(url)
    if (!urlObj.protocol || !urlObj.hostname) {
      return { valid: false, error: '无效的 URL 格式' }
    }
    await AgentApi.health()

    return { valid: true }
  }
  catch (error: any) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { valid: false, error: '网络连接失败' }
    }
    if (error.name === 'AbortError') {
      return { valid: false, error: '连接超时' }
    }
    return { valid: false, error: error.message || '验证失败' }
  }
}

/**
 * 检查连接状态
 */
export async function checkConnectionStatus(): Promise<ConnectionState> {
  try {
    /** 获取当前配置的服务器地址 */
    const config = await ChromeStorage.getConnectionConfig()

    if (!config.serverUrl.trim()) {
      return {
        status: 'disconnected',
        lastChecked: Date.now(),
        error: '未配置服务器地址',
      }
    }

    const result = await validateServerUrl(config.serverUrl)
    return {
      status: result.valid
        ? 'connected'
        : 'error',
      lastChecked: Date.now(),
      error: result.valid
        ? undefined
        : result.error,
    }
  }
  catch (error: any) {
    return {
      status: 'error',
      lastChecked: Date.now(),
      error: error.message || '连接检查失败',
    }
  }
}

/**
 * 获取连接状态文本
 */
export function getConnectionStatusText(status: ConnectionStatus): string {
  switch (status) {
    case 'connected':
      return '已连接'
    case 'disconnected':
      return '未连接'
    case 'connecting':
      return '连接中'
    case 'error':
      return '连接错误'
    default:
      return '未知状态'
  }
}

/**
 * 获取连接状态图标
 */
export function getConnectionStatusIcon(status: ConnectionStatus): string {
  switch (status) {
    case 'connected':
      return '🟢'
    case 'disconnected':
      return '⚪'
    case 'connecting':
      return '🟡'
    case 'error':
      return '🔴'
    default:
      return '❓'
  }
}
