import type { AgentOptions } from './types'
import { SERVER_CONFIG } from '@/server/config'
import { Log } from '@/utils'
import { ToolExecutor } from './ToolExecutor'
import { parseXMLResponse } from './XMLStateMachineParser'

/**
 * Agent 主类，接收 LLM 输出，解析并执行工具调用，返回最终答案
 */
export class AgentExecutor {
  readonly options: AgentOptions
  private executor: ToolExecutor

  /**
   * 创建 Agent 实例
   * @param options - 配置选项
   */
  constructor(options: AgentOptions = {}) {
    this.options = {
      debug: false,
      workspaceRoot: SERVER_CONFIG.workspaceRoot,
      ...options,
    }
    this.executor = new ToolExecutor(this.options.workspaceRoot)
  }

  /**
   * 处理 LLM 输出
   * @param xmlContent - LLM 输出的 XML 内容
   * @returns 最终答案
   */
  async process(xmlContent: string) {
    Log.info(`开始处理 XML 内容，长度: ${xmlContent.length}`)

    /** 解析 XML */
    const response = parseXMLResponse(xmlContent)

    if (!response) {
      const error = new Error('无法解析 XML 内容')
      Log.error('XML 解析失败', error)
      throw error
    }

    /** 执行工具调用 */
    const toolsResult = await this.executor.execute(response)

    if (this.options.debug) {
      Log.debug(`工具执行结果: ${JSON.stringify(toolsResult, null, 2)}`)
    }

    /** 返回最终答案 */
    Log.success(`处理完成，返回最终答案: ${JSON.stringify(toolsResult, null, 2)}`)
    return toolsResult
  }
}
