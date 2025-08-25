// @ts-check

/**
 * 文件内容替换测试文件
 * 使用Node.js内置测试运行器
 */

import { test, describe, beforeEach, afterEach } from 'node:test'
import { strict as assert } from 'node:assert'
import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// 从构建后的代码导入
import { ToolExecutor } from '../dist/index.js'

describe('文件内容替换测试', () => {
  const targetFilePath = 'llm-example/test-file-for-replace.txt'
  let testFilePath
  let executor

  beforeEach(() => {
    testFilePath = resolve(process.cwd?.(), targetFilePath)
    executor = new ToolExecutor()

    // 测试前准备
    writeFileSync(testFilePath, '这是测试文件的内容\n包含多行文本\n用于测试替换功能', 'utf8')
  })

  afterEach(() => {
    // 清理测试文件
    if (existsSync(testFilePath)) {
      unlinkSync(testFilePath)
    }
  })

  test('应该成功替换文件中的内容', async () => {
    const result = await executor.executeSingleTool({
      id: 'test-1',
      name: 'replace_file_content',
      parameters: {
        filePath: targetFilePath,
        oldContent: '测试文件',
        newContent: '验证文件'
      }
    })

    // 验证工具执行结果
    assert.ok(result.result.includes('成功替换文件内容'), '应该成功替换文件内容')

    // 验证文件内容是否真的被替换
    const content = readFileSync(testFilePath, 'utf8')
    assert.ok(content.includes('验证文件'), '文件应包含新内容')
    assert.ok(!content.includes('测试文件'), '文件不应包含旧内容')
  })

  test('当文件中不包含旧内容时应该返回错误', async () => {
    const result = await executor.executeSingleTool({
      id: 'test-2',
      name: 'replace_file_content',
      parameters: {
        filePath: targetFilePath,
        oldContent: '不存在的内容',
        newContent: '新内容'
      }
    })

    // 验证错误信息
    assert.ok(result.result.includes('替换失败'), '应该返回替换失败信息')
    assert.ok(result.result.includes('文件中未找到指定的旧内容'), '应该提示未找到旧内容')
  })

  test('当文件不存在时应该返回错误', async () => {
    const result = await executor.executeSingleTool({
      id: 'test-3',
      name: 'replace_file_content',
      parameters: {
        filePath: 'non-existent-file.txt',
        oldContent: '一些内容',
        newContent: '新内容'
      }
    })

    // 验证错误信息
    assert.ok(result.result.includes('替换文件内容失败'), '应该返回替换失败信息')
  })
})