// @ts-check

/**
 * parser模块测试文件
 * 使用Node.js内置测试运行器
 */

import { test, describe } from 'node:test'
import { strict as assert } from 'node:assert'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// 由于我们测试的是构建后的代码，需要从dist目录导入
import { parseXMLResponse } from '../dist/index.js'

const filePath = fileURLToPath(import.meta.url)
const __dirname = dirname(filePath)

/** 获取天气测试 */
const xmlContent1 = readFileSync(resolve(__dirname, '../llm-example/search_weather.md'), 'utf8')

/** 多个工具调用测试 */
const xmlContent2 = readFileSync(resolve(__dirname, '../llm-example/multiple_tools.md'), 'utf8')

describe('XML解析器测试', () => {
  test('应该正确解析天气查询XML', () => {
    const result = parseXMLResponse(xmlContent1)
    assert.ok(result, '解析结果不应为null')
    assert.strictEqual(typeof result.user_task, 'string')
    assert.strictEqual(typeof result.thinking, 'string')
    assert.ok(Array.isArray(result.tools))
    assert.strictEqual(typeof result.tools_result, 'string')
    assert.strictEqual(typeof result.final_answer, 'string')
  })

  test('应该正确解析多个工具调用的XML', () => {
    const result = parseXMLResponse(xmlContent2)
    assert.ok(result, '解析结果不应为null')
    assert.ok(Array.isArray(result.tools), 'tools应该是一个数组')
    assert.ok(result.tools.length > 0, 'tools数组不应为空')
  })

  test('应该处理空内容', () => {
    const result = parseXMLResponse('')
    assert.notStrictEqual(result, {
      user_task: '',
      thinking: '',
      tools: [],
      tools_result: '',
      final_answer: ''
    })
  })
})