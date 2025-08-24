import type { MessageData } from '@/types'
import { Message } from '@/components'
import { ListenApi } from '@/config/listenApi'
import { runScript } from '@/utils'
import { Log } from '@/utils/Logger'
import { QwenAgent } from './agent'

let agent: QwenAgent | null = null

runScript(main)

async function main() {
  Log.info('开始初始化 Nexus Agent')

  agent = new QwenAgent()
  await agent.init()

  chrome.runtime.onMessage.addListener((message: MessageData<chrome.webRequest.OnBeforeRequestDetails>) => {
    if (
      message.type === 'webRequest.onCompleted'
      && message.data.url.includes(ListenApi.qianWen)
    ) {
      agent?.emit('onBeforeRequest', message)
      console.log('emit onBeforeRequest', message)
    }
  })

  agent.on('newChat', () => {
    Log.warn('新聊天按钮被点击')
    agent?.dispose()
    setTimeout(() => {
      location.reload()
    }, 500)
  })

  Log.info('Nexus Agent 初始化完成')
  Message.success('Nexus Agent 初始化完成')
  console.log(agent.messages)
}
