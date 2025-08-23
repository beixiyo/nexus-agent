// @ts-check

/**
 * 网络工具测试文件
 * 使用 Node.js 内置测试运行器
 */

import { test, describe } from 'node:test'
import { strict as assert } from 'node:assert'

// 从构建后的代码导入
import { WebTools } from '../dist/index.js'

describe('网络工具测试', () => {
  const webTools = new WebTools()

  test('应该能够执行基本的网络搜索', async () => {
    const query = 'JavaScript'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理空查询', async () => {
    const result = await webTools.searchWeb('')

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes('""'), '结果应该包含空查询字符串')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含空格的查询', async () => {
    const query = 'JavaScript tutorial'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含特殊字符的查询', async () => {
    const query = 'JavaScript & TypeScript @ 2024'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含中文的查询', async () => {
    const query = 'JavaScript 教程'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含数字的查询', async () => {
    const query = 'JavaScript 2024 tutorial'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含标点符号的查询', async () => {
    const query = 'JavaScript: The Good Parts'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含换行符的查询', async () => {
    const query = 'JavaScript\nTypeScript'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含引号的查询', async () => {
    const query = '"JavaScript tutorial"'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含反斜杠的查询', async () => {
    const query = 'JavaScript\\TypeScript'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含制表符的查询', async () => {
    const query = 'JavaScript\tTypeScript'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含 Unicode 字符的查询', async () => {
    const query = 'JavaScript 🚀 TypeScript'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含 HTML 标签的查询', async () => {
    const query = 'JavaScript <script> tag'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含 SQL 注入尝试的查询', async () => {
    const query = "'; DROP TABLE users; --"
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含 XSS 尝试的查询', async () => {
    const query = '<script>alert("XSS")</script>'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含路径遍历尝试的查询', async () => {
    const query = '../../../etc/passwd'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含命令注入尝试的查询', async () => {
    const query = 'test; rm -rf /'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含正则表达式的查询', async () => {
    const query = 'JavaScript /^[a-z]+$/ regex'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含 JSON 的查询', async () => {
    const query = '{"name": "JavaScript", "type": "language"}'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含 Base64 编码的查询', async () => {
    const query = 'SmF2YVNjcmlwdA=='
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含 URL 编码的查询', async () => {
    const query = 'JavaScript%20Tutorial'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含十六进制编码的查询', async () => {
    const query = '4A617661536372697074'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含二进制数据的查询', async () => {
    const query = 'JavaScript\x00\x01\x02\x03'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含超长查询', async () => {
    const query = 'a'.repeat(1000)
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })

  test('应该能够处理包含 null 字符的查询', async () => {
    const query = 'JavaScript\0TypeScript'
    const result = await webTools.searchWeb(query)

    assert.ok(result.includes('搜索'), '结果应该包含搜索关键词')
    assert.ok(result.includes(query), '结果应该包含完整查询内容')
    assert.ok(result.includes('模拟的搜索结果'), '结果应该包含模拟搜索结果标识')
  })
})