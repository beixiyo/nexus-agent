import type { CSSProperties } from 'react'
import type { TabItemType } from './index'
import { memo } from 'react'
import { cn } from '@/utils'
import { KeepAlive } from '../KeepAlive'

function InnerTabItem<T extends string>(
  {
    style,
    className,
    item,
    active,
  }: TabItemProps<T>,
) {
  return <div
    className={ cn('dark:bg-transparent overflow-y-auto', className) }
    style={ {
      display: active
        ? 'block'
        : 'none',
      ...style,
    } }
  >
    <KeepAlive active={ active }>
      { item.children }
    </KeepAlive>
  </div>
}

InnerTabItem.displayName = 'InnerTabItem'
export const TabItem = memo(InnerTabItem) as typeof InnerTabItem

export interface TabItemProps<T extends string> {
  className?: string
  style?: CSSProperties

  item: TabItemType<T>
  active: boolean
}
