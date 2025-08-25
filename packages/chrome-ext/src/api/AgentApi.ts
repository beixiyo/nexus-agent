import type { Resp } from '@/types'
import { DEFAULT_CONNECTION_CONFIG } from '@/config'
import { http } from './instance'

export class AgentApi {
  /**
   * 处理LLM XML输出
   * @param xmlContent LLM XML输出
   * @returns 处理结果
   */
  static process(xmlContent: string): Promise<Resp<{ result: ToolResult[], timestamp: string }>> {
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

  static info(): Promise<Resp<any>> {
    return http.get('/agent/info', {
      baseUrl: `${DEFAULT_CONNECTION_CONFIG.serverUrl}/api`,
    })
  }

  static health(): Promise<Resp<any>> {
    return http.get('/health', {
      baseUrl: `${DEFAULT_CONNECTION_CONFIG.serverUrl}/api`,
    })
  }
}

export type ToolResult = {
  id: string
  result: string
}
