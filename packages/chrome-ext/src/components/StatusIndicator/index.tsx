import type { Status } from '@/types'
import { memo } from 'react'
import { cn } from '@/utils'

export interface StatusIndicatorProps {
  /**
   * 状态类型
   */
  status: Status
  /**
   * 是否显示文本
   * @default true
   */
  showText?: boolean
  /**
   * 是否显示动画
   * @default true
   */
  animated?: boolean
  /**
   * 自定义类名
   */
  className?: string
  /**
   * 尺寸
   * @default 'sm'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

export const StatusIndicator = memo<StatusIndicatorProps>(({
  status,
  showText = true,
  animated = true,
  className,
  size = 'sm',
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'connected':
      case 'success':
        return {
          color: 'bg-green-500',
          textColor: 'text-green-500',
          text: '已连接',
          icon: '●',
        }
      case 'connecting':
      case 'processing':
        return {
          color: 'bg-blue-500',
          textColor: 'text-blue-500',
          text: '连接中...',
          icon: '●',
        }
      case 'disconnected':
      case 'error':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-500',
          text: '未连接',
          icon: '●',
        }
      case 'idle':
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-500',
          text: '空闲',
          icon: '●',
        }
      default:
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-500',
          text: status,
          icon: '●',
        }
    }
  }

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'xs':
        return {
          dot: 'w-1.5 h-1.5',
          text: 'text-xs',
        }
      case 'sm':
        return {
          dot: 'w-2 h-2',
          text: 'text-xs',
        }
      case 'md':
        return {
          dot: 'w-3 h-3',
          text: 'text-sm',
        }
      case 'lg':
        return {
          dot: 'w-4 h-4',
          text: 'text-base',
        }
      default:
        return {
          dot: 'w-2 h-2',
          text: 'text-xs',
        }
    }
  }

  const config = getStatusConfig(status)
  const sizeClasses = getSizeClasses(size)

  return (
    <div className={ cn('flex items-center gap-2', className) }>
      <div
        className={ cn(
          'rounded-full',
          config.color,
          sizeClasses.dot,
          animated && (status === 'connecting' || status === 'processing') && 'animate-pulse',
        ) }
      />
      {showText && (
        <span className={ cn('font-medium', config.textColor, sizeClasses.text) }>
          {config.text}
        </span>
      )}
    </div>
  )
})

StatusIndicator.displayName = 'StatusIndicator'
