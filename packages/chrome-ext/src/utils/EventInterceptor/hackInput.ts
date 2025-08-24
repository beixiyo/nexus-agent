import type { InterceptorEventListener } from './EventInterceptor'
import { EventInterceptor } from './EventInterceptor'
import { interceptEvent } from './hackEvent'

const eventInterceptor = EventInterceptor.getInstance()

/**
 * 拦截输入框的键盘事件（默认为 Enter），执行回调后再触发原始事件。
 *
 * @param element 要拦截的输入框元素 (input 或 textarea)
 * @param callback 当按键匹配时触发的回调函数，您可以在此函数中调用 modifyInputElementValue 来修改输入框内容
 * @returns 取消劫持的函数
 */
export function hackInputEvent(
  element: HTMLInputElement | HTMLTextAreaElement,
  callback: HackCallback<KeyboardEvent>,
  options: HackInputEventOptions = {},
): () => void {
  const {
    keyMatcher = isEnterKey,
    preventDefault = () => true,
  } = options

  /** 所有原始的 keydown 事件监听器 */
  const originalListeners = eventInterceptor.getEventListeners(element, 'keydown')

  /** 拦截 keydown 事件 */
  return interceptEvent(
    element,
    'keydown',
    async (event) => {
      const keyboardEvent = event as KeyboardEvent

      /** 检查是否是我们要拦截的按键 */
      if (!keyMatcher(keyboardEvent)) {
        /**
         * 如果不是，我们不阻止默认行为，也不执行任何操作
         * 但因为 interceptEvent 默认会 stopImmediatePropagation，我们需要重新触发原始事件
         */
        originalListeners.forEach(({ listener, options }) => {
          if (typeof listener === 'function') {
            listener.call(element, event)
          }
        })
        return
      }

      /** 如果按键匹配，首先执行外部传入的回调函数 */
      await callback(keyboardEvent, originalListeners)
    },
    preventDefault,
  )
}

/**
 * 拦截按钮的点击事件，执行回调后再触发原始点击事件。
 *
 * @param element 要拦截的按钮元素
 * @param callback 当按钮被点击时触发的回调函数，您可以在此函数中修改其他输入框的值
 * @returns 取消劫持的函数
 */
export function hackClickEvent(
  element: HTMLElement,
  callback: HackCallback<MouseEvent>,
  options: Pick<HackInputEventOptions, 'preventDefault'> = {},
): () => void {
  const {
    preventDefault = () => false,
  } = options

  const originalListeners = eventInterceptor.getEventListeners(element, 'click')

  return interceptEvent(
    element,
    'click',
    async (event) => {
      const mouseEvent = event as MouseEvent
      await callback(mouseEvent, originalListeners)
    },
    preventDefault,
  )
}

/**
 * 默认的 Enter 键匹配器
 * 当用户仅按下 Enter 键（没有 Ctrl, Shift, Alt 等修饰键）时返回 true
 * @param event 键盘事件
 * @returns 是否匹配
 */
export function isEnterKey(event: KeyboardEvent): boolean {
  return event.key === 'Enter' && !event.ctrlKey && !event.shiftKey && !event.altKey
}

/**
 * 默认的 Ctrl + Enter 键匹配器
 * 当用户按下 Ctrl + Enter 键时返回 true
 * @param event 键盘事件
 * @returns 是否匹配
 */
export function isCtrlEnterKey(event: KeyboardEvent): boolean {
  return event.key === 'Enter' && event.ctrlKey
}

type HackInputEventOptions = {
  /**
   * 是否匹配
   * @param event 键盘事件
   * @returns 是否匹配
   * @default isEnterKey
   */
  keyMatcher?: (event: KeyboardEvent) => boolean
  /**
   * 是否阻止原始事件
   */
  preventDefault?: () => boolean
}

export type HackCallback<E extends Event> = (event: E, originalListeners: InterceptorEventListener[]) => Promise<void>
