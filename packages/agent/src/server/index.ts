#!/usr/bin/env node
import { parseArgs } from 'node:util'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { Log } from '../utils'
import { SERVER_CONFIG } from './config'
import { errorHandler } from './middleware/errorHandler'

const app = new Hono()

/** 处理命令行参数 */
const {
  values,
  positionals,
} = parseArgs({
  args: process.argv.slice(2),
  options: {
    help: {
      type: 'boolean',
      short: 'h',
    },
    port: {
      type: 'string',
      short: 'p',
    },
  },
  allowPositionals: true,
})

/** 处理帮助参数 */
if (values.help) {
  Log.info('用法: nexus-agent [工作目录路径]')
  Log.info('')
  Log.info('参数:')
  Log.info('  工作目录路径     可选的工作目录，默认为当前目录')
  Log.info('')
  Log.info('选项:')
  Log.info('  -h, --help      显示帮助信息')
  Log.info('  -p, --port      设置服务器端口（默认: 3000）')
  Log.info('')
  Log.info('示例:')
  Log.info('  nexus-agent')
  Log.info('  nexus-agent /path/to/workspace')
  Log.info('  nexus-agent --port 8080')
  Log.info('  nexus-agent --port 8080 /path/to/workspace')
  Log.info('  nexus-agent --help')
  Log.info('')
  Log.info('环境变量:')
  Log.info('  PORT            设置服务器端口')
  Log.info('  WORKSPACE_ROOT  设置工作目录')
  process.exit(0)
}

/** 解析端口和工作目录 */
const port = values.port
  ? Number.parseInt(values.port)
  : undefined
const workspaceRoot = positionals[0] || process.env.WORKSPACE_ROOT || process.cwd?.()

if (port && (Number.isNaN(port) || port < 1 || port > 65535)) {
  console.error('错误: 端口必须是 1-65535 之间的数字')
  process.exit(1)
}

SERVER_CONFIG.port = port || SERVER_CONFIG.port
SERVER_CONFIG.workspaceRoot = workspaceRoot

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
