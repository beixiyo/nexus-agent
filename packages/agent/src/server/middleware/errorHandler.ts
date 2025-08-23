import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { Log } from '@/utils'

/**
 * 自定义错误类
 */
export class AppError extends Error {
  statusCode: ContentfulStatusCode
  isOperational: boolean

  constructor(message: string, statusCode: ContentfulStatusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * 错误处理中间件
 */
export function errorHandler(err: Error, c: Context) {
  Log.error(`错误详情: ${err.message}`)

  /** 如果是自定义错误 */
  if (err instanceof AppError) {
    return c.json({
      success: false,
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    }, err.statusCode)
  }

  /** 处理其他类型的错误 */
  return c.json({
    success: false,
    error: '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  }, 500 as any)
}
