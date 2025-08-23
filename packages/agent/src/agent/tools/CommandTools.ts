import type { ToolName } from '../types'
import { execSync } from 'node:child_process'

/**
 * 命令执行工具处理器
 */
export class CommandTools {
  /**
   * 执行系统命令，返回命令执行结果
   */
  async runCommand(command: string): Promise<string> {
    const name: ToolName = 'run_command'
    return `用户拒绝执行 ${name}`

    try {
      const result = execSync(command, { encoding: 'utf8' })
      return result
    }
    catch (error: any) {
      return `${name} 执行命令失败: ${error.message}`
    }
  }
}
