import { SystemTools, ToolExecutor } from '@/agent'
import { SERVER_CONFIG } from '../config'

/**
 * 获取 Agent 信息
 */
export function getAgentInfo() {
  return {
    workspaceRoot: SERVER_CONFIG.workspaceRoot,
    supportedTools: ToolExecutor.supportedTools,
    ...new SystemTools().getSystemInfo(),
  }
}

export class R {
  static success<T>(data: T) {
    return {
      success: true,
      data,
    }
  }

  static error(message: string) {
    return {
      success: false,
      message,
    }
  }
}
