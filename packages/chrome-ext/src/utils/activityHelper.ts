import type { ToolCall, ToolName } from '@jl-org/nexus-agent'
import type { ActivityItem } from '@/types'
import {
  isAppendFileParameters,
  isCopyFileParameters,
  isCreateDirectoryParameters,
  isDeleteDirectoryParameters,
  isDeleteFileParameters,
  isGetEnvVariableParameters,
  isGetFileInfoParameters,
  isInsertFileContentParameters,
  isListFileParameters,
  isMoveFileParameters,
  isReadFileParameters,
  isReplaceFileContentParameters,
  isRunCommandParameters,
  isSearchWebParameters,
  isSetEnvVariableParameters,
  isWriteFileParameters,
} from '@jl-org/nexus-agent'

/**
 * 活动记录辅助工具
 * 用于根据工具调用生成活动记录
 */
export class ActivityHelper {
  /**
   * 根据工具名称获取活动类型
   */
  static getActivityType(toolName: string): string {
    if (toolName.includes('file') || toolName.includes('write') || toolName.includes('read')) {
      return 'file'
    }
    if (toolName.includes('web') || toolName.includes('search') || toolName.includes('fetch')) {
      return 'web'
    }
    if (toolName.includes('command') || toolName.includes('exec') || toolName.includes('run')) {
      return 'command'
    }
    if (toolName.includes('content') || toolName.includes('text')) {
      return 'content'
    }
    return 'system'
  }

  /**
   * 根据工具名称获取活动动作描述
   */
  static getActivityAction(toolName: ToolName): string {
    const actionMap: Record<ToolName, string> = {
      /** 文件操作 */
      read_file: '读取文件',
      write_file: '写入文件',
      append_file: '追加文件',
      delete_file: '删除文件',
      copy_file: '复制文件',
      move_file: '移动文件',
      list_file: '列出文件',
      create_directory: '创建目录',
      delete_directory: '删除目录',
      replace_file_content: '替换文件内容',
      insert_file_content: '插入文件内容',
      get_file_info: '获取文件信息',

      /** 网络操作 */
      search_web: '搜索网络',

      /** 系统操作 */
      run_command: '执行命令',
      get_system_info: '获取系统信息',
      get_env_variable: '获取环境变量',
      set_env_variable: '设置环境变量',
    }

    return actionMap[toolName] || '执行工具'
  }

  /**
   * 根据工具调用生成活动目标描述
   */
  static getActivityTarget(tool: ToolCall): string {
    const { name, parameters } = tool

    /** 根据工具类型生成目标描述 */
    switch (name) {
      case 'read_file':
        if (isReadFileParameters(parameters)) {
          return parameters.filePath || '未知文件'
        }
        return '未知文件'

      case 'write_file':
        if (isWriteFileParameters(parameters)) {
          return parameters.filePath || '未知文件'
        }
        return '未知文件'

      case 'append_file':
        if (isAppendFileParameters(parameters)) {
          return parameters.filePath || '未知文件'
        }
        return '未知文件'

      case 'delete_file':
        if (isDeleteFileParameters(parameters)) {
          return parameters.filePath || '未知文件'
        }
        return '未知文件'

      case 'copy_file':
        if (isCopyFileParameters(parameters)) {
          return `${parameters.sourcePath} → ${parameters.targetPath}` || '未知文件'
        }
        return '未知文件'

      case 'move_file':
        if (isMoveFileParameters(parameters)) {
          return `${parameters.sourcePath} → ${parameters.targetPath}` || '未知文件'
        }
        return '未知文件'

      case 'replace_file_content':
        if (isReplaceFileContentParameters(parameters)) {
          return parameters.filePath || '未知文件'
        }
        return '未知文件'

      case 'insert_file_content':
        if (isInsertFileContentParameters(parameters)) {
          return parameters.filePath || '未知文件'
        }
        return '未知文件'

      case 'list_file':
        if (isListFileParameters(parameters)) {
          return parameters.workspacePath || '未知目录'
        }
        return '未知目录'

      case 'create_directory':
        if (isCreateDirectoryParameters(parameters)) {
          return parameters.dirPath || '未知目录'
        }
        return '未知目录'

      case 'delete_directory':
        if (isDeleteDirectoryParameters(parameters)) {
          return parameters.dirPath || '未知目录'
        }
        return '未知目录'

      case 'search_web':
        if (isSearchWebParameters(parameters)) {
          return parameters.query || '未知搜索'
        }
        return '未知搜索'

      case 'run_command':
        if (isRunCommandParameters(parameters)) {
          return parameters.command || '未知命令'
        }
        return '未知命令'

      case 'get_system_info':
        return '系统信息'

      case 'get_env_variable':
        if (isGetEnvVariableParameters(parameters)) {
          return parameters.name || '未知变量'
        }
        return '未知变量'

      case 'set_env_variable':
        if (isSetEnvVariableParameters(parameters)) {
          return `${parameters.name}=${parameters.value}` || '未知变量'
        }
        return '未知变量'

      case 'get_file_info':
        if (isGetFileInfoParameters(parameters)) {
          return parameters.filePath || '未知文件'
        }
        return '未知文件'

      default:
        return '未知操作'
    }
  }

  /**
   * 根据工具调用生成活动记录
   */
  static createActivityFromTool(tool: ToolCall, status: ActivityItem['status'] = 'success'): Omit<ActivityItem, 'id' | 'time'> {
    return {
      type: ActivityHelper.getActivityType(tool.name),
      action: ActivityHelper.getActivityAction(tool.name),
      target: ActivityHelper.getActivityTarget(tool),
      status,
    }
  }

  /**
   * 批量生成活动记录
   */
  static createActivitiesFromTools(tools: ToolCall[], status: ActivityItem['status'] = 'success'): Omit<ActivityItem, 'id' | 'time'>[] {
    return tools.map(tool => ActivityHelper.createActivityFromTool(tool, status))
  }
}
