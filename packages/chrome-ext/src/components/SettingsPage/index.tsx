import type { ConnectionConfig, ConnectionStatus } from '@/utils'
import { timeGap } from '@jl-org/tool'
import { ArrowLeft } from 'lucide-react'
import { memo, useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { ToolPermissionsManager } from '@/components/ToolPermissionsManager'
import { DEFAULT_CONNECTION_CONFIG } from '@/config'
import { checkConnectionStatus, ChromeStorage, getConnectionStatusIcon, getConnectionStatusText, validateServerUrl } from '@/utils'

export interface SettingsPageProps {
  onBack: () => void
  connectionConfig?: ConnectionConfig
  onConnectionConfigChange?: (config: ConnectionConfig) => void
}

export const SettingsPage = memo<SettingsPageProps>((props) => {
  const { onBack, connectionConfig: externalConfig, onConnectionConfigChange } = props

  const [connectionConfig, setConnectionConfig] = useState<ConnectionConfig>(DEFAULT_CONNECTION_CONFIG)
  const [loading, setLoading] = useState(true)
  const [validating, setValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{ valid: boolean, error?: string } | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected')
  const [lastChecked, setLastChecked] = useState<number>(0)

  /** 加载连接配置 */
  useEffect(() => {
    loadConnectionConfig()
  }, [])

  /** 同步外部连接配置 */
  useEffect(() => {
    if (externalConfig) {
      setConnectionConfig(externalConfig)
    }
  }, [externalConfig])

  /** 自动检查连接状态 */
  useEffect(() => {
    if (connectionConfig.serverUrl && !loading) {
      checkCurrentConnectionStatus()
    }
  }, [connectionConfig.serverUrl, loading])

  const loadConnectionConfig = async () => {
    try {
      const config = await ChromeStorage.getConnectionConfig()
      setConnectionConfig(config)
    }
    catch (error) {
      console.error('加载连接配置失败:', error)
    }
    finally {
      setLoading(false)
    }
  }

  /** 检查当前连接状态 */
  const checkCurrentConnectionStatus = async () => {
    if (!connectionConfig.serverUrl.trim()) {
      setConnectionStatus('disconnected')
      return
    }

    setConnectionStatus('connecting')
    try {
      const state = await checkConnectionStatus()
      setConnectionStatus(state.status)
      setLastChecked(state.lastChecked)
    }
    catch (error) {
      setConnectionStatus('error')
      setLastChecked(Date.now())
    }
  }

  /** 保存服务器地址 */
  const handleServerUrlChange = async (value: string) => {
    DEFAULT_CONNECTION_CONFIG.serverUrl = value
    const newConfig = { ...connectionConfig, serverUrl: value }
    setConnectionConfig(newConfig)
    setValidationResult(null) // 清除之前的验证结果

    /** 同步到主页面 */
    if (onConnectionConfigChange) {
      onConnectionConfigChange(newConfig)
    }

    await ChromeStorage.setConnectionConfig({ serverUrl: value })
  }

  /** 测试连接 */
  const handleTestConnection = async () => {
    if (!connectionConfig.serverUrl.trim()) {
      setValidationResult({ valid: false, error: '请输入服务器地址' })
      return
    }

    setValidating(true)
    setValidationResult(null)

    try {
      const result = await validateServerUrl(connectionConfig.serverUrl)
      setValidationResult(result)

      /** 更新连接状态 */
      setConnectionStatus(result.valid
        ? 'connected'
        : 'error')
      setLastChecked(Date.now())
    }
    catch (error) {
      setValidationResult({ valid: false, error: '验证过程中发生错误' })
      setConnectionStatus('error')
      setLastChecked(Date.now())
    }
    finally {
      setValidating(false)
    }
  }

  return (
    <div className="max-w-xs min-w-[300px] w-full bg-gray-50 p-3 dark:bg-gray-900">
      <Card
        className="w-full"
        shadow="md"
        rounded="md"
        padding="sm"
      >
        {/* Header */ }
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={ onBack }
              className="p-1 text-gray-600 transition-colors dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              title="返回"
            >
              <ArrowLeft size={ 18 } />
            </button>
            <h1 className="text-lg text-gray-800 font-bold dark:text-white">设置</h1>
          </div>
        </div>

        {/* 连接设置 */ }
        <div className="mb-4">
          <h2 className="mb-2 text-sm text-gray-700 font-medium dark:text-gray-300">🔗 连接设置</h2>
          <div className="border border-gray-200 rounded bg-white p-3 space-y-3 dark:border-gray-700 dark:bg-gray-800">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">服务器地址:</label>
              <input
                type="text"
                value={ connectionConfig.serverUrl }
                onChange={ e => handleServerUrlChange(e.target.value) }
                placeholder="请输入服务器地址"
                className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                disabled={ loading }
              />
            </div>

            {/* 连接状态显示 */ }
            <div className="flex items-center justify-between rounded bg-gray-50 p-2 dark:bg-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-sm">{ getConnectionStatusIcon(connectionStatus) }</span>
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  { getConnectionStatusText(connectionStatus) }
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                { timeGap(lastChecked) }
              </span>
            </div>

            {/* 验证结果显示 */ }
            { validationResult && (
              <div className={ `rounded p-2 text-xs ${validationResult.valid
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }` }>
                { validationResult.valid
                  ? '✅ 连接成功'
                  : `❌ ${validationResult.error}` }
              </div>
            ) }

            {/* 测试连接按钮 */ }
            <div className="flex items-center justify-between">
              <Button
                size="sm"
                onClick={ handleTestConnection }
                disabled={ validating || loading }
                className="text-xs"
              >
                { validating
                  ? '🔄 测试中...'
                  : '🔍 测试连接' }
              </Button>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                配置已自动保存
              </div>
            </div>
          </div>
        </div>

        {/* 工具权限管理 */ }
        <div className="mb-4">
          <h2 className="mb-2 text-sm text-gray-700 font-medium dark:text-gray-300">🔐 工具权限管理</h2>
          <ToolPermissionsManager />
        </div>
      </Card>
    </div>
  )
})

SettingsPage.displayName = 'SettingsPage'
