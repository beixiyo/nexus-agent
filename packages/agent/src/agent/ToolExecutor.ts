import type { AgentResponse, ToolCall, ToolName, ToolResult } from './types'
import { Log } from '@/utils'
import { CommandTools } from './tools/CommandTools'
import { ContentTools } from './tools/ContentTools'
import { FileTools } from './tools/FileTools'
import { SystemTools } from './tools/SystemTools'
import { WebTools } from './tools/WebTools'
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
} from './types'

/**
 * 类型检查用的
 */
const SafeTypeSupportedTools: Record<ToolName, null> = {
  write_file: null,
  list_file: null,
  search_web: null,
  run_command: null,
  read_file: null,
  delete_file: null,
  copy_file: null,
  move_file: null,
  create_directory: null,
  delete_directory: null,
  get_file_info: null,
  replace_file_content: null,
  append_file: null,
  insert_file_content: null,
  get_system_info: null,
  get_env_variable: null,
  set_env_variable: null,
}

/**
 * 工具执行器实现，执行工具调用，返回结果
 */
export class ToolExecutor {
  /** 工作目录根路径 */
  private workspaceRoot: string

  /** 文件操作工具 */
  private fileTools: FileTools
  /** 内容处理工具 */
  private contentTools: ContentTools
  /** 系统信息工具 */
  private systemTools: SystemTools
  /** 网络工具 */
  private webTools: WebTools
  /** 命令执行工具 */
  private commandTools: CommandTools
  /** 支持的工具列表 */
  static readonly supportedTools: ToolName[] = Object.freeze(Object.keys(SafeTypeSupportedTools)) as ToolName[]

  /**
   * @param workspaceRoot 默认是当前工作目录
   */
  constructor(workspaceRoot?: string) {
    this.workspaceRoot = workspaceRoot || process.cwd()
    this.fileTools = new FileTools(this.workspaceRoot)
    this.contentTools = new ContentTools(this.workspaceRoot)
    this.systemTools = new SystemTools()
    this.webTools = new WebTools()
    this.commandTools = new CommandTools()
  }

  /**
   * 执行工具调用
   * @param response - 解析后的响应对象
   * @returns 工具执行结果
   */
  async execute(response: AgentResponse): Promise<ToolResult[]> {
    const tools = response.tools
    if (!tools || tools.length === 0) {
      Log.info('没有需要执行的工具')
      return []
    }

    Log.info(`开始执行 ${tools.length} 个工具调用`)

    /** 执行所有工具并收集结果 */
    const results = await Promise.all(tools.map(async (tool) => {
      return await this.executeSingleTool(tool)
    }))

    Log.success(`所有工具执行完成，共 ${results.length} 个结果`)
    return results
  }

  /**
   * 执行单个工具调用
   * @param tool - 工具调用对象
   * @returns 工具执行结果
   */
  async executeSingleTool(tool: ToolCall): Promise<ToolResult> {
    let result = ''
    const { parameters, name, id } = tool

    Log.info(`执行工具: ${name} (${id}) \n ${JSON.stringify(parameters, null, 2)}`)

    switch (name) {
      /** 文件操作工具 */
      case 'read_file':
        if (isReadFileParameters(parameters)) {
          result = await this.fileTools.readFile(parameters.filePath)
        }
        else {
          result = 'read_file 工具参数错误: 缺少 filePath'
        }
        break

      case 'write_file':
        if (isWriteFileParameters(parameters)) {
          result = await this.fileTools.writeFile(parameters.filePath, parameters.content)
        }
        else {
          result = 'write_file 工具参数错误: 缺少 filePath 或 content'
        }
        break

      case 'list_file':
        if (isListFileParameters(parameters)) {
          result = await this.fileTools.listFile(parameters.workspacePath)
        }
        else {
          result = 'list_file 工具参数错误: 缺少 workspacePath'
        }
        break

      case 'replace_file_content':
        if (isReplaceFileContentParameters(parameters)) {
          result = await this.contentTools.replaceFileContent(parameters.filePath, parameters.oldContent, parameters.newContent)
        }
        else {
          result = 'replace_file_content 工具参数错误: 缺少 filePath、oldContent 或 newContent'
        }
        break

      case 'delete_file':
        if (isDeleteFileParameters(parameters)) {
          result = await this.fileTools.deleteFile(parameters.filePath)
        }
        else {
          result = 'delete_file 工具参数错误: 缺少 filePath'
        }
        break

      case 'copy_file':
        if (isCopyFileParameters(parameters)) {
          result = await this.fileTools.copyFile(parameters.sourcePath, parameters.targetPath)
        }
        else {
          result = 'copy_file 工具参数错误: 缺少 sourcePath 或 targetPath'
        }
        break

      case 'move_file':
        if (isMoveFileParameters(parameters)) {
          result = await this.fileTools.moveFile(parameters.sourcePath, parameters.targetPath)
        }
        else {
          result = 'move_file 工具参数错误: 缺少 sourcePath 或 targetPath'
        }
        break

      case 'create_directory':
        if (isCreateDirectoryParameters(parameters)) {
          result = await this.fileTools.createDirectory(parameters.dirPath)
        }
        else {
          result = 'create_directory 工具参数错误: 缺少 dirPath'
        }
        break

      case 'delete_directory':
        if (isDeleteDirectoryParameters(parameters)) {
          result = await this.fileTools.deleteDirectory(parameters.dirPath, parameters.recursive)
        }
        else {
          result = 'delete_directory 工具参数错误: 缺少 dirPath'
        }
        break

      case 'get_file_info':
        if (isGetFileInfoParameters(parameters)) {
          result = await this.fileTools.getFileInfo(parameters.filePath)
        }
        else {
          result = 'get_file_info 工具参数错误: 缺少 filePath'
        }
        break

      /** 内容处理工具 */
      case 'append_file':
        if (isAppendFileParameters(parameters)) {
          result = await this.contentTools.appendFile(parameters.filePath, parameters.content)
        }
        else {
          result = 'append_file 工具参数错误: 缺少 filePath 或 content'
        }
        break

      case 'insert_file_content':
        if (isInsertFileContentParameters(parameters)) {
          result = await this.contentTools.insertFileContent(parameters.filePath, parameters.position, parameters.content)
        }
        else {
          result = 'insert_file_content 工具参数错误: 缺少 filePath、position 或 content'
        }
        break

      /** 系统信息工具 */
      case 'get_system_info':
        result = await this.systemTools.getSystemInfo()
        break

      case 'get_env_variable':
        if (isGetEnvVariableParameters(parameters)) {
          result = await this.systemTools.getEnvVariable(parameters.name)
        }
        else {
          result = 'get_env_variable 工具参数错误: 缺少 name'
        }
        break

      case 'set_env_variable':
        if (isSetEnvVariableParameters(parameters)) {
          result = await this.systemTools.setEnvVariable(parameters.name, parameters.value)
        }
        else {
          result = 'set_env_variable 工具参数错误: 缺少 name 或 value'
        }
        break

      /** 网络工具 */
      case 'search_web':
        if (isSearchWebParameters(parameters)) {
          result = await this.webTools.searchWeb(parameters.query)
        }
        else {
          result = 'search_web 工具参数错误: 缺少 query'
        }
        break

      /** 命令执行工具 */
      case 'run_command':
        if (isRunCommandParameters(parameters)) {
          result = await this.commandTools.runCommand(parameters.command)
        }
        else {
          result = 'run_command 工具参数错误: 缺少 command'
        }
        break

      default:
        result = `未知工具: ${name}`
        Log.warn(`尝试执行未知工具: ${name}`)
    }

    Log.debug(`工具执行完成: ${name} (${id})`)
    return { id, result }
  }
}
