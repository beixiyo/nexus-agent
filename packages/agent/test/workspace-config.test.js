// @ts-check

import { test, describe, afterEach, before, after } from 'node:test'
import { strict as assert } from 'node:assert'
import { AgentExecutor } from '../dist/index.js'
import { resolve } from 'node:path'
import { existsSync, readFileSync, unlinkSync, rmdirSync, writeFileSync, mkdirSync } from 'node:fs'

/**
 * 工作目录配置测试
 */

describe('工作目录配置测试', () => {
  const testDir = resolve('./test-workspace')
  const testFile = 'test-file.txt'
  const testContent = '测试内容'

  // 在测试前创建目录和文件
  before(() => {
    try {
      // 创建测试目录
      if (!existsSync(testDir)) {
        mkdirSync(testDir, { recursive: true })
      }

      // 创建测试文件
      writeFileSync(resolve(testDir, testFile), testContent)
      writeFileSync(resolve(testDir, 'another-file.txt'), 'Another test content')
    } catch (error) {
      // 忽略创建错误
    }
  })

  // 在所有测试完成后清理
  after(() => {
    try {
      // 删除测试文件
      if (existsSync(resolve(testDir, testFile))) {
        unlinkSync(resolve(testDir, testFile))
      }
      if (existsSync(resolve(testDir, 'another-file.txt'))) {
        unlinkSync(resolve(testDir, 'another-file.txt'))
      }
      // 删除测试目录
      if (existsSync(testDir)) {
        rmdirSync(testDir)
      }
    } catch (error) {
      // 忽略清理错误
    }
  })

  test('应该使用默认工作目录 (process.cwd?.())', async () => {
    const agent = new AgentExecutor({ debug: false })

    const xmlContent = `
      <user_task>创建测试文件</user_task>
      <tools>
      [
        {
          "id": "1",
          "name": "write_file",
          "parameters": {
            "filePath": "${testFile}",
            "content": "${testContent}"
          }
        }
      ]
      </tools>
      <final_answer>文件已创建</final_answer>
    `

    await agent.process(xmlContent)

    // 验证文件在默认工作目录中创建
    const filePath = resolve(process.cwd?.(), testFile)
    assert.ok(existsSync(filePath), '文件应该存在')
    assert.strictEqual(readFileSync(filePath, 'utf8'), testContent, '文件内容应该正确')

    // 清理
    unlinkSync(filePath)
  })

  test('应该使用自定义工作目录', async () => {
    const agent = new AgentExecutor({
      debug: false,
      workspaceRoot: testDir
    })

    const xmlContent = `
      <user_task>在自定义目录中创建测试文件</user_task>
      <tools>
      [
        {
          "id": "1",
          "name": "write_file",
          "parameters": {
            "filePath": "${testFile}",
            "content": "${testContent}"
          }
        }
      ]
      </tools>
      <final_answer>文件已在自定义目录中创建</final_answer>
    `

    await agent.process(xmlContent)

    // 验证文件在自定义工作目录中创建
    const filePath = resolve(testDir, testFile)
    assert.ok(existsSync(filePath), '文件应该存在')
    assert.strictEqual(readFileSync(filePath, 'utf8'), testContent, '文件内容应该正确')
  })

  test('应该正确处理相对路径', async () => {
    const agent = new AgentExecutor({
      debug: false,
      workspaceRoot: testDir
    })

    const xmlContent = `
      <user_task>使用相对路径创建文件</user_task>
      <tools>
      [
        {
          "id": "1",
          "name": "write_file",
          "parameters": {
            "filePath": "./subdir/${testFile}",
            "content": "${testContent}"
          }
        }
      ]
      </tools>
      <final_answer>文件已创建</final_answer>
    `

    await agent.process(xmlContent)

    // 验证文件在相对路径中创建
    const filePath = resolve(testDir, 'subdir', testFile)
    assert.ok(existsSync(filePath), '文件应该存在')
    assert.strictEqual(readFileSync(filePath, 'utf8'), testContent, '文件内容应该正确')

    // 清理子目录
    try {
      unlinkSync(resolve(testDir, 'subdir', testFile))
      rmdirSync(resolve(testDir, 'subdir'))
    }
    catch (error) {
      // 忽略清理错误
    }
  })

  test('应该正确列出自定义工作目录中的文件', async () => {
    const agent = new AgentExecutor({
      debug: false,
      workspaceRoot: testDir
    })

    // 列出目录中的文件
    const xmlContentList = `<user_task>列出工作目录中的文件</user_task><tools>[{"id":"1","name":"list_file","parameters":{"workspacePath":"."}}]</tools><final_answer>已列出工作目录中的文件</final_answer>`

    const results = await agent.process(xmlContentList)

    // 验证结果数组存在且不为空
    assert.ok(Array.isArray(results), '返回结果应该是一个数组')
    assert.ok(results.length > 0, '返回结果数组不应该为空')

    // 获取第一个工具的结果
    const result = results[0]
    assert.ok(result, '应该有工具执行结果')
    assert.strictEqual(result.id, '1', '工具ID应该匹配')

    // 验证结果包含我们创建的文件，格式为 [file1, file2, ...]
    assert.ok(result.result.includes(testFile), `结果应该包含文件: ${testFile}`)
    assert.ok(result.result.includes('another-file.txt'), '结果应该包含文件: another-file.txt')

    // 验证返回的是有效的数组格式字符串
    try {
      // 移除方括号并分割成数组
      const fileListStr = result.result.substring(1, result.result.length - 1)
      const fileList = fileListStr ? fileListStr.split(',').map(f => f.trim().replace(/^"(.*)"$/, '$1')) : []

      assert.ok(Array.isArray(fileList), '返回结果应该可以解析为数组')
      assert.ok(fileList.includes(testFile), `数组应该包含文件: ${testFile}`)
      assert.ok(fileList.includes('another-file.txt'), '数组应该包含文件: another-file.txt')
    }
    catch (error) {
      assert.fail(`返回结果应该是一个有效的数组格式字符串: ${error.message}`)
    }
  })
})