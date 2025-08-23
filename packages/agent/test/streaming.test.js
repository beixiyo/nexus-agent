// @ts-check

/**
 * 流式解析测试文件
 * 使用Node.js内置测试运行器
 */

import { test, describe } from 'node:test'
import { strict as assert } from 'node:assert'

// 从构建后的代码导入
import { XMLStateMachineParser } from '../dist/index.js'

const sample = '<user_task>测试任务</user_task>\n<thinking>思考中...'

describe('流式解析测试', () => {
  test('应该能够逐字符处理XML内容', () => {
    const parser = new XMLStateMachineParser()

    // 处理一些字符
    for (const char of sample) {
      parser.processChar(char)
    }

    assert.equal(parser.getResult().user_task, '测试任务')
    assert.equal(parser.getResult().thinking, '思考中...')
  })

  test('应该能够重置解析器状态', () => {
    const parser = new XMLStateMachineParser()

    // 处理一些字符
    for (const char of sample) {
      parser.processChar(char)
    }

    // 重置状态
    parser.reset()

    // 验证重置后状态
    const result = parser.getResult()
    assert.strictEqual(result.user_task, '')
    assert.strictEqual(result.thinking, '')
  })
})