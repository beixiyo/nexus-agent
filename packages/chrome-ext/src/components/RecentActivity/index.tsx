import { memo } from 'react'
import { StatusIndicator } from '@/components/StatusIndicator'
import type { ActivityItem } from '@/types'

export interface RecentActivityProps {
  activities: ActivityItem[]
  onViewAll: () => void
}

export const RecentActivity = memo<RecentActivityProps>((props) => {
  const { activities, onViewAll } = props

  /** 获取活动图标 */
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'file':
        return '📁'
      case 'web':
        return '🌐'
      case 'system':
        return '💻'
      case 'content':
        return '📝'
      case 'command':
        return '⚡'
      default:
        return '🔧'
    }
  }

  return (
    <div className="mb-3">
      <h2 className="mb-2 text-sm text-gray-700 font-medium dark:text-gray-300">
        📝 最近活动
      </h2>
      <div className="border border-gray-200 rounded bg-white p-3 space-y-1 dark:border-gray-700 dark:bg-gray-800">
        {activities.slice(0, 3).map(activity => (
          <div
            key={activity.id}
            className="flex items-center justify-between py-1"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs">{getActivityIcon(activity.type)}</span>
              <span className="text-xs text-gray-700 dark:text-gray-300">
                {activity.action}
                {' '}
                {activity.target}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <StatusIndicator status={activity.status} size="xs" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
        <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
          <button
            onClick={onViewAll}
            className="text-xs text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
          >
            查看全部
          </button>
        </div>
      </div>
    </div>
  )
})

RecentActivity.displayName = 'RecentActivity'