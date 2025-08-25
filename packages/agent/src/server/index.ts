#!/usr/bin/env node
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { Log } from '../utils'
import { SERVER_CONFIG } from './config'
import { errorHandler } from './middleware/errorHandler'

const app = new Hono()
SERVER_CONFIG.workspaceRoot = process.env.WORKSPACE_ROOT || process.argv[2] || process.cwd?.()

main()

async function main() {
  registerMiddlewares()
  await registerRoutes()
  extraHandlers()
  startServer()
}

function startServer() {
  Log.success(`🚀 Agent 服务器运行在 http://localhost:${SERVER_CONFIG.port}`)

  serve({
    fetch: app.fetch,
    port: SERVER_CONFIG.port,
  })
}

async function registerRoutes() {
  const { agentRouter } = await import('./routes/agent')
  app.route('/api/agent', agentRouter)
  app.get('/api/health', (c) => {
    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
  })
}

function registerMiddlewares() {
  app.use('*', logger())
  app.use('*', cors())
}

function extraHandlers() {
  /** 健康检查 */
  app.get('/api/health', (c) => {
    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
  })

  /** 错误处理 */
  app.onError(errorHandler)

  /** 404 处理 */
  app.notFound((c) => {
    return c.json({ error: '接口不存在' }, 404)
  })
}
