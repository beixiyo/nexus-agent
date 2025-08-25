#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseArgs } from 'node:util'
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
  const {
    values,
    positionals,
  } = parseArgs({
    args: process.argv.slice(2),
    options: {
      help: {
        type: 'boolean',
        short: 'h',
      },
    },
    allowPositionals: true,
  })

  /** 处理帮助参数 */
  if (values.help || positionals.length === 0) {
    Log.info('用法: jl-agent <xml文件路径> [工作目录路径]')
    Log.info('')
    Log.info('参数:')
    Log.info('  xml文件路径    包含 LLM XML 输出的文件路径（必需）')
    Log.info('  工作目录路径   可选的工作目录，默认为当前目录')
    Log.info('')
    Log.info('选项:')
    Log.info('  -h, --help     显示帮助信息')
    Log.info('')
    Log.info('示例:')
    Log.info('  jl-agent response.xml')
    Log.info('  jl-agent response.xml /path/to/workspace')
    Log.info('  jl-agent --help')
    Log.info('')
    Log.info('环境变量:')
    Log.info('  WORKSPACE_ROOT 设置默认工作目录')
    process.exit(0)
  }

  const xmlFilePath = positionals[0]
  /** 可选的工作目录参数 */
  const workspaceRoot = process.env.WORKSPACE_ROOT || positionals[1]

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
    await agent.process(xmlContent)
  }
  catch (error: any) {
    Log.error('处理失败:', error)
    process.exit(1)
  }
}
