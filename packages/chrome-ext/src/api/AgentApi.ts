import type { Resp } from '@/types'
import { http } from './instance'

export class AgentApi {
  /**
   * 处理LLM XML输出
   * @param xmlContent LLM XML输出
   * @returns 处理结果
   */
  static process(xmlContent: string): Promise<Resp<{ result: ToolResult[], timestamp: string }>> {
    return http.post('/agent/process', {
      xmlContent,
    })
  }

  static info(): Promise<Resp<any>> {
    return http.get('/agent/info')
  }
}

export type ToolResult = {
  id: string
  result: string
}
