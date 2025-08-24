import type { FileInfo, ToolName } from '../types'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { PathSecurityUtils } from './PathSecurityUtils'

/**
 * 文件操作工具处理器
 */
export class FileTools {
  /**
   * @param workspaceRoot 工作目录，默认为当前工作目录
   */
  constructor(private workspaceRoot = process.cwd()) { }

  /**
   * 写入文件，相对于配置的工作目录
   */
  async writeFile(filePath: string, content: string): Promise<string> {
    const name: ToolName = 'write_file'
    return `用户拒绝执行 ${name}`

    try {
      const fullPath = PathSecurityUtils.validatePath(this.workspaceRoot, filePath)
      const dir = dirname(fullPath)

      /** 检查目录是否存在，不存在则创建 */
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }

      writeFileSync(fullPath, content, 'utf8')
      return `${name} 成功写入文件: ${filePath}`
    }
    catch (error: any) {
      return `${name} 写入文件失败: ${error.message}`
    }
  }

  /**
   * 读取文件内容，相对于配置的工作目录
   */
  async readFile(filePath: string): Promise<string> {
    const name: ToolName = 'read_file'

    try {
      const fullPath = PathSecurityUtils.validatePath(this.workspaceRoot, filePath)
      const content = readFileSync(fullPath, 'utf8')
      return content
    }
    catch (error: any) {
      return `${name} 读取文件失败: ${error.message}`
    }
  }

  /**
   * 列出目录文件，相对于配置的工作目录
   */
  async listFile(workspacePath: string): Promise<string> {
    const name: ToolName = 'list_file'

    try {
      const files = readdirSync(PathSecurityUtils.validatePath(this.workspaceRoot, workspacePath))
      return `[${files.join(', ')}]`
    }
    catch (error: any) {
      return `${name} 列出文件失败: ${error.message}`
    }
  }

  /**
   * 删除文件
   */
  async deleteFile(filePath: string): Promise<string> {
    const name: ToolName = 'delete_file'
    return `用户拒绝执行 ${name}`

    try {
      const fullPath = PathSecurityUtils.validatePath(this.workspaceRoot, filePath)

      if (!existsSync(fullPath)) {
        return `${name} 删除失败: 文件不存在 ${filePath}`
      }

      unlinkSync(fullPath)
      return `${name} 成功删除文件: ${filePath}`
    }
    catch (error: any) {
      return `${name} 删除文件失败: ${error.message}`
    }
  }

  /**
   * 复制文件
   */
  async copyFile(sourcePath: string, targetPath: string): Promise<string> {
    const name: ToolName = 'copy_file'
    return `用户拒绝执行 ${name}`

    try {
      const fullSourcePath = PathSecurityUtils.validatePath(this.workspaceRoot, sourcePath)
      const fullTargetPath = PathSecurityUtils.validatePath(this.workspaceRoot, targetPath)

      if (!existsSync(fullSourcePath)) {
        return `${name} 复制失败: 源文件不存在 ${sourcePath}`
      }

      const targetDir = dirname(fullTargetPath)
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true })
      }

      copyFileSync(fullSourcePath, fullTargetPath)
      return `${name} 成功复制文件: ${sourcePath} -> ${targetPath}`
    }
    catch (error: any) {
      return `${name} 复制文件失败: ${error.message}`
    }
  }

  /**
   * 移动文件
   */
  async moveFile(sourcePath: string, targetPath: string): Promise<string> {
    const name: ToolName = 'move_file'
    return `用户拒绝执行 ${name}`

    try {
      const fullSourcePath = PathSecurityUtils.validatePath(this.workspaceRoot, sourcePath)
      const fullTargetPath = PathSecurityUtils.validatePath(this.workspaceRoot, targetPath)

      if (!existsSync(fullSourcePath)) {
        return `${name} 移动失败: 源文件不存在 ${sourcePath}`
      }

      const targetDir = dirname(fullTargetPath)
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true })
      }

      renameSync(fullSourcePath, fullTargetPath)
      return `${name} 成功移动文件: ${sourcePath} -> ${targetPath}`
    }
    catch (error: any) {
      return `${name} 移动文件失败: ${error.message}`
    }
  }

  /**
   * 创建目录
   */
  async createDirectory(dirPath: string): Promise<string> {
    const name: ToolName = 'create_directory'
    return `用户拒绝执行 ${name}`

    try {
      const fullPath = PathSecurityUtils.validatePath(this.workspaceRoot, dirPath)

      if (existsSync(fullPath)) {
        return `${name} 创建失败: 目录已存在 ${dirPath}`
      }

      mkdirSync(fullPath, { recursive: true })
      return `${name} 成功创建目录: ${dirPath}`
    }
    catch (error: any) {
      return `${name} 创建目录失败: ${error.message}`
    }
  }

  /**
   * 删除目录
   */
  async deleteDirectory(dirPath: string, recursive: boolean = false): Promise<string> {
    const name: ToolName = 'delete_directory'
    return `用户拒绝执行 ${name}`

    try {
      const fullPath = PathSecurityUtils.validatePath(this.workspaceRoot, dirPath)

      if (!existsSync(fullPath)) {
        return `${name} 删除失败: 目录不存在 ${dirPath}`
      }

      const stats = statSync(fullPath)
      if (!stats.isDirectory()) {
        return `${name} 删除失败: 路径不是目录 ${dirPath}`
      }

      if (recursive) {
        /** 递归删除目录及其内容 */
        this.deleteDirectoryRecursive(fullPath)
      }
      else {
        /** 只删除空目录 */
        rmdirSync(fullPath)
      }

      return `${name} 成功删除目录: ${dirPath}`
    }
    catch (error: any) {
      return `${name} 删除目录失败: ${error.message}`
    }
  }

  /**
   * 递归删除目录
   */
  private deleteDirectoryRecursive(dirPath: string): string {
    const files = readdirSync(dirPath)

    for (const file of files) {
      const fullPath = resolve(dirPath, file)
      const stats = statSync(fullPath)

      if (stats.isDirectory()) {
        this.deleteDirectoryRecursive(fullPath)
      }
      else {
        unlinkSync(fullPath)
      }
    }

    rmdirSync(dirPath)
    return '执行成功'
  }

  /**
   * 获取文件信息
   */
  async getFileInfo(filePath: string): Promise<string> {
    const name: ToolName = 'get_file_info'

    try {
      const fullPath = PathSecurityUtils.validatePath(this.workspaceRoot, filePath)

      if (!existsSync(fullPath)) {
        return `${name} 获取失败: 文件不存在 ${filePath}`
      }

      const stats = statSync(fullPath)
      const fileInfo: FileInfo = {
        name: basename(fullPath),
        path: fullPath,
        size: stats.size,
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile(),
        createdTime: stats.birthtime,
        modifiedTime: stats.mtime,
        permissions: this.getPermissionsString(stats.mode),
      }

      return JSON.stringify(fileInfo)
    }
    catch (error: any) {
      return `${name} 获取文件信息失败: ${error.message}`
    }
  }

  /**
   * 获取权限字符串
   */
  private getPermissionsString(mode: number): string {
    const permissions = {
      owner: {
        read: !!(mode & 0o400),
        write: !!(mode & 0o200),
        execute: !!(mode & 0o100),
      },
      group: {
        read: !!(mode & 0o040),
        write: !!(mode & 0o020),
        execute: !!(mode & 0o010),
      },
      others: {
        read: !!(mode & 0o004),
        write: !!(mode & 0o002),
        execute: !!(mode & 0o001),
      },
    }

    const permString = [
      permissions.owner.read
        ? 'r'
        : '-',
      permissions.owner.write
        ? 'w'
        : '-',
      permissions.owner.execute
        ? 'x'
        : '-',
      permissions.group.read
        ? 'r'
        : '-',
      permissions.group.write
        ? 'w'
        : '-',
      permissions.group.execute
        ? 'x'
        : '-',
      permissions.others.read
        ? 'r'
        : '-',
      permissions.others.write
        ? 'w'
        : '-',
      permissions.others.execute
        ? 'x'
        : '-',
    ].join('')

    return permString
  }
}
