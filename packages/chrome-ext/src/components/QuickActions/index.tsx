import { memo } from 'react'
import { Button } from '@/components/Button'
import type { Status } from '@/types'

export interface QuickActionsProps {
  onTestConnection: () => void
  onOpenSettings: () => void
  connectionStatus: Status
}

export const QuickActions = memo<QuickActionsProps>((props) => {
  const {
    onTestConnection,
    onOpenSettings,
    connectionStatus,
  } = props

  return (
    <div className="mb-3">
      <h2 className="mb-2 text-sm text-gray-700 font-medium dark:text-gray-300">
        🤖 快速操作
      </h2>
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          onClick={onTestConnection}
          disabled={connectionStatus === 'connecting' || connectionStatus === 'processing'}
          loading={connectionStatus === 'connecting' || connectionStatus === 'processing'}
          className="text-xs"
        >
          🔧 测试连接
        </Button>
        <Button
          size="sm"
          onClick={onOpenSettings}
          className="text-xs"
        >
          ⚙️ 设置
        </Button>
      </div>
    </div>
  )
})

QuickActions.displayName = 'QuickActions'