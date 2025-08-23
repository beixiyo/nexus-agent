import type { AgentResponse, ToolCall } from '@jl-org/nexus-agent'
import { parseXMLResponse } from '@jl-org/nexus-agent'
import { Log } from '@/utils/Logger'

/**
 * XML 处理器
 * 负责 XML 解析、生成和工具过滤
 */
export class XMLProcessor {
  /**
   * 解析 XML 响应并提取所有工具
   * @param xmlContent XML 内容
   * @returns 工具列表
   */
  static parseTools(xmlContent: string): ToolCall[] {
    const response = parseXMLResponse(xmlContent)
    return response?.tools || []
  }

  /**
   * 过滤 XML 内容，只保留被确认的工具
   * @param xmlContent 原始 XML 内容
   * @param confirmedTools 被确认的工具列表
   * @returns 过滤后的 XML 内容
   */
  static filterConfirmedTools(xmlContent: string, confirmedTools: ToolCall[]): string {
    try {
      const response = parseXMLResponse(xmlContent)

      if (!response) {
        return xmlContent
      }

      /** 创建新的响应对象，只包含被确认的工具 */
      const filteredResponse = {
        ...response,
        tools: confirmedTools,
      }

      /** 重新生成 XML 内容 */
      return this.generateXMLContent(filteredResponse)
    }
    catch (error) {
      Log.error('过滤工具失败', error)
      return xmlContent
    }
  }

  /**
   * 生成 XML 内容
   * @param response Agent 响应对象
   * @returns XML 字符串
   */
  static generateXMLContent(response: AgentResponse): string {
    const { user_task, thinking, tools, tools_result, final_answer } = response

    let xml = '<response>\n'

    if (user_task) {
      xml += `  <user_task>${this.escapeXml(user_task)}</user_task>\n`
    }

    if (thinking) {
      xml += `  <thinking>${this.escapeXml(thinking)}</thinking>\n`
    }

    if (tools && tools.length > 0) {
      xml += '  <tools>\n'
      xml += `${JSON.stringify(tools)}\n`
      xml += '  </tools>\n'
    }

    if (tools_result) {
      xml += `  <tools_result>${this.escapeXml(tools_result)}</tools_result>\n`
    }

    if (final_answer) {
      xml += `  <final_answer>${this.escapeXml(final_answer)}</final_answer>\n`
    }

    xml += '</response>'
    return xml
  }

  /**
   * 转义 XML 特殊字符
   * @param text 原始文本
   * @returns 转义后的文本
   */
  private static escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }
}
