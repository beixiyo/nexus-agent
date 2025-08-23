import { EventInterceptor } from './EventInterceptor'

/**
 * 全局事件拦截器实例
 */
const eventInterceptor = EventInterceptor.getInstance()

/**
 * 拦截指定元素的指定事件
 * @param element 要拦截事件的元素
 * @param eventType 事件类型（如 'click', 'keydown' 等）
 * @param interceptor 拦截处理函数
 * @param preventDefault 是否阻止默认行为
 * @returns 取消劫持的函数
 */
export function interceptEvent<K extends keyof HTMLElementEventMap>(
  element: EventTarget,
  eventType: K,
  interceptor: (event: Event) => Promise<void>,
  preventDefault = () => true,
): () => void {
  const unbind = eventInterceptor.interceptEvent(element, eventType, interceptor, preventDefault)
  return () => {
    unbind()
  }
}

/**
 * 修改输入框内容并触发相关事件
 * @param element 输入框元素
 * @param content 新内容
 */
export function modifyInputValue(element: HTMLInputElement | HTMLTextAreaElement, content: string): void {
  /** 保存原始值的setter（如果被封装过） */
  const originalValueSetter = Object.getOwnPropertyDescriptor(
    element.constructor.prototype,
    'value',
  )?.set

  /** 设置新值 */
  if (originalValueSetter) {
    originalValueSetter.call(element, content)
  }
  else {
    element.value = content
  }

  /** 触发事件让页面知道内容改变了 */
  const inputEvent = new Event('input', { bubbles: true })
  const changeEvent = new Event('change', { bubbles: true })
  element.dispatchEvent(inputEvent)
  element.dispatchEvent(changeEvent)
}
