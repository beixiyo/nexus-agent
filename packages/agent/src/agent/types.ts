/**
 * 定义支持的工具名称类型
 */
export type ToolName
  = | 'write_file'
    | 'list_file'
    | 'search_web'
    | 'run_command'
    | 'read_file'
  /** 文件操作增强工具 */
    | 'delete_file'
    | 'copy_file'
    | 'move_file'
    | 'create_directory'
    | 'delete_directory'
    | 'get_file_info'
  /** 文件内容处理工具 */
    | 'replace_file_content'
    | 'append_file'
    | 'insert_file_content'
  /** 系统信息工具 */
    | 'get_system_info'
    | 'get_env_variable'
    | 'set_env_variable'

/**
 * 定义各个工具的参数类型
 */
export type WriteFileParameters = {
  filePath: string
  content: string
}

export type ListFileParameters = {
  workspacePath: string
}

export type SearchWebParameters = {
  query: string
}

export type RunCommandParameters = {
  command: string
}

export type ReadFileParameters = {
  filePath: string
}

export type ReplaceFileContentParameters = {
  filePath: string
  oldContent: string
  newContent: string
}

/** 文件操作增强工具参数 */
export type DeleteFileParameters = {
  filePath: string
}

export type CopyFileParameters = {
  sourcePath: string
  targetPath: string
}

export type MoveFileParameters = {
  sourcePath: string
  targetPath: string
}

export type CreateDirectoryParameters = {
  dirPath: string
}

export type DeleteDirectoryParameters = {
  dirPath: string
  recursive?: boolean
}

/** 文件内容处理工具参数 */
export type AppendFileParameters = {
  filePath: string
  content: string
}

export type InsertFileContentParameters = {
  filePath: string
  position: number
  content: string
}

export type GetFileInfoParameters = {
  filePath: string
}

export type GetEnvVariableParameters = {
  name: string
}

export type SetEnvVariableParameters = {
  name: string
  value: string
}

/**
 * 定义工具参数的联合类型
 */
export type ToolParameters
  = | WriteFileParameters
    | ListFileParameters
    | SearchWebParameters
    | RunCommandParameters
    | ReadFileParameters
    | ReplaceFileContentParameters
    | DeleteFileParameters
    | CopyFileParameters
    | MoveFileParameters
    | CreateDirectoryParameters
    | DeleteDirectoryParameters
    | AppendFileParameters
    | InsertFileContentParameters
    | GetFileInfoParameters
    | GetEnvVariableParameters
    | SetEnvVariableParameters

/**
 * 工具调用接口
 */
export interface ToolCall {
  id: string
  name: ToolName
  parameters: ToolParameters
}

/**
 * Agent 响应接口
 */
export interface AgentResponse {
  user_task: string
  thinking: string
  tools: ToolCall[]
  tools_result: string
  final_answer: string

  /** 用于确保所有可能的工具都被处理 */
  _exhaustive?: never
}

/**
 * 单个工具执行结果
 */
export type ToolResult = {
  id: string
  result: string
}

/**
 * 文件信息接口
 */
export interface FileInfo {
  name: string
  path: string
  size: number
  isDirectory: boolean
  isFile: boolean
  createdTime: Date
  modifiedTime: Date
  permissions: string
}

/**
 * 系统信息接口
 */
export interface SystemInfo {
  platform: string
  arch: string
  nodeVersion: string
  memory: {
    total: number
    free: number
    used: number
  }
  cwd: string
  uptime: number
}

// ======================
// * 类型守卫函数
// ======================
export function isWriteFileParameters(params: ToolParameters): params is WriteFileParameters {
  return 'filePath' in params && 'content' in params
}

export function isListFileParameters(params: ToolParameters): params is ListFileParameters {
  return 'workspacePath' in params
}

export function isSearchWebParameters(params: ToolParameters): params is SearchWebParameters {
  return 'query' in params
}

export function isRunCommandParameters(params: ToolParameters): params is RunCommandParameters {
  return 'command' in params
}

export function isReadFileParameters(params: ToolParameters): params is ReadFileParameters {
  return 'filePath' in params
}

export function isReplaceFileContentParameters(params: ToolParameters): params is ReplaceFileContentParameters {
  return 'filePath' in params && 'oldContent' in params && 'newContent' in params
}

/** 文件操作增强工具类型守卫 */
export function isDeleteFileParameters(params: ToolParameters): params is DeleteFileParameters {
  return 'filePath' in params
}

export function isCopyFileParameters(params: ToolParameters): params is CopyFileParameters {
  return 'sourcePath' in params && 'targetPath' in params
}

export function isMoveFileParameters(params: ToolParameters): params is MoveFileParameters {
  return 'sourcePath' in params && 'targetPath' in params
}

export function isCreateDirectoryParameters(params: ToolParameters): params is CreateDirectoryParameters {
  return 'dirPath' in params
}

export function isDeleteDirectoryParameters(params: ToolParameters): params is DeleteDirectoryParameters {
  return 'dirPath' in params
}

/** 文件内容处理工具类型守卫 */
export function isAppendFileParameters(params: ToolParameters): params is AppendFileParameters {
  return 'filePath' in params && 'content' in params
}

export function isInsertFileContentParameters(params: ToolParameters): params is InsertFileContentParameters {
  return 'filePath' in params && 'position' in params && 'content' in params
}

export function isGetFileInfoParameters(params: ToolParameters): params is GetFileInfoParameters {
  return 'filePath' in params
}

export function isGetEnvVariableParameters(params: ToolParameters): params is GetEnvVariableParameters {
  return 'name' in params
}

export function isSetEnvVariableParameters(params: ToolParameters): params is SetEnvVariableParameters {
  return 'name' in params && 'value' in params
}

/**
 * XML 解析状态枚举
 */
export enum ParseState {
  NONE = 0,
  USER_TASK = 1,
  THINKING = 2,
  TOOLS = 3,
  TOOL_RESULT = 4,
  FINAL_ANSWER = 5,
}

export interface AgentOptions {
  debug?: boolean
  /**
   * 工作目录，默认是当前工作目录
   * @default process.cwd()
   */
  workspaceRoot?: string
}
