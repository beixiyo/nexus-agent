import { memo, useEffect, useRef } from 'react'

/**
 * KeepAlive 组件用于保持组件状态，即使在不显示时也不卸载
 */
export const KeepAlive = memo<KeepAliveProps>(({
  active,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (active && containerRef.current && wrapperRef.current) {
      /** 当组件激活时，将内容移动到容器中 */
      containerRef.current.appendChild(wrapperRef.current)
    }
  }, [active])

  return (
    <>
      <div
        ref={ wrapperRef }
        style={ { display: active
          ? 'block'
          : 'none' } }>
        {children}
      </div>
      <div ref={ containerRef }></div>
    </>
  )
})

KeepAlive.displayName = 'KeepAlive'

export type KeepAliveProps = {
  /** 是否激活显示 */
  active: boolean
  /** 要保持状态的子组件 */
  children: React.ReactNode
}
