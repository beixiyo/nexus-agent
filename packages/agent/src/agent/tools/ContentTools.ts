import type { ToolName } from '../types'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { PathSecurityUtils } from './PathSecurityUtils'

/**
 * 文件内容处理工具处理器
 */
export class ContentTools {
  /**
   * @param workspaceRoot 工作目录，默认为当前工作目录
   */
  constructor(private workspaceRoot = process.cwd()) { }

  /**
   * 追加内容到文件
   */
  async appendFile(filePath: string, content: string): Promise<string> {
    const name: ToolName = 'append_file'
    // return `用户拒绝执行 ${name}`

    try {
      const fullPath = PathSecurityUtils.validatePath(this.workspaceRoot, filePath)

      if (!existsSync(fullPath)) {
        return `${name} 追加失败: 文件不存在 ${filePath}`
      }

      const existingContent = readFileSync(fullPath, 'utf8')
      const newContent = existingContent + content
      writeFileSync(fullPath, newContent, 'utf8')

      return `${name} 成功追加内容到文件: ${filePath}`
    }
    catch (error: any) {
      return `${name} 追加文件内容失败: ${error.message}`
    }
  }

  /**
   * 在文件指定位置插入内容
   */
  async insertFileContent(filePath: string, position: number, content: string): Promise<string> {
    const name: ToolName = 'insert_file_content'
    // return `用户拒绝执行 ${name}`

    try {
      const fullPath = PathSecurityUtils.validatePath(this.workspaceRoot, filePath)

      if (!existsSync(fullPath)) {
        return `${name} 插入失败: 文件不存在 ${filePath}`
      }

      const existingContent = readFileSync(fullPath, 'utf8')

      if (position < 0 || position > existingContent.length) {
        return `${name} 插入失败: 位置 ${position} 超出文件内容范围 (0-${existingContent.length})`
      }

      const newContent = existingContent.slice(0, position) + content + existingContent.slice(position)
      writeFileSync(fullPath, newContent, 'utf8')

      return `${name} 成功在位置 ${position} 插入内容到文件: ${filePath}`
    }
    catch (error: any) {
      return `${name} 插入文件内容失败: ${error.message}`
    }
  }

  /**
   * 替换文件内容中的指定部分
   */
  async replaceFileContent(filePath: string, oldContent: string, newContent: string): Promise<string> {
    const name: ToolName = 'replace_file_content'
    // return `用户拒绝执行 ${name}`

    try {
      const fullPath = PathSecurityUtils.validatePath(this.workspaceRoot, filePath)
      const fileContent = readFileSync(fullPath, 'utf8')

      if (!fileContent.includes(oldContent)) {
        return `${name} 替换失败: 文件中未找到指定的旧内容`
      }

      const updatedContent = fileContent.replace(oldContent, newContent)
      writeFileSync(fullPath, updatedContent, 'utf8')

      return `${name} 成功替换文件内容: ${filePath}`
    }
    catch (error: any) {
      return `${name} 替换文件内容失败: ${error.message}`
    }
  }
}
