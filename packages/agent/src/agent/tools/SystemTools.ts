import type { SystemInfo, ToolName } from '../types'
import * as os from 'node:os'

/**
 * 系统信息工具处理器
 */
export class SystemTools {
  /**
   * 获取系统信息
   */
  async getSystemInfo(): Promise<string> {
    const name: ToolName = 'get_system_info'

    try {
      const systemInfo: SystemInfo = {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: os.version(),
        memory: {
          total: os.totalmem(),
          free: os.freemem(),
          used: os.totalmem() - os.freemem(),
        },
        cwd: process.cwd(),
        uptime: os.uptime(),
      }

      return JSON.stringify(systemInfo)
    }
    catch (error: any) {
      return `${name} 获取系统信息失败: ${error.message}`
    }
  }

  /**
   * 获取环境变量
   */
  async getEnvVariable(envName: string): Promise<string> {
    const name: ToolName = 'get_env_variable'

    try {
      const value = process.env[envName]

      if (value === undefined) {
        return `环境变量 ${envName} 不存在`
      }

      return `环境变量 ${envName} = ${value}`
    }
    catch (error: any) {
      return `${name} 获取环境变量失败: ${error.message}`
    }
  }

  /**
   * 设置环境变量
   */
  async setEnvVariable(envName: string, value: string): Promise<string> {
    const name: ToolName = 'set_env_variable'
    // return `用户拒绝执行 ${name}`

    try {
      process.env[envName] = value
      return `${name} 成功设置环境变量: ${envName} = ${value}`
    }
    catch (error: any) {
      return `${name} 设置环境变量失败: ${error.message}`
    }
  }
}
