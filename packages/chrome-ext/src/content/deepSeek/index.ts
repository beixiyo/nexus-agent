import { Message } from '@/components'
import { runScript } from '@/utils'
import { Log } from '@/utils/Logger'
import { DeepSeekAgent } from './agent'

let agent: DeepSeekAgent | null = null
runScript(main)

async function main() {
  Log.info('开始初始化 Nexus Agent')

  agent = new DeepSeekAgent()
  await agent.init()

  agent.on('newChat', () => {
    Log.warn('新聊天按钮被点击')
    agent?.dispose()
    setTimeout(() => {
      location.reload()
    }, 1000)
  })

  Log.info('Nexus Agent 初始化完成')
  Message.success('Nexus Agent 初始化完成')
  console.log(agent.messages)
}
