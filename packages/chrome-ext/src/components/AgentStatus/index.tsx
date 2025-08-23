import { memo } from 'react'
import { StatusIndicator } from '@/components/StatusIndicator'
import type { Status } from '@/types'

export interface AgentStatusProps {
  connectionStatus: Status
  activePage: string
  agentEnabled: boolean
  lastActivity: string
}

export const AgentStatus = memo<AgentStatusProps>((props) => {
  const {
    connectionStatus,
    activePage,
    agentEnabled,
    lastActivity,
  } = props

  return (
    <div className="mb-3">
      <h2 className="mb-2 text-sm text-gray-700 font-medium dark:text-gray-300">
        📡 Agent 状态
      </h2>
      <div className="border border-gray-200 rounded bg-white p-3 space-y-1 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-gray-400">本地服务器:</span>
          <StatusIndicator status={connectionStatus} size="xs" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-gray-400">当前网站:</span>
          <span className="text-xs text-gray-800 font-medium dark:text-gray-200">
            {activePage}
            {' '}
            {agentEnabled
              ? '(已启用)'
              : '(未启用)'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-gray-400">最后活动:</span>
          <span className="text-xs text-gray-800 font-medium dark:text-gray-200">
            {lastActivity}
          </span>
        </div>
      </div>
    </div>
  )
})

AgentStatus.displayName = 'AgentStatus'