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
  workspaceRoot: string
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
   * @default process.cwd?.()
   */
  workspaceRoot?: string
}
