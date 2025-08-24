import { ChromeListener } from '@/background/ChromeListener'
import { ListenApi } from '@/config/listenApi'

console.log('Background script 开始初始化...')

ChromeListener.listenWebRequest({
  urls: [
    ...Object.values(ListenApi).map(api => `https://${api}`),
  ],
  types: ['xmlhttprequest'],
  onBeforeRequest: (details) => {
    console.log('🔍 onBeforeRequest:', {
      url: details.url,
      type: details.type,
      tabId: details.tabId,
      method: details.method,
    })
    return undefined
  },
  onCompleted: (details) => {
    console.log('✅ onCompleted:', {
      url: details.url,
      type: details.type,
      tabId: details.tabId,
      statusCode: details.statusCode,
    })
    return undefined
  },
})
