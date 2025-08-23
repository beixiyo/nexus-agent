import type { ToolCall } from '@jl-org/nexus-agent'
import type { DangerousTool } from '@/config'
import {
  isAppendFileParameters,
  isCopyFileParameters,
  isDeleteDirectoryParameters,
  isDeleteFileParameters,
  isInsertFileContentParameters,
  isMoveFileParameters,
  isReplaceFileContentParameters,
  isRunCommandParameters,
  isSetEnvVariableParameters,
  isWriteFileParameters,
  parseXMLResponse,
} from '@jl-org/nexus-agent'
import { DANGEROUS_TOOLS, TOOL_RISK_CONFIG, ToolRiskLevel } from '@/config'
import { ToolStorage } from './storage'

/**
 * 检测 XML 响应中的危险工具
 * @param xmlContent XML 响应内容
 * @returns 检测到的危险工具列表
 */
export async function detectDangerousTools(xmlContent: string): Promise<ToolCall[]> {
  try {
    /** 提取 <tools> 标签内容 */
    const tools = parseXMLResponse(xmlContent)?.tools || []

    /** 过滤出危险工具 */
    const dangerousTools = tools.filter(tool =>
      DANGEROUS_TOOLS.includes(tool.name as DangerousTool),
    )

    /** 检查用户权限设置 */
    const autoConfirm = await ToolStorage.getAutoConfirm()
    if (autoConfirm) {
      return []
    }

    /** 过滤掉已授权的工具 */
    const unauthorizedTools: ToolCall[] = []
    for (const tool of dangerousTools) {
      const isAuthorized = await ToolStorage.isToolAuthorized(tool.name as DangerousTool)
      if (!isAuthorized) {
        unauthorizedTools.push(tool)
      }
    }

    return unauthorizedTools
  }
  catch (error) {
    console.error('解析工具失败:', error)
    return []
  }
}

/**
 * 获取工具的风险等级
 * @param toolName 工具名称
 * @returns 风险等级
 */
export function getToolRiskLevel(toolName: string): ToolRiskLevel {
  return TOOL_RISK_CONFIG[toolName as DangerousTool] || ToolRiskLevel.SAFE
}

/**
 * 生成工具描述文本
 * @param tool 工具调用对象
 * @returns 描述文本
 */
export function generateToolDescription(tool: ToolCall): string {
  const { name, parameters } = tool

  switch (name) {
    case 'write_file':
      if (isWriteFileParameters(parameters)) {
        return `写入文件: ${parameters.filePath}`
      }
      return `执行工具: ${name}`
    case 'delete_file':
      if (isDeleteFileParameters(parameters)) {
        return `删除文件: ${parameters.filePath}`
      }
      return `执行工具: ${name}`
    case 'copy_file':
      if (isCopyFileParameters(parameters)) {
        return `复制文件: ${parameters.sourcePath} → ${parameters.targetPath}`
      }
      return `执行工具: ${name}`
    case 'move_file':
      if (isMoveFileParameters(parameters)) {
        return `移动文件: ${parameters.sourcePath} → ${parameters.targetPath}`
      }
      return `执行工具: ${name}`
    case 'delete_directory':
      if (isDeleteDirectoryParameters(parameters)) {
        return `删除目录: ${parameters.dirPath}`
      }
      return `执行工具: ${name}`
    case 'replace_file_content':
      if (isReplaceFileContentParameters(parameters)) {
        return `替换文件内容: ${parameters.filePath}`
      }
      return `执行工具: ${name}`
    case 'append_file':
      if (isAppendFileParameters(parameters)) {
        return `追加文件内容: ${parameters.filePath}`
      }
      return `执行工具: ${name}`
    case 'insert_file_content':
      if (isInsertFileContentParameters(parameters)) {
        return `插入文件内容: ${parameters.filePath}`
      }
      return `执行工具: ${name}`
    case 'run_command':
      if (isRunCommandParameters(parameters)) {
        return `执行命令: ${parameters.command}`
      }
      return `执行工具: ${name}`
    case 'set_env_variable':
      if (isSetEnvVariableParameters(parameters)) {
        return `设置环境变量: ${parameters.name} = ${parameters.value}`
      }
      return `执行工具: ${name}`
    default:
      return `执行工具: ${name}`
  }
}

/**
 * 检查是否包含危险工具
 * @param xmlContent XML 响应内容
 * @returns 是否包含危险工具
 */
export async function hasDangerousTools(xmlContent: string): Promise<boolean> {
  const tools = await detectDangerousTools(xmlContent)
  return tools.length > 0
}
