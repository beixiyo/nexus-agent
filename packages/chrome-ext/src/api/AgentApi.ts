import type { SystemInfo, ToolName } from 'nexus-common'
import type { Resp } from '@/types'
import { DEFAULT_CONNECTION_CONFIG } from '@/config'
import { http } from './instance'

export class AgentApi {
  /**
   * 处理LLM XML输出
   * @param xmlContent LLM XML输出
   * @returns 处理结果
   */
  static process(xmlContent: string): Promise<Resp<ProcessXmlResponse>> {
    return http.post(
      '/agent/process',
      {
        xmlContent,
      },
      {
        baseUrl: `${DEFAULT_CONNECTION_CONFIG.serverUrl}/api`,
      },
    )
  }

  /**
   * 获取Agent信息
   * @returns Agent信息
   */
  static getAgentInfo(): Promise<Resp<AgentInfo>> {
    return http.get('/agent/info', {
      baseUrl: `${DEFAULT_CONNECTION_CONFIG.serverUrl}/api`,
    })
  }

  /**
   * 检查服务健康状态
   * @returns 健康检查结果
   */
  static health(): Promise<Resp<any>> {
    return http.get('/health', {
      baseUrl: `${DEFAULT_CONNECTION_CONFIG.serverUrl}/api`,
      timeout: 8000,
    })
  }
}

/** 工具执行结果接口 */
export interface ToolResult {
  id: string
  result: string
}

/** 处理XML请求参数接口 */
export interface ProcessXmlRequest {
  xmlContent: string
}

/** 处理XML响应数据接口 */
export interface ProcessXmlResponse {
  result: ToolResult[]
  timestamp: string
}

/** Agent信息接口 */
export interface AgentInfo {
  workspaceRoot: string
  supportedTools: {
    name: ToolName
    description: string
    parameters: {
      name: string
      type: string
      description: string
    }[]
    returns: {
      type: string
      description: string
    }
  }[]
  platform: SystemInfo['platform']
  arch: SystemInfo['arch']
  nodeVersion: SystemInfo['nodeVersion']
  memory: SystemInfo['memory']
  cwd: SystemInfo['cwd']
  uptime: SystemInfo['uptime']
}
