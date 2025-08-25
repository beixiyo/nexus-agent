import type { ActivityItem } from '@/types'
import type { ConnectionConfig } from '@/utils'
import { useEffect, useState } from 'react'
import { AgentStatus } from '@/components/AgentStatus'
import { Card } from '@/components/Card'
import { Checkbox } from '@/components/Checkbox'
import { RecentActivity } from '@/components/RecentActivity'
import { SettingsPage } from '@/components/SettingsPage'
import { StatusIndicator } from '@/components/StatusIndicator'
import { DEFAULT_CONNECTION_CONFIG } from '@/config'
import { ChromeStorage } from '@/utils'
import { useConnectionPolling, useTheme } from './hooks'

/** 最近活动数据 */
const recentActivities: ActivityItem[] = [
  { id: 1, type: 'file', action: '创建文件', target: 'test.txt', time: '1分钟前', status: 'success' },
  { id: 2, type: 'web', action: '搜索网络', target: '天气', time: '3分钟前', status: 'success' },
  { id: 3, type: 'file', action: '读取文件', target: 'config.json', time: '5分钟前', status: 'success' },
  { id: 4, type: 'system', action: '获取系统信息', target: 'CPU 使用率', time: '8分钟前', status: 'error' },
]

export default function App() {
  useTheme()

  const [agentEnabled, setAgentEnabled] = useState(true)
  const [currentPage, setCurrentPage] = useState<'main' | 'settings'>('main')
  const [connectionConfig, setConnectionConfig] = useState<ConnectionConfig>(DEFAULT_CONNECTION_CONFIG)

  /** 使用连接状态轮询 Hook */
  const {
    status: connectionStatus,
    lastChecked,
    error: _connectionError,
  } = useConnectionPolling(connectionConfig.serverUrl, 5000, agentEnabled)

  const loadConnectionConfig = async () => {
    try {
      const config = await ChromeStorage.getConnectionConfig()
      setConnectionConfig(config)
      DEFAULT_CONNECTION_CONFIG.serverUrl = config.serverUrl
    }
    catch (error) {
      console.error('加载连接配置失败:', error)
    }
  }

  /** 加载连接配置 */
  useEffect(() => {
    loadConnectionConfig()
  }, [])

  /** 设置页面 */
  if (currentPage === 'settings') {
    return (
      <SettingsPage
        onBack={ () => setCurrentPage('main') }
        connectionConfig={ connectionConfig }
        onConnectionConfigChange={ setConnectionConfig }
      />
    )
  }

  /** 主页面 */
  return (
    <>
      <div className="max-w-xs min-w-[300px] w-full bg-gray-50 p-3 dark:bg-gray-900">
        <Card
          className="w-full"
          shadow="md"
          rounded="md"
          padding="sm"
        >
          {/* Header */ }
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-xl">🤖</div>
              <h1 className="text-lg text-gray-800 font-bold dark:text-white">Nexus Agent</h1>
            </div>
            <div className="flex items-center gap-2">
              <StatusIndicator status={ connectionStatus } showText={ false } size="sm" />
              <span className="text-xs text-gray-600 dark:text-gray-300">
                { agentEnabled
                  ? '启用'
                  : '禁用' }
              </span>
              <Checkbox
                checked={ agentEnabled }
                onChange={ setAgentEnabled }
                size={ 20 }
              />
            </div>
          </div>

          <AgentStatus
            connectionStatus={ connectionStatus }
            lastActivity="2分钟前"
            lastChecked={ lastChecked }
            onOpenSettings={ () => setCurrentPage('settings') }
          />

          <RecentActivity
            activities={ recentActivities }
          />

          {/* Info section */ }
          <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              插件会自动检测 LLM 页面并转换用户输入为 XML 格式，与本地服务交互执行工具。
            </p>
          </div>
        </Card>
      </div>
    </>
  )
}
