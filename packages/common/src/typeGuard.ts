import type { AppendFileParameters, CopyFileParameters, CreateDirectoryParameters, DeleteDirectoryParameters, DeleteFileParameters, GetEnvVariableParameters, GetFileInfoParameters, InsertFileContentParameters, ListFileParameters, MoveFileParameters, ReadFileParameters, ReplaceFileContentParameters, RunCommandParameters, SearchWebParameters, SetEnvVariableParameters, ToolParameters, WriteFileParameters } from './types'

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
