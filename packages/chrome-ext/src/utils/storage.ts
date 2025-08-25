import type { DangerousTool, ToolPermissions } from '@/config'
import { AGENT_ENABLED_KEY, CONNECTION_CONFIG_KEY, DEFAULT_AGENT_ENABLED, DEFAULT_CONNECTION_CONFIG, DEFAULT_TOOL_PERMISSIONS, STORAGE_KEYS } from '@/config'

/**
 * Chrome 存储管理工具
 */
export class ChromeStorage {
  /**
   * 获取工具权限设置
   */
  static async getToolPermissions(): Promise<ToolPermissions> {
    try {
      const result = await chrome.storage.sync.get(STORAGE_KEYS.TOOL_PERMISSIONS)
      return result[STORAGE_KEYS.TOOL_PERMISSIONS] || DEFAULT_TOOL_PERMISSIONS
    }
    catch (error) {
      console.error('获取工具权限设置失败:', error)
      return DEFAULT_TOOL_PERMISSIONS
    }
  }

  /**
   * 保存工具权限设置
   */
  static async setToolPermissions(permissions: Partial<ToolPermissions>): Promise<void> {
    try {
      const current = await this.getToolPermissions()
      const updated = {
        ...current,
        ...permissions,
        lastUpdated: Date.now(),
      }

      await chrome.storage.sync.set({
        [STORAGE_KEYS.TOOL_PERMISSIONS]: updated,
      })
    }
    catch (error) {
      console.error('保存工具权限设置失败:', error)
    }
  }

  /**
   * 检查工具是否已授权
   */
  static async isToolAuthorized(toolName: DangerousTool): Promise<boolean> {
    const permissions = await this.getToolPermissions()
    return permissions.authorizedTools.includes(toolName)
  }

  /**
   * 授权工具
   */
  static async authorizeTool(toolName: DangerousTool): Promise<void> {
    const permissions = await this.getToolPermissions()
    if (!permissions.authorizedTools.includes(toolName)) {
      permissions.authorizedTools.push(toolName)
      await this.setToolPermissions(permissions)
    }
  }

  /**
   * 撤销工具授权
   */
  static async revokeToolAuthorization(toolName: DangerousTool): Promise<void> {
    const permissions = await this.getToolPermissions()
    permissions.authorizedTools = permissions.authorizedTools.filter(tool => tool !== toolName)
    await this.setToolPermissions(permissions)
  }

  /**
   * 设置自动确认状态
   */
  static async setAutoConfirm(enabled: boolean): Promise<void> {
    await this.setToolPermissions({ autoConfirm: enabled })
  }

  /**
   * 获取自动确认状态
   */
  static async getAutoConfirm(): Promise<boolean> {
    const permissions = await this.getToolPermissions()
    return permissions.autoConfirm
  }

  /**
   * 获取连接配置
   */
  static async getConnectionConfig(): Promise<ConnectionConfig> {
    try {
      const result = await chrome.storage.sync.get(CONNECTION_CONFIG_KEY)
      return result[CONNECTION_CONFIG_KEY] || DEFAULT_CONNECTION_CONFIG
    }
    catch (error) {
      console.error('获取连接配置失败:', error)
      return DEFAULT_CONNECTION_CONFIG
    }
  }

  /**
   * 保存连接配置
   */
  static async setConnectionConfig(config: Partial<ConnectionConfig>): Promise<void> {
    try {
      const current = await this.getConnectionConfig()
      const updated = {
        ...current,
        ...config,
      }

      await chrome.storage.sync.set({
        [CONNECTION_CONFIG_KEY]: updated,
      })
    }
    catch (error) {
      console.error('保存连接配置失败:', error)
    }
  }

  /**
   * 获取 Agent 启用状态
   */
  static async getAgentEnabled(): Promise<boolean> {
    try {
      const result = await chrome.storage.sync.get(AGENT_ENABLED_KEY)
      return result[AGENT_ENABLED_KEY] ?? DEFAULT_AGENT_ENABLED
    }
    catch (error) {
      console.error('获取 Agent 启用状态失败:', error)
      return DEFAULT_AGENT_ENABLED
    }
  }

  /**
   * 保存 Agent 启用状态
   */
  static async setAgentEnabled(enabled: boolean): Promise<void> {
    try {
      await chrome.storage.sync.set({
        [AGENT_ENABLED_KEY]: enabled,
      })
    }
    catch (error) {
      console.error('保存 Agent 启用状态失败:', error)
    }
  }

  /**
   * 清除所有设置
   */
  static async clearAll(): Promise<void> {
    try {
      await chrome.storage.sync.clear()
    }
    catch (error) {
      console.error('清除存储失败:', error)
    }
  }
}

/**
 * 连接配置类型
 */
export interface ConnectionConfig {
  serverUrl: string
  timeout: number
  retryCount: number
}
