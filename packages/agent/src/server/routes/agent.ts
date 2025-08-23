import { Hono } from 'hono'
import { AgentExecutor } from '@/agent/AgentExecutor'
import { AppError } from '@/server/middleware/errorHandler'
import { Log } from '@/utils'
import { SERVER_CONFIG } from '../config'
import { getAgentInfo, R } from '../utils'

const router = new Hono()
const agent = new AgentExecutor({
  workspaceRoot: SERVER_CONFIG.workspaceRoot,
})

/**
 * 处理 LLM XML 输出
 * POST /api/agent/process
 */
router.post('/process', async (c) => {
  try {
    const body: ProcessXmlRequest = await c.req.json()

    if (!body.xmlContent) {
      throw new AppError('缺少必需的 xmlContent 参数', 400)
    }

    if (typeof body.xmlContent !== 'string') {
      throw new AppError('xmlContent 必须是字符串类型', 400)
    }

    Log.info(`处理 XML 内容，长度: ${body.xmlContent.length}`)
    const result = await agent.process(body.xmlContent)
    Log.success('XML 处理完成')

    return c.json(R.success({
      result,
      timestamp: new Date().toISOString(),
    }))
  }
  catch (error) {
    if (error instanceof AppError) {
      Log.error(`应用错误: ${error.message}`, error)
      throw error
    }
    Log.error('处理失败', error)
    throw new AppError('处理失败', 500)
  }
})

/**
 * 获取 Agent 信息
 * GET /api/agent/info
 */
router.get('/info', (c) => {
  return c.json({
    success: true,
    data: getAgentInfo(),
  })
})

export { router as agentRouter }

interface ProcessXmlRequest {
  xmlContent: string
}
