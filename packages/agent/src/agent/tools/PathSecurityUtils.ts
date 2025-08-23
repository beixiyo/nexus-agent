import { isAbsolute, relative, resolve } from 'node:path'

/**
 * 路径安全检查工具
 */
export class PathSecurityUtils {
  /**
   * 检查路径是否安全（不超出工作目录）
   * @param workspaceRoot 工作目录根路径
   * @param targetPath 目标路径
   * @returns 检查结果，包含是否安全和错误信息
   */
  static checkPathSecurity(workspaceRoot: string, targetPath: string): {
    isSafe: boolean
    error?: string
    resolvedPath?: string
  } {
    try {
      const resolvedWorkspaceRoot = resolve(workspaceRoot)

      /** 如果是绝对路径，检查是否在工作目录内 */
      if (isAbsolute(targetPath)) {
        const resolvedTargetPath = resolve(targetPath)
        const relativePath = relative(resolvedWorkspaceRoot, resolvedTargetPath)

        /** 如果相对路径以 '..' 开头，说明路径超出了工作目录 */
        if (relativePath.startsWith('..')) {
          return {
            isSafe: false,
            error: `路径安全检查失败: 路径 "${targetPath}" 超出了工作目录范围`,
          }
        }

        return {
          isSafe: true,
          resolvedPath: resolvedTargetPath,
        }
      }

      /** 如果是相对路径，基于工作目录解析 */
      const resolvedTargetPath = resolve(workspaceRoot, targetPath)
      const relativePath = relative(resolvedWorkspaceRoot, resolvedTargetPath)

      /** 如果相对路径以 '..' 开头，说明路径超出了工作目录 */
      if (relativePath.startsWith('..')) {
        return {
          isSafe: false,
          error: `路径安全检查失败: 路径 "${targetPath}" 超出了工作目录范围`,
        }
      }

      return {
        isSafe: true,
        resolvedPath: resolvedTargetPath,
      }
    }
    catch (error: any) {
      return {
        isSafe: false,
        error: `路径安全检查异常: ${error.message}`,
      }
    }
  }

  /**
   * 验证路径安全性，如果失败则抛出错误
   * @param workspaceRoot 工作目录根路径
   * @param targetPath 目标路径
   * @returns 解析后的安全路径
   */
  static validatePath(workspaceRoot: string, targetPath: string): string {
    const result = this.checkPathSecurity(workspaceRoot, targetPath)

    if (!result.isSafe) {
      throw new Error(result.error)
    }

    return result.resolvedPath!
  }
}
