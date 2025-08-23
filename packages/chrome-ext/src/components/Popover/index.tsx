import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils'

export interface PopoverProps {
  /** 触发元素 */
  children: ReactNode
  /** 弹出内容 */
  content: ReactNode
  /** 是否可见 */
  visible?: boolean
  /** 显示/隐藏回调 */
  onVisibleChange?: (visible: boolean) => void
  /** 弹出位置 */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** 自定义类名 */
  className?: string
}

export function Popover({
  children,
  content,
  visible: controlledVisible,
  onVisibleChange,
  placement = 'bottom',
  className,
}: PopoverProps) {
  const [internalVisible, setInternalVisible] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const isVisible = controlledVisible ?? internalVisible

  const handleTriggerClick = () => {
    const newVisible = !isVisible
    if (controlledVisible === undefined) {
      setInternalVisible(newVisible)
    }
    onVisibleChange?.(newVisible)
  }

  /** 点击外部关闭 */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isVisible
        && triggerRef.current
        && !triggerRef.current.contains(event.target as Node)
        && popoverRef.current
        && !popoverRef.current.contains(event.target as Node)
      ) {
        if (controlledVisible === undefined) {
          setInternalVisible(false)
        }
        onVisibleChange?.(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isVisible, controlledVisible, onVisibleChange])

  /** 计算弹出位置 */
  const getPopoverStyle = () => {
    if (!triggerRef.current)
      return {}

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const style: React.CSSProperties = {
      position: 'fixed',
      zIndex: 1000,
    }

    switch (placement) {
      case 'top':
        style.bottom = window.innerHeight - triggerRect.top
        style.left = triggerRect.left + triggerRect.width / 2
        style.transform = 'translateX(-50%)'
        break
      case 'bottom':
        style.top = triggerRect.bottom
        style.left = triggerRect.left + triggerRect.width / 2
        style.transform = 'translateX(-50%)'
        break
      case 'left':
        style.top = triggerRect.top + triggerRect.height / 2
        style.right = window.innerWidth - triggerRect.left
        style.transform = 'translateY(-50%)'
        break
      case 'right':
        style.top = triggerRect.top + triggerRect.height / 2
        style.left = triggerRect.right
        style.transform = 'translateY(-50%)'
        break
    }

    return style
  }

  return (
    <>
      <div
        ref={ triggerRef }
        onClick={ handleTriggerClick }
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && createPortal(
        <div
          ref={ popoverRef }
          style={ getPopoverStyle() }
          className={ cn(
            'bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700',
            'min-w-[120px] py-1',
            className,
          ) }
        >
          {content}
        </div>,
        document.body,
      )}
    </>
  )
}
