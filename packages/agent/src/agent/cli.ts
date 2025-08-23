#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Log } from '@/utils'
import { AgentExecutor } from './AgentExecutor'

main()

/**
 * @description 负责把 XML 文件内容交给 agent 处理，让它调用工具，并返回最终答案
 *
 * @see {@link AgentExecutor}
 *
 * @example
 * ```bash
 * # 链接到全局使用
 * npm link
 * # 解析 LLM 文件内容，并执行工具调用
 * jl-agent C:/Code/note/AI/Agent/llm-example/search_weather.md
 * ```
 */
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    Log.info('用法: jl-agent <xml文件路径> [工作目录路径]')
    Log.info('示例: jl-agent response.xml /path/to/workspace')
    process.exit(1)
  }

  const xmlFilePath = args[0]
  const workspaceRoot = args[1] // 可选的工作目录参数

  try {
    Log.info(`读取 XML 文件: ${xmlFilePath}`)
    /** 读取 XML 文件 */
    const xmlContent = readFileSync(xmlFilePath, 'utf8')

    /** 创建 Agent 实例，传入工作目录配置 */
    const agent = new AgentExecutor({
      debug: true,
      workspaceRoot: workspaceRoot
        ? resolve(workspaceRoot)
        : undefined,
    })

    Log.info('开始处理 XML 内容')
    /** 处理 XML 内容 */
    const result = await agent.process(xmlContent)
    Log.success('处理完成')
    Log.info(`结果: ${result}`)
  }
  catch (error: any) {
    Log.error('处理失败:', error)
    process.exit(1)
  }
}
