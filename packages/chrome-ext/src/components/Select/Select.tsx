'use client'

import type { SelectProps } from './types'
import { ChevronDown, Loader2, Search } from 'lucide-react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFormField } from '@/components/Form/useFormField'
import { cn } from '@/utils'
import { SelectOption } from './SelectOption'

function InnerSelect<T extends string | string[] = string>({
  options,
  value,
  defaultValue,
  onChange,
  onClick,
  onClickOutside,

  className,
  placeholderClassName,
  placeholder = 'Select option',
  placeholderIcon,
  dropdownHeight = 150,

  showEmpty = true,
  showDownArrow = true,
  disabled = false,
  loading = false,
  multiple = false,
  rotate = true,
  maxSelect,
  searchable = false,
  required = false,

  /** 表单集成支持 */
  name,
  error,
  errorMessage,
}: SelectProps<T>) {
  const isCascading = useMemo(() => options.some(opt => opt.children && opt.children.length > 0), [options])
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [menuStack, setMenuStack] = useState<typeof options[]>([options])
  const [currentLabel, setCurrentLabel] = useState<React.ReactNode>('')

  /** 使用 useFormField 处理表单集成 */
  const {
    actualValue,
    actualError,
    actualErrorMessage,
    handleChangeVal,
    handleBlur,
  } = useFormField<T>({
    name,
    value,
    defaultValue: (multiple
      ? []
      : '') as T,
    error,
    errorMessage,
    onChange,
  })

  /** 内部值管理 */
  const [internalValue, setInternalValue] = useState<T>(() => {
    if (actualValue !== undefined) {
      return Array.isArray(actualValue)
        ? actualValue
        : [actualValue] as T
    }
    if (defaultValue !== undefined) {
      return Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue] as T
    }
    return [] as unknown as T
  })

  const containerRef = useRef<HTMLDivElement>(null)

  const findLabel = useCallback((opts: typeof options, val: string): React.ReactNode => {
    for (const opt of opts) {
      if (opt.value === val)
        return opt.label
      if (opt.children) {
        const label = findLabel(opt.children, val)
        if (label)
          return label
      }
    }
    return ''
  }, [])

  /** 更新内部值当受控值变化时 */
  useEffect(() => {
    if (actualValue !== undefined) {
      const values = Array.isArray(actualValue)
        ? actualValue
        : [actualValue] as T
      setInternalValue(values)

      if (isCascading && values.length > 0) {
        const label = findLabel(options, values[0])
        setCurrentLabel(label)
      }
    }
  }, [actualValue, isCascading, findLabel, options])

  /** 更新menuStack当options变化时 */
  useEffect(() => {
    setMenuStack([options])
  }, [options])

  const filteredOptions = useMemo(() => {
    if (isCascading)
      return options // 在级联模式下，不过滤选项

    return options.filter(option =>
      option.label?.toString().toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [options, searchQuery, isCascading])

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false)
      onClickOutside?.()
      handleBlur() // 处理失焦事件触发表单验证
    }
  }, [onClickOutside, handleBlur])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  const handleOptionClick = useCallback((optionValue: string) => {
    if (disabled)
      return

    if (isCascading) {
      const findOption = (opts: typeof options): (typeof options[0] | undefined) => {
        for (const opt of opts) {
          if (opt.value === optionValue)
            return opt
          if (opt.children) {
            const found = findOption(opt.children)
            if (found)
              return found
          }
        }
      }
      const option = findOption(options)

      if (option && !option.children) {
        setInternalValue([optionValue] as T)
        setCurrentLabel(option.label)
        handleChangeVal(optionValue as T, {} as any)
        setIsOpen(false)
      }
      return
    }

    const newValues = multiple
      ? internalValue.includes(optionValue)
        ? (internalValue as any[]).filter(v => v !== optionValue)
        : maxSelect && internalValue.length >= maxSelect
          ? internalValue
          : [...internalValue, optionValue]
      : [optionValue]

    if (!multiple) {
      setIsOpen(false)
    }

    /** 更新内部状态 */
    setInternalValue(newValues as T)

    /** 通知表单系统值变更 */
    handleChangeVal(
      (multiple
        ? newValues
        : newValues[0]) as T,
      {} as any,
    )
  }, [disabled, multiple, maxSelect, handleChangeVal, internalValue, isCascading, options])

  const handleOptionHover = useCallback((option: typeof options[0], level: number) => {
    if (isCascading) {
      const newStack = menuStack.slice(0, level + 1)
      if (option.children) {
        newStack.push(option.children)
      }
      setMenuStack(newStack)
    }
  }, [isCascading, menuStack])

  const selectedLabels = useMemo(() => {
    if (isCascading) {
      return currentLabel
        ? [currentLabel]
        : []
    }
    return (internalValue as any[])
      .map((val) => {
        const findOption = (opts: typeof options): (typeof options[0] | undefined) => {
          for (const opt of opts) {
            if (opt.value === val)
              return opt
            if (opt.children) {
              const found = findOption(opt.children)
              if (found)
                return found
            }
          }
        }
        return findOption(options)?.label
      })
      .filter(Boolean)
  }, [internalValue, options, isCascading, currentLabel])

  const renderDropdown = () => {
    if (isCascading) {
      return (
        <div
          className={ cn(
            'absolute w-auto mt-1 bg-white border-gray-200 rounded-lg shadow-lg z-50 flex',
            'transition-all duration-200 ease-in-out origin-top',
            'dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/70',
            isOpen
              ? 'opacity-100 scale-y-100 translate-y-0'
              : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none',
          ) }
        >
          { menuStack.map((menuOptions, level) => (
            <div
              key={ level }
              className="overflow-auto border-r border-gray-200 dark:border-gray-700"
              style={ { maxHeight: dropdownHeight } }
            >
              <div className="py-1" style={ { minWidth: '10rem' } }>
                { menuOptions.map(option => (
                  <SelectOption
                    key={ option.value }
                    option={ option }
                    selected={ internalValue.includes(option.value) }
                    onClick={ handleOptionClick }
                    onMouseEnter={ () => handleOptionHover(option, level) }
                  />
                )) }
              </div>
            </div>
          )) }
        </div>
      )
    }

    return (
      <div
        className={ cn(
          'absolute w-full mt-1 bg-white border-gray-200 rounded-lg shadow-lg z-50 overflow-auto',
          'transition-all duration-200 ease-in-out origin-top',
          'dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/70',
          { 'border dark:border-gray-700': showEmpty },
          isOpen
            ? 'opacity-100 scale-y-100 translate-y-0'
            : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none',
        ) }
        style={ {
          height: dropdownHeight,
          overflow: 'auto',
        } }
      >
        { searchable && !isCascading && (
          <div className="border-b p-2 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 transform text-gray-400 -translate-y-1/2 dark:text-gray-500" />
              <input
                type="text"
                className="w-full border rounded-md py-1 pl-9 pr-3 dark:border-gray-600 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 focus:outline-none dark:focus:border-blue-400"
                placeholder="Search..."
                value={ searchQuery }
                onChange={ e => setSearchQuery(e.target.value) }
                onClick={ e => e.stopPropagation() }
              />
            </div>
          </div>
        ) }

        { filteredOptions.map(option => (
          <SelectOption
            key={ option.value }
            option={ option }
            selected={ internalValue.includes(option.value) }
            onClick={ handleOptionClick }
          />
        )) }

        { filteredOptions.length === 0 && showEmpty && (
          <div className="px-4 py-2 text-center text-gray-500 dark:text-gray-400">
            No options found
          </div>
        ) }
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        className="relative"
        ref={ containerRef }
        onClick={ () => {
          if (disabled)
            return
          onClick?.()
        } }
      >
        <div
          className={ cn(
            'border rounded-lg px-3 py-2 flex items-center justify-between',
            'transition-colors duration-200 ease-in-out',
            'dark:bg-gray-800 dark:text-gray-200',
            disabled
              ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700'
              : 'cursor-pointer hover:border-slate-400 dark:hover:border-slate-600',
            isOpen
              ? 'border-slate-300 dark:border-slate-600'
              : 'border-gray-200 dark:border-gray-700',
            actualError
              ? 'border-rose-500 dark:border-rose-500'
              : '',
            { 'cursor-wait': loading },
            className,
          ) }
          onClick={ () => !disabled && !loading && setIsOpen(!isOpen) }
        >
          <div className="flex flex-1 items-center gap-2">
            { loading
              ? <Loader2 className="h-5 w-5 animate-spin text-gray-400 dark:text-gray-500" />
              : selectedLabels.length > 0

                ? <span className="truncate">
                    { multiple
                      ? selectedLabels.join(', ')
                      : selectedLabels[0] }
                  </span>
                : <div className={ cn(
                    'flex items-center gap-2',
                    { 'mr-2': !!placeholderIcon },
                  ) }>
                    <span className={ cn(
                      'mr-2 select-none text-gray-500 dark:text-gray-400',
                      placeholderClassName,
                    ) }>
                      { placeholder }
                      { required && <span className="ml-1 text-rose-500">*</span> }
                    </span>

                    { placeholderIcon && <>{ placeholderIcon }</> }
                  </div> }
          </div>

          { showDownArrow && <ChevronDown
            className={ cn(
              'w-5 h-5 transform transition-transform duration-200 ease-in-out text-gray-500 dark:text-gray-400',
              isOpen && rotate
                ? 'rotate-180'
                : 'rotate-0',
            ) }
          /> }
        </div>

        { renderDropdown() }
      </div>

      { actualError && actualErrorMessage && (
        <div className="mt-1 text-xs text-rose-500">
          { actualErrorMessage }
        </div>
      ) }
    </div>
  )
}

InnerSelect.displayName = 'Select'

export const Select = memo(InnerSelect) as typeof InnerSelect
