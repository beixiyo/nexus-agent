import type { Status, ActivityItem } from '@/types'
import { useState } from 'react'
import { Card } from '@/components/Card'
import { Checkbox } from '@/components/Checkbox'
import { StatusIndicator } from '@/components/StatusIndicator'
import { useTheme } from './hooks'
import { QuickActions } from '@/components/QuickActions'
import { AgentStatus } from '@/components/AgentStatus'
import { RecentActivity } from '@/components/RecentActivity'
import { SettingsPage } from '@/components/SettingsPage'

/** 工具分类数据 */
const toolCategories = [
  { id: 'file', name: '文件操作', enabled: true, icon: '📁' },
  { id: 'system', name: '系统信息', enabled: true, icon: '💻' },
  { id: 'web', name: '网络搜索', enabled: true, icon: '🌐' },
  { id: 'content', name: '内容处理', enabled: true, icon: '📝' },
  { id: 'command', name: '命令执行', enabled: false, icon: '⚡' },
]

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
  const [connectionStatus, setConnectionStatus] = useState<Status>('connected')
  const [activePage] = useState('ChatGPT') // 当前活动页面
  const [tools, setTools] = useState(toolCategories)
  const [currentPage, setCurrentPage] = useState<'main' | 'settings'>('main')

  /** 切换工具启用状态 */
  const toggleTool = (id: string) => {
    setTools(tools.map(tool =>
      tool.id === id
        ? { ...tool, enabled: !tool.enabled }
        : tool,
    ))
  }

  /** 测试连接 */
  const testConnection = () => {
    setConnectionStatus('connecting')

    /** 模拟连接测试 */
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70% 成功率
      if (success) {
        setConnectionStatus('connected')
      }
      else {
        setConnectionStatus('disconnected')
      }
    }, 2000)
  }



  /** 查看全部活动 */
  const viewAllActivities = () => {
    // @TODO: 实现查看全部活动功能
  }

  /** 设置页面 */
  if (currentPage === 'settings') {
    return (
      <SettingsPage
        onBack={() => setCurrentPage('main')}
        tools={tools}
        onToggleTool={toggleTool}
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

          <QuickActions
            onTestConnection={testConnection}
            onOpenSettings={() => setCurrentPage('settings')}
            connectionStatus={connectionStatus}
          />

          <AgentStatus
            connectionStatus={connectionStatus}
            activePage={activePage}
            agentEnabled={agentEnabled}
            lastActivity="2分钟前"
          />

          <RecentActivity
            activities={recentActivities}
            onViewAll={viewAllActivities}
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
