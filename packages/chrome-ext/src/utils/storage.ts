import type { DangerousTool, ToolPermissions } from '@/config'
import { DEFAULT_TOOL_PERMISSIONS, STORAGE_KEYS } from '@/config'

/**
 * Chrome 存储管理工具
 */
export class ToolStorage {
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
