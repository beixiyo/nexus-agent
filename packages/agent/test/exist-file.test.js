/**
 * 文件和目录创建测试文件
 * 使用Node.js内置测试运行器
 */

import { test, describe, afterEach } from 'node:test'
import { strict as assert } from 'node:assert'
import { existsSync, unlinkSync, rmdirSync } from 'node:fs'
import { resolve } from 'node:path'

// 从构建后的代码导入
import { ToolExecutor } from '../dist/index.js'

describe('文件和目录创建测试', () => {
  afterEach(() => {
    // 清理测试文件和目录
    const fullPath = resolve(process.cwd(), 'llm-example/test-dir/test-file.txt')
    const dirPath = resolve(process.cwd(), 'llm-example/test-dir')

    if (existsSync(fullPath)) {
      unlinkSync(fullPath)
    }

    if (existsSync(dirPath)) {
      rmdirSync(dirPath)
    }
  })

  test('应该能够创建不存在的目录并写入文件', async () => {
    const executor = new ToolExecutor()

    // 创建一个测试工具调用，文件路径包含不存在的目录
    const toolCall = {
      id: '2',
      name: 'write_file',
      parameters: {
        filePath: 'llm-example/test-dir/test-file.txt',
        content: 'This is a test file in a newly created directory'
      }
    }

    const result = await executor.execute({
      user_task: '',
      thinking: '',
      tools: [toolCall],
      tools_result: '',
      final_answer: ''
    })

    // 检查执行结果
    assert.ok(result)
    assert.ok(Array.isArray(result))
    assert.strictEqual(result.length, 1)

    // 检查文件是否创建成功
    const fullPath = resolve(process.cwd(), 'llm-example/test-dir/test-file.txt')
    assert.ok(existsSync(fullPath), '文件应该被成功创建')
  })
})