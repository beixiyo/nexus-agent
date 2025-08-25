import type { ToolName } from 'nexus-common'

/**
 * 默认工具权限设置
 */
export const DEFAULT_TOOL_PERMISSIONS: ToolPermissions = {
  authorizedTools: [],
  autoConfirm: false,
  lastUpdated: Date.now(),
}

/**
 * 存储键名
 */
export const STORAGE_KEYS = {
  TOOL_PERMISSIONS: 'toolPermissions',
} as const

/**
 * 需要用户确认的危险工具类型
 */
export const DANGEROUS_TOOLS = [
  'write_file',
  'delete_file',
  'copy_file',
  'move_file',
  'delete_directory',
  'replace_file_content',
  'append_file',
  'insert_file_content',
  'run_command',
  'set_env_variable',
] satisfies ToolName[]

export type DangerousTool = typeof DANGEROUS_TOOLS[number]

/**
 * 工具风险等级
 */
export enum ToolRiskLevel {
  /** 安全工具 - 只读操作 */
  SAFE = 'safe',
  /** 中等风险 - 需要谨慎确认 */
  MEDIUM = 'medium',
  /** 高风险 - 需要明确确认 */
  HIGH = 'high',
}

/**
 * 用户工具权限设置
 */
export interface ToolPermissions {
  /** 已授权的工具列表 */
  authorizedTools: DangerousTool[]
  /** 是否启用自动确认 */
  autoConfirm: boolean
  /** 最后更新时间 */
  lastUpdated: number
}

/**
 * 工具风险配置
 */
export const TOOL_RISK_CONFIG: Record<DangerousTool, ToolRiskLevel> = {
  write_file: ToolRiskLevel.HIGH,
  delete_file: ToolRiskLevel.HIGH,
  copy_file: ToolRiskLevel.MEDIUM,
  move_file: ToolRiskLevel.MEDIUM,
  delete_directory: ToolRiskLevel.HIGH,
  replace_file_content: ToolRiskLevel.HIGH,
  append_file: ToolRiskLevel.MEDIUM,
  insert_file_content: ToolRiskLevel.MEDIUM,
  run_command: ToolRiskLevel.HIGH,
  set_env_variable: ToolRiskLevel.HIGH,
}
