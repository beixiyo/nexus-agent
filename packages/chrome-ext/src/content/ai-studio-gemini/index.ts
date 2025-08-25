import type { MessageData } from '@/types'
import { Message } from '@/components'
import { DEFAULT_AGENT_ENABLED } from '@/config'
import { ListenApi } from '@/config/listenApi'
import { ChromeStorage, runScript } from '@/utils'

import { Log } from '@/utils/Logger'
import { AiStudioGeminiAgent } from './agent'

let agent: AiStudioGeminiAgent | null = null
let isAgentEnabled = DEFAULT_AGENT_ENABLED

/** 注册消息监听器（只注册一次） */
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

  /** 监听启用/禁用消息 */
  if (message.type === 'agent.enable' || message.type === 'agent.disable') {
    const enabled = message.type === 'agent.enable'
    handleAgentStateChange(enabled)
  }
})

/** 初始化时检查存储的状态 */
runScript(async () => {
  try {
    const storedEnabled = await ChromeStorage.getAgentEnabled()
    isAgentEnabled = storedEnabled

    if (storedEnabled) {
      await initAgent()
    }
  }
  catch (error) {
    console.error('加载 Agent 启用状态失败:', error)
  }
}, 1000)

async function initAgent() {
  isAgentEnabled = true
  Log.info('开始初始化 Nexus Agent')

  agent = new AiStudioGeminiAgent()
  await agent.init()

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

/** 处理 Agent 状态变化 */
async function handleAgentStateChange(enabled: boolean) {
  if (
    isAgentEnabled === enabled
    || (isAgentEnabled && enabled)
  ) {
    return
  }

  isAgentEnabled = enabled

  if (enabled) {
    Log.info('启用 Nexus Agent')
    if (!agent) {
      await initAgent()
    }
    Message.success('Nexus Agent 已启用')
  }
  else {
    Log.info('禁用 Nexus Agent')
    if (agent) {
      agent.dispose()
      agent = null
    }
    Message.info('Nexus Agent 已禁用')
  }
}
