import type { ActivityItem } from '@/types'
import { memo, useState } from 'react'

export interface RecentActivityProps {
  activities: ActivityItem[]
  maxVisible?: number
}

export const RecentActivity = memo<RecentActivityProps>((props) => {
  const { activities, maxVisible = 3 } = props
  const [showAll, setShowAll] = useState(false)

  const displayActivities = showAll
    ? activities
    : activities.slice(0, maxVisible)
  const hasMore = activities.length > maxVisible

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
        {displayActivities.length > 0
          ? (
              <>
                {displayActivities.map(activity => (
                  <div
                    key={ activity.id }
                    className="flex items-center justify-between py-1"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-xs flex-shrink-0">{getActivityIcon(activity.type)}</span>
                      <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                        {activity.action}
                        {' '}
                        {activity.target}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}

                {hasMore && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={ () => setShowAll(!showAll) }
                      className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      {showAll
                        ? '收起'
                        : `查看更多 (${activities.length - maxVisible})`}
                    </button>
                  </div>
                )}
              </>
            )
          : (
              <div className="py-4 text-center">
                <div className="text-gray-400 dark:text-gray-500 text-xs">
                  📝 暂无活动记录
                </div>
                <div className="text-gray-300 dark:text-gray-600 text-xs mt-1">
                  当您使用 Agent 执行工具时，活动记录将显示在这里
                </div>
              </div>
            )}
      </div>
    </div>
  )
})

RecentActivity.displayName = 'RecentActivity'
