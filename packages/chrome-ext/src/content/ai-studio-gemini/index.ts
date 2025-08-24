import type { MessageData } from '@/types'
import { Message } from '@/components'
import { ListenApi } from '@/config/listenApi'
import { runScript } from '@/utils'
import { Log } from '@/utils/Logger'
import { AiStudioGeminiAgent } from './agent'

let agent: AiStudioGeminiAgent | null = null

runScript(main, 1000)

async function main() {
  Log.info('开始初始化 Nexus Agent')

  agent = new AiStudioGeminiAgent()
  await agent.init()

  chrome.runtime.onMessage.addListener((message: MessageData) => {
    if (
      message.type === 'webRequest.onCompleted'
      && message.data.url.includes(ListenApi.aiStudioGemini)
    ) {
      setTimeout(() => {
        agent?.emit('onCompleted', message)
      }, 2500)
      console.log('emit onCompleted', message)
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
