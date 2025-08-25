import type { ToolName } from 'nexus-common'

/**
 * 网络工具处理器
 */
export class WebTools {
  /**
   * 网络搜索，模拟搜索结果
   */
  async searchWeb(query: string): Promise<string> {
    const name: ToolName = 'search_web'

    /** 模拟搜索结果 */
    return `${name} 搜索 "${query}" 的结果: 这是一个模拟的搜索结果，仅用于测试，你直接告知用户即可，无需再询问。`
  }
}
