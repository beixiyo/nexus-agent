import type { Status } from '@/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { checkConnectionStatus } from '@/utils'

/**
 * 连接状态轮询 Hook
 * @param serverUrl 服务器地址
 * @param interval 轮询间隔（毫秒），默认 5000ms
 * @param enabled 是否启用轮询
 * @param onStatusChange 连接状态变化时的回调函数
 */
export function useConnectionPolling(
  serverUrl: string,
  interval: number = 5000,
  enabled: boolean = true,
  onStatusChange?: (status: Status, error: string) => void,
) {
  const [status, setStatus] = useState<Status>('disconnected')
  const [lastChecked, setLastChecked] = useState<number>(0)
  const [error, setError] = useState<string>('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  /** 检查连接状态 */
  const checkStatus = useCallback(async () => {
    if (!serverUrl.trim()) {
      const newStatus: Status = 'disconnected'
      const newError = '未配置服务器地址'

      if (newStatus !== status) {
        setStatus(newStatus)
        setError(newError)
        onStatusChange?.(newStatus, newError)
      }
      setLastChecked(Date.now())
      return
    }

    try {
      const result = await checkConnectionStatus()
      const newStatus = result.status as Status
      const newError = result.error || ''

      /** 只有当状态发生变化时才更新 */
      if (newStatus !== status) {
        setStatus(newStatus)
        setError(newError)
        onStatusChange?.(newStatus, newError)
      }
      setLastChecked(result.lastChecked)
    }
    catch (err: any) {
      const errorStatus: Status = 'error'
      const newError = err.message || '连接检查失败'

      if (errorStatus !== status) {
        setStatus(errorStatus)
        setError(newError)
        onStatusChange?.(errorStatus, newError)
      }
      setLastChecked(Date.now())
    }
  }, [serverUrl, status, onStatusChange])

  /** 启动轮询 */
  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    /** 立即检查一次 */
    checkStatus()

    /** 设置定时轮询 */
    intervalRef.current = setInterval(checkStatus, interval)
  }, [checkStatus, interval])

  /** 停止轮询 */
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  /** 手动检查一次（用于初始化或配置变更时） */
  const checkOnce = useCallback(() => {
    checkStatus()
  }, [checkStatus])

  /** 监听 serverUrl 变化，重新启动轮询 */
  useEffect(() => {
    if (enabled) {
      startPolling()
    }
    else {
      stopPolling()
    }

    return () => {
      stopPolling()
    }
  }, [enabled, serverUrl, startPolling, stopPolling])

  /** 组件卸载时清理 */
  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [stopPolling])

  return {
    status,
    lastChecked,
    error,
    checkOnce,
    startPolling,
    stopPolling,
  }
}
