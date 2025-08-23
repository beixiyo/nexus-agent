import { memo, useEffect, useState } from 'react'
import { cn } from '@/utils'

export interface NotificationProps {
  /**
   * 通知类型
   */
  type?: 'success' | 'error' | 'warning' | 'info'
  /**
   * 通知标题
   */
  title?: string
  /**
   * 通知内容
   */
  message: string
  /**
   * 是否显示
   */
  visible: boolean
  /**
   * 自动关闭时间（毫秒）
   * @default 3000
   */
  autoClose?: number
  /**
   * 关闭回调
   */
  onClose?: () => void
  /**
   * 自定义类名
   */
  className?: string
}

export const Notification = memo<NotificationProps>(({
  type = 'info',
  title,
  message,
  visible,
  autoClose = 3000,
  onClose,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(visible)

  useEffect(() => {
    setIsVisible(visible)
  }, [visible])

  useEffect(() => {
    if (isVisible && autoClose > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, autoClose)
      return () => clearTimeout(timer)
    }
  }, [isVisible, autoClose, onClose])

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'success':
        return {
          icon: '✅',
          bgColor: 'bg-green-50 dark:bg-green-900/30',
          borderColor: 'border-green-200 dark:border-green-700',
          textColor: 'text-green-800 dark:text-green-200',
        }
      case 'error':
        return {
          icon: '❌',
          bgColor: 'bg-red-50 dark:bg-red-900/30',
          borderColor: 'border-red-200 dark:border-red-700',
          textColor: 'text-red-800 dark:text-red-200',
        }
      case 'warning':
        return {
          icon: '⚠️',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
          borderColor: 'border-yellow-200 dark:border-yellow-700',
          textColor: 'text-yellow-800 dark:text-yellow-200',
        }
      case 'info':
      default:
        return {
          icon: 'ℹ️',
          bgColor: 'bg-blue-50 dark:bg-blue-900/30',
          borderColor: 'border-blue-200 dark:border-blue-700',
          textColor: 'text-blue-800 dark:text-blue-200',
        }
    }
  }

  const config = getTypeConfig(type)

  if (!isVisible)
    return null

  return (
    <div
      className={ cn(
        'fixed top-4 right-4 z-50 max-w-sm rounded-lg border p-3 shadow-lg transition-all duration-300',
        config.bgColor,
        config.borderColor,
        config.textColor,
        'animate-in slide-in-from-right-2',
        className,
      ) }
    >
      <div className="flex items-start gap-2">
        <span className="text-sm">{config.icon}</span>
        <div className="flex-1">
          {title && (
            <h4 className="text-sm font-medium">{title}</h4>
          )}
          <p className="text-xs">{message}</p>
        </div>
        <button
          onClick={ () => {
            setIsVisible(false)
            onClose?.()
          } }
          className="text-xs opacity-60 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  )
})

Notification.displayName = 'Notification'
