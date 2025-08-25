import type { Status } from '@/types'
import { Settings } from 'lucide-react'
import { memo } from 'react'
import { StatusIndicator } from '@/components/StatusIndicator'

export interface AgentStatusProps {
  connectionStatus: Status
  lastActivity: string
  lastChecked?: number
  onOpenSettings?: () => void
}

export const AgentStatus = memo<AgentStatusProps>((props) => {
  const {
    connectionStatus,
    lastActivity,
    lastChecked,
    onOpenSettings,
  } = props

  return (
    <div className="mb-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm text-gray-700 font-medium dark:text-gray-300">
          📡 Agent 状态
        </h2>
        {onOpenSettings && (
          <button
            onClick={ onOpenSettings }
            className="p-1 text-gray-500 transition-colors dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            title="设置"
          >
            <Settings size={ 16 } />
          </button>
        )}
      </div>
      <div className="border border-gray-200 rounded bg-white p-3 space-y-1 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-gray-400">本地服务器:</span>
          <StatusIndicator status={ connectionStatus } size="xs" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-gray-400">最后活动:</span>
          <span className="text-xs text-gray-800 font-medium dark:text-gray-200">
            {lastActivity}
          </span>
        </div>
        {lastChecked && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">最后检查:</span>
            <span className="text-xs text-gray-800 font-medium dark:text-gray-200">
              {new Date(lastChecked).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
    </div>
  )
})

AgentStatus.displayName = 'AgentStatus'
