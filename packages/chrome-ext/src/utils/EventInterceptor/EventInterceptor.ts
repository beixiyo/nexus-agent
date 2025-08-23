/** 保存原始的 addEventListener 方法 */
const originalAddEventListener = EventTarget.prototype.addEventListener

/**
 * 事件拦截器，用于拦截已绑定的事件
 */
export class EventInterceptor {
  private static instance: EventInterceptor | null
  private eventListeners: Map<EventTarget, Map<string, Set<InterceptorEventListener>>> = new Map()
  private interceptedListeners: Map<EventTarget, Map<string, Set<EventListener>>> = new Map()

  private constructor() {
    // eslint-disable-next-line ts/no-this-alias
    const _self = this

    /** 重写 addEventListener 来捕获事件监听器 */
    EventTarget.prototype.addEventListener = function (
      type: string,
      listener: EventListener,
      options?: boolean | AddEventListenerOptions,
    ) {
      /** 保存事件监听器的引用 */
      if (!_self.eventListeners.has(this)) {
        _self.eventListeners.set(this, new Map())
      }

      const elementListeners = _self.eventListeners.get(this)!
      if (!elementListeners.has(type)) {
        elementListeners.set(type, new Set())
      }

      elementListeners.get(type)!.add({ listener, options })

      /** 最后调用原始方法 */
      return originalAddEventListener.call(this, type, listener, options)
    }
  }

  static getInstance() {
    if (!EventInterceptor.instance) {
      EventInterceptor.instance = new EventInterceptor()
    }
    return EventInterceptor.instance
  }

  /**
   * 拦截指定元素的指定事件
   * @param element 要拦截事件的元素
   * @param eventType 事件类型（如 'click', 'keydown' 等）
   * @param interceptor 拦截处理函数
   * @param preventDefault 是否阻止默认行为
   */
  interceptEvent<K extends keyof HTMLElementEventMap>(
    element: EventTarget,
    eventType: K,
    interceptor: (event: Event) => Promise<void>,
    preventDefault = () => true,
  ): () => void {
    const interceptorListener = async (event: Event) => {
      /** 阻止原始事件处理 */
      if (preventDefault()) {
        event.stopImmediatePropagation()
      }

      /** 执行拦截逻辑 */
      await interceptor(event)
    }

    element.addEventListener(eventType, interceptorListener, true) // 使用捕获阶段

    /** 保存被拦截的监听器引用，用于后续清理 */
    if (!this.interceptedListeners.has(element)) {
      this.interceptedListeners.set(element, new Map())
    }

    const elInterceptedListeners = this.interceptedListeners.get(element)!
    if (!elInterceptedListeners.has(eventType)) {
      elInterceptedListeners.set(eventType, new Set())
    }

    elInterceptedListeners.get(eventType)!.add(interceptorListener)

    return () => {
      this.removeInterceptedListener(element, eventType, interceptorListener)
    }
  }

  /**
   * 获取元素上绑定的所有事件监听器
   * @param element 元素
   * @param eventType 事件类型
   * @returns 事件监听器数组
   */
  getEventListeners<K extends keyof HTMLElementEventMap>(element: EventTarget, eventType: K): InterceptorEventListener[] {
    if (!this.eventListeners.has(element)) {
      return []
    }

    const elementListeners = this.eventListeners.get(element)!
    if (!elementListeners.has(eventType)) {
      return []
    }

    return Array.from(elementListeners.get(eventType)!)
  }

  /**
   * 移除特定的拦截监听器
   * @param element 要移除监听器的元素
   * @param eventType 事件类型
   * @param interceptorListener 要移除的拦截监听器
   * @returns 是否成功移除
   */
  removeInterceptedListener(element: EventTarget, eventType: string, interceptorListener: EventListener): boolean {
    const elInterceptedListeners = this.interceptedListeners.get(element)
    if (!elInterceptedListeners || !elInterceptedListeners.has(eventType)) {
      return false
    }

    const listeners = elInterceptedListeners.get(eventType)!
    if (listeners.has(interceptorListener)) {
      element.removeEventListener(eventType, interceptorListener, true)
      listeners.delete(interceptorListener)

      /** 如果该事件类型没有监听器了，删除该事件类型 */
      if (listeners.size === 0) {
        elInterceptedListeners.delete(eventType)

        /** 如果该元素没有其他事件类型了，删除整个元素的 Map 条目 */
        if (elInterceptedListeners.size === 0) {
          this.interceptedListeners.delete(element)
        }
      }

      return true
    }

    return false
  }

  /**
   * 清理原始事件监听器记录
   * @param element 要清理的元素
   * @param eventType 事件类型，如果不指定则清理该元素的所有事件记录
   */
  clearEventListenerRecords(element?: EventTarget, eventType?: string): void {
    if (element) {
      if (eventType) {
        /** 清理指定元素的指定事件类型记录 */
        const elementListeners = this.eventListeners.get(element)
        if (elementListeners && elementListeners.has(eventType)) {
          elementListeners.delete(eventType)

          /** 如果该元素没有其他事件类型了，删除整个元素的 Map 条目 */
          if (elementListeners.size === 0) {
            this.eventListeners.delete(element)
          }
        }
      }
      else {
        /** 清理指定元素的所有事件记录 */
        this.eventListeners.delete(element)
      }
    }
    else {
      /** 清理所有事件记录 */
      this.eventListeners.clear()
    }
  }

  /**
   * 清理指定元素上被拦截的事件监听器
   * @param element 要清理的元素
   * @param eventType 事件类型，如果不指定则清理该元素的所有被拦截事件
   */
  clearInterceptedEvents(element?: EventTarget, eventType?: string): void {
    if (element) {
      /** 清理指定元素的指定事件类型 */
      if (eventType) {
        const elInterceptedListeners = this.interceptedListeners.get(element)
        if (elInterceptedListeners && elInterceptedListeners.has(eventType)) {
          const listeners = elInterceptedListeners.get(eventType)!
          listeners.forEach((listener) => {
            element.removeEventListener(eventType, listener, true)
          })
          elInterceptedListeners.delete(eventType)

          /** 如果该元素没有其他事件类型了，删除整个元素的 Map 条目 */
          if (elInterceptedListeners.size === 0) {
            this.interceptedListeners.delete(element)
          }
        }
      }
      /** 清理指定元素的所有被拦截事件 */
      else {
        const elInterceptedListeners = this.interceptedListeners.get(element)
        if (elInterceptedListeners) {
          elInterceptedListeners.forEach((listeners, type) => {
            listeners.forEach((listener) => {
              element.removeEventListener(type, listener, true)
            })
          })
          this.interceptedListeners.delete(element)
        }
      }
    }
    /** 清理所有被拦截的事件 */
    else {
      this.interceptedListeners.forEach((elementInterceptedListeners, targetElement) => {
        elementInterceptedListeners.forEach((listeners, type) => {
          listeners.forEach((listener) => {
            targetElement.removeEventListener(type, listener, true)
          })
        })
      })
      this.interceptedListeners.clear()
    }
  }

  /**
   * 清理所有资源，包括事件监听器记录和被拦截的事件
   */
  static dispose(): void {
    if (EventInterceptor.instance) {
      const target = EventInterceptor.instance

      /** 清理所有被拦截的事件 */
      target.clearInterceptedEvents()

      /** 清理事件监听器记录 */
      target.eventListeners.clear()
      target.interceptedListeners.clear()

      /** 恢复原始的 addEventListener 方法 */
      EventTarget.prototype.addEventListener = originalAddEventListener

      /** 重置单例实例，避免状态不一致 */
      EventInterceptor.instance = null
    }
  }
}

export type InterceptorEventListener = {
  listener: EventListener
  options?: boolean | AddEventListenerOptions
}
