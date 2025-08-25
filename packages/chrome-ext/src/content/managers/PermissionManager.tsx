import type { ToolCall, ToolName, ToolResult } from '@jl-org/nexus-agent'
import type { DangerousTool } from '@/config'
import { AgentApi } from '@/api/AgentApi'
import { Message } from '@/components'
import { Modal } from '@/components/Modal'
import { Log } from '@/utils/Logger'
import { ChromeStorage } from '@/utils/storage'
import { detectDangerousTools } from '@/utils/toolDetector'
import { DangerousToolsConfirm } from './DangerousToolsConfirm'
import { XMLProcessor } from './XMLProcessor'

/**
 * 权限管理器
 * 负责危险工具检测和用户确认
 */
export class PermissionManager {
  /**
   * 处理工具调用请求
   * @param lastAnswer 最后一条答案
   * @param sendServerResultToLLM 发送结果给 LLM 的回调函数
   */
  static async processRequest(
    lastAnswer: string,
    sendServerResultToLLM: (result: string) => Promise<void>,
  ) {
    /** 解析所有工具 */
    const allTools = XMLProcessor.parseTools(lastAnswer)

    /** 检测需要用户确认的危险工具 */
    const dangerousTools = await detectDangerousTools(lastAnswer)

    if (dangerousTools.length > 0) {
      const { confirmed, rejected, isCancelled } = await this.confirmDangerousTools(dangerousTools)

      /** 如果用户取消了操作，将所有工具标记为被拒绝并发送给 LLM */
      if (isCancelled) {
        Log.info('用户取消了工具执行')
        const allResults: ToolResult[] = allTools.map(tool => ({
          id: tool.id,
          result: `工具执行被用户拒绝: ${tool.name}`,
        }))
        await sendServerResultToLLM(PermissionManager.toolsResultToXML(allResults))
        return
      }

      /** 收集所有结果 */
      const allResults: ToolResult[] = []

      /** 如果有被拒绝的工具，添加到结果中 */
      if (rejected.length > 0) {
        Log.info(`用户拒绝了 ${rejected.length} 个工具`)
        const rejectedResults = rejected.map(tool => ({
          id: tool.id,
          result: `工具执行被用户拒绝: ${tool.name}`,
        }))
        allResults.push(...rejectedResults)
      }

      /** 收集所有需要执行的工具（确认的工具 + 已授权的工具） */
      const toolsToExecute = [...confirmed]

      /** 添加已授权的工具（不在 dangerousTools 中的工具） */
      const authorizedTools = allTools.filter(tool =>
        !dangerousTools.some(dangerousTool => dangerousTool.id === tool.id),
      )
      toolsToExecute.push(...authorizedTools)

      /** 如果有需要执行的工具，执行并添加到结果中 */
      if (toolsToExecute.length > 0) {
        try {
          const modifiedXmlContent = XMLProcessor.filterConfirmedTools(lastAnswer, toolsToExecute)
          const res = await AgentApi.process(modifiedXmlContent)

          if (res.data.result && res.data.result.length > 0) {
            allResults.push(...res.data.result)
          }
        }
        catch (error) {
          Log.error('Agent API 调用失败', error)
          Message.error('工具执行失败')
          return
        }
      }

      /** 统一发送所有结果给 LLM */
      if (allResults.length > 0) {
        await sendServerResultToLLM(PermissionManager.toolsResultToXML(allResults))
      }
      else {
        Log.info('没有需要执行或拒绝的工具')
      }
    }
    else {
      /** 没有危险工具，直接处理 */
      try {
        const res = await AgentApi.process(lastAnswer)

        if (res.data.result && res.data.result.length > 0) {
          await sendServerResultToLLM(PermissionManager.toolsResultToXML(res.data.result))
        }
      }
      catch (error) {
        Log.error('Agent API 调用失败', error)
        Message.error('工具执行失败')
      }
    }
  }

  /**
   * 确认危险工具执行
   * @param dangerousTools 危险工具列表
   * @returns 用户确认和拒绝的工具列表，以及是否取消操作
   */
  private static async confirmDangerousTools(dangerousTools: ToolCall[]): Promise<{ confirmed: ToolCall[], rejected: ToolCall[], isCancelled: boolean }> {
    return new Promise((resolve) => {
      const toolAutoConfirmStates = {} as Record<ToolName, boolean>
      const toolConfirmStates = {} as Record<ToolName, boolean>

      Modal.warning({
        titleText: '危险工具确认',
        okText: '确认执行',
        cancelText: '取消',
        children: (
          <DangerousToolsConfirm
            dangerousTools={ dangerousTools }
            onToolAutoConfirmChange={ (toolName, checked) => {
              toolAutoConfirmStates[toolName] = checked
            } }
            onToolConfirmChange={ (toolName, checked) => {
              toolConfirmStates[toolName] = checked
            } }
          />
        ),
        onOk: async () => {
          /** 保存每个工具的自动确认设置 */
          for (const [toolName, autoConfirm] of Object.entries(toolAutoConfirmStates)) {
            if (autoConfirm) {
              await ChromeStorage.authorizeTool(toolName as DangerousTool)
              Log.info(`用户授权了工具: ${toolName}`)
            }
          }

          /** 分离确认和拒绝的工具 */
          const confirmed: ToolCall[] = []
          const rejected: ToolCall[] = []

          dangerousTools.forEach((tool) => {
            if (toolConfirmStates[tool.name] !== false) {
              confirmed.push(tool)
            }
            else {
              rejected.push(tool)
            }
          })

          resolve({ confirmed, rejected, isCancelled: false })
        },
        onClose: () => {
          /** 用户取消，所有工具都被拒绝 */
          resolve({ confirmed: [], rejected: dangerousTools, isCancelled: true })
        },
      })
    })
  }

  static toolsResultToXML(toolResult: ToolResult[]): string {
    return `<tools_result>${JSON.stringify(toolResult)}</tools_result>`
  }
}
