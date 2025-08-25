import type { ActivityItem } from '@/types'
import type { ConnectionConfig } from '@/utils'
import { useEffect, useState } from 'react'
import { AgentStatus } from '@/components/AgentStatus'
import { Card } from '@/components/Card'
import { Checkbox } from '@/components/Checkbox'
import { RecentActivity } from '@/components/RecentActivity'
import { SettingsPage } from '@/components/SettingsPage'
import { StatusIndicator } from '@/components/StatusIndicator'
import { DEFAULT_AGENT_ENABLED, DEFAULT_CONNECTION_CONFIG } from '@/config'
import { ChromeStorage } from '@/utils'
import { useConnectionPolling, useTheme } from './hooks'

/** 默认最近活动数据 - 空数组，只显示真实数据 */
const defaultRecentActivities: ActivityItem[] = []

export default function App() {
  useTheme()

  const [agentEnabled, setAgentEnabled] = useState(DEFAULT_AGENT_ENABLED)
  const [currentPage, setCurrentPage] = useState<'main' | 'settings'>('main')
  const [connectionConfig, setConnectionConfig] = useState<ConnectionConfig>(DEFAULT_CONNECTION_CONFIG)
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>(defaultRecentActivities)

  /** 处理启用/禁用状态变化 */
  const handleAgentEnabledChange = async (enabled: boolean) => {
    setAgentEnabled(enabled)

    /** 保存到存储 */
    await ChromeStorage.setAgentEnabled(enabled)

    /** 发送消息给 content scripts */
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: enabled
            ? 'agent.enable'
            : 'agent.disable',
          data: { enabled },
          timestamp: Date.now(),
        })
      }
    })
  }

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

  const loadAgentEnabled = async () => {
    try {
      const enabled = await ChromeStorage.getAgentEnabled()
      setAgentEnabled(enabled)
    }
    catch (error) {
      console.error('加载 Agent 启用状态失败:', error)
    }
  }

  const loadRecentActivities = async () => {
    try {
      const activities = await ChromeStorage.getRecentActivities()
      setRecentActivities(activities)
    }
    catch (error) {
      console.error('加载最近活动记录失败:', error)
    }
  }

  /** 监听存储变化，实时更新活动记录 */
  useEffect(() => {
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.recentActivities) {
        const newActivities = changes.recentActivities.newValue
        if (newActivities && Array.isArray(newActivities)) {
          setRecentActivities(newActivities)
        }
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange)

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [])

  /** 加载配置 */
  useEffect(() => {
    loadConnectionConfig()
    loadAgentEnabled()
    loadRecentActivities()
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
              <StatusIndicator
                status={ agentEnabled
                  ? 'connected'
                  : 'disconnected' }
                showText={ false }
                size="sm"
              />
              <span className="text-xs text-gray-600 dark:text-gray-300">
                { agentEnabled
                  ? '启用'
                  : '禁用' }
              </span>
              <Checkbox
                checked={ agentEnabled }
                onChange={ handleAgentEnabledChange }
                size={ 20 }
              />
            </div>
          </div>

          <AgentStatus
            connectionStatus={ connectionStatus }
            lastChecked={ lastChecked }
            onOpenSettings={ () => setCurrentPage('settings') }
          />

          <RecentActivity
            activities={ recentActivities }
            maxVisible={ 5 }
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
