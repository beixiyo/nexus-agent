// @ts-check

/**
 * 缓存机制测试文件
 * 使用Node.js内置测试运行器
 */

import { strict as assert } from 'node:assert'
import { existsSync, unlinkSync } from 'node:fs'
import { afterEach, beforeEach, describe, it } from 'node:test'

/** 从构建后的代码导入 */
import { ToolExecutor } from '../dist/index.js'

describe('缓存机制测试', () => {
  let executor

  beforeEach(() => {
    executor = new ToolExecutor()
  })

  afterEach(() => {
    /** 清理测试文件 */
    if (existsSync('llm-example/test-cache.txt')) {
      unlinkSync('llm-example/test-cache.txt')
    }
    if (existsSync('llm-example/test-cache1.txt')) {
      unlinkSync('llm-example/test-cache1.txt')
    }
    if (existsSync('llm-example/test-cache2.txt')) {
      unlinkSync('llm-example/test-cache2.txt')
    }
  })

  it('应该在相同工具调用时返回缓存结果', async () => {
    /** 创建一个测试工具调用 */
    const toolCall = {
      id: '1',
      name: 'write_file',
      parameters: {
        filePath: 'llm-example/test-cache.txt',
        content: 'This is a test file for cache testing',
      },
    }

    /** 第一次执行工具调用 */
    const result1 = await executor.execute({
      user_task: '',
      thinking: '',
      tools: [toolCall],
      tools_result: '',
      final_answer: '',
    })

    /** 删除文件以确保第二次调用不是因为文件已存在而成功 */
    try {
      unlinkSync('llm-example/test-cache.txt')
    }
    catch (e) {
      /** 文件可能不存在，忽略错误 */
    }

    /** 第二次执行相同的工具调用 */
    const result2 = await executor.execute({
      user_task: '',
      thinking: '',
      tools: [toolCall],
      tools_result: '',
      final_answer: '',
    })

    /** 检查两次结果是否相同 */
    assert.strictEqual(result1[0].result, result2[0].result, '两次执行应返回相同结果')
  })

  it('应该为不同工具调用返回不同结果', async () => {
    /** 创建两个不同的工具调用 */
    const toolCall1 = {
      id: '1',
      name: 'write_file',
      parameters: {
        filePath: 'llm-example/test-cache1.txt',
        content: 'Test content 1',
      },
    }

    const toolCall2 = {
      id: '2',
      name: 'write_file',
      parameters: {
        filePath: 'llm-example/test-cache2.txt',
        content: 'Test content 2',
      },
    }

    /** 执行两个不同的工具调用 */
    const result1 = await executor.execute({
      user_task: '',
      thinking: '',
      tools: [toolCall1],
      tools_result: '',
      final_answer: '',
    })

    const result2 = await executor.execute({
      user_task: '',
      thinking: '',
      tools: [toolCall2],
      tools_result: '',
      final_answer: '',
    })

    /** 检查两次结果是否不同 */
    assert.notStrictEqual(result1[0].result, result2[0].result, '不同工具调用应返回不同结果')
  })
})
