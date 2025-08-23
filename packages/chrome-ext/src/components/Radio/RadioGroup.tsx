'use client'

import type { RadioProps } from './Radio'
import React, { Children, cloneElement, isValidElement, memo, useCallback } from 'react'
import { useFormField } from '@/components/Form'
import { cn } from '@/utils'

export const RadioGroup = memo<RadioGroupProps>(({
  children,
  className,
  style,
  value,
  name,
  onChange,
  direction = 'vertical',
  ...rest
}) => {
  /** 使用 useFormField hook 处理表单集成 */
  const {
    actualValue,
    handleChangeVal,
    handleBlur,
  } = useFormField<string, React.ChangeEvent<HTMLInputElement>>({
    name,
    value,
    onChange,
  })

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChangeVal(e.target.value, e)
    handleBlur()
  }, [handleChangeVal, handleBlur])

  const directionClasses = {
    vertical: 'flex-col space-y-4',
    horizontal: 'flex-row space-x-6',
  }

  return (
    <div
      role="radiogroup"
      className={ cn('flex', directionClasses[direction], className) }
      style={ style }
      { ...rest }
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child))
          return child

        const radioProps = child.props as RadioProps
        const childOnChange = radioProps.onChange

        return cloneElement(child as React.ReactElement<RadioProps>, {
          name,
          checked: radioProps.value === actualValue,
          /** 当子组件未提供 onChange 时，使用父组件的 onChange */
          onChange: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e)
            childOnChange?.(checked, e)
          },
        })
      })}
    </div>
  )
})

RadioGroup.displayName = 'RadioGroup'
export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * The content of the component.
   */
  children?: React.ReactNode
  /**
   * Layout direction of the radio buttons.
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal'
  /**
   * 当前选中的值
   */
  value?: string
  /**
   * 单选按钮组名称
   */
  name: string
  /**
   * 值变化时的回调
   */
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void
}
