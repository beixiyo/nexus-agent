// @ts-check

/**
 * 内容处理工具测试文件
 * 使用 Node.js 内置测试运行器
 */

import { test, describe, afterEach } from 'node:test'
import { strict as assert } from 'node:assert'
import { existsSync, unlinkSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// 从构建后的代码导入
import { ContentTools } from '../dist/index.js'

describe('内容处理工具测试', () => {
  const testFile = 'test-content.txt'
  const initialContent = 'Hello, this is initial content!'
  const contentTools = new ContentTools()

  afterEach(() => {
    // 清理测试文件
    const fullPath = resolve(process.cwd?.(), testFile)
    if (existsSync(fullPath)) {
      unlinkSync(fullPath)
    }
  })

  test('应该能够追加内容到文件', async () => {
    // 先创建文件
    const { writeFileSync } = await import('node:fs')
    writeFileSync(testFile, initialContent, 'utf8')

    const appendContent = '\nThis is appended content!'
    const result = await contentTools.appendFile(testFile, appendContent)

    assert.ok(result.includes('成功追加内容到文件'), '应该返回成功消息')

    const fullPath = resolve(process.cwd?.(), testFile)
    const finalContent = readFileSync(fullPath, 'utf8')
    assert.strictEqual(finalContent, initialContent + appendContent, '文件内容应该正确追加')
  })

  test('追加到不存在的文件应该返回错误信息', async () => {
    const result = await contentTools.appendFile('non-existent-file.txt', 'content')
    assert.ok(result.includes('追加失败'), '应该返回错误信息')
  })

  test('应该能够在文件开头插入内容', async () => {
    // 先创建文件
    const { writeFileSync } = await import('node:fs')
    writeFileSync(testFile, initialContent, 'utf8')

    const insertContent = 'Inserted at beginning: '
    const result = await contentTools.insertFileContent(testFile, 0, insertContent)

    assert.ok(result.includes('成功在位置 0 插入内容到文件'), '应该返回成功消息')

    const fullPath = resolve(process.cwd?.(), testFile)
    const finalContent = readFileSync(fullPath, 'utf8')
    assert.strictEqual(finalContent, insertContent + initialContent, '内容应该插入到开头')
  })

  test('应该能够在文件中间插入内容', async () => {
    // 先创建文件
    const { writeFileSync } = await import('node:fs')
    writeFileSync(testFile, initialContent, 'utf8')

    const insertContent = ' [inserted] '
    const insertPosition = 6 // 在 "Hello," 之后插入
    const result = await contentTools.insertFileContent(testFile, insertPosition, insertContent)

    assert.ok(result.includes(`成功在位置 ${insertPosition} 插入内容到文件`), '应该返回成功消息')

    const fullPath = resolve(process.cwd?.(), testFile)
    const finalContent = readFileSync(fullPath, 'utf8')
    const expectedContent = initialContent.slice(0, insertPosition) + insertContent + initialContent.slice(insertPosition)
    assert.strictEqual(finalContent, expectedContent, '内容应该插入到指定位置')
  })

  test('应该能够在文件末尾插入内容', async () => {
    // 先创建文件
    const { writeFileSync } = await import('node:fs')
    writeFileSync(testFile, initialContent, 'utf8')

    const insertContent = ' [end]'
    const insertPosition = initialContent.length
    const result = await contentTools.insertFileContent(testFile, insertPosition, insertContent)

    assert.ok(result.includes(`成功在位置 ${insertPosition} 插入内容到文件`), '应该返回成功消息')

    const fullPath = resolve(process.cwd?.(), testFile)
    const finalContent = readFileSync(fullPath, 'utf8')
    assert.strictEqual(finalContent, initialContent + insertContent, '内容应该插入到末尾')
  })

  test('插入到不存在的文件应该返回错误信息', async () => {
    const result = await contentTools.insertFileContent('non-existent-file.txt', 0, 'content')
    assert.ok(result.includes('插入失败'), '应该返回错误信息')
  })

  test('插入位置超出文件长度应该返回错误信息', async () => {
    // 先创建文件
    const { writeFileSync } = await import('node:fs')
    writeFileSync(testFile, initialContent, 'utf8')

    const result = await contentTools.insertFileContent(testFile, 1000, 'content')
    assert.ok(result.includes('插入失败'), '应该返回错误信息')
    assert.ok(result.includes('位置 1000 超出文件内容范围'), '应该包含位置信息')
  })

  test('插入位置为负数应该返回错误信息', async () => {
    // 先创建文件
    const { writeFileSync } = await import('node:fs')
    writeFileSync(testFile, initialContent, 'utf8')

    const result = await contentTools.insertFileContent(testFile, -1, 'content')
    assert.ok(result.includes('插入失败'), '应该返回错误信息')
    assert.ok(result.includes('位置 -1 超出文件内容范围'), '应该包含位置信息')
  })

  test('应该能够处理空内容插入', async () => {
    // 先创建文件
    const { writeFileSync } = await import('node:fs')
    writeFileSync(testFile, initialContent, 'utf8')

    const result = await contentTools.insertFileContent(testFile, 0, '')

    assert.ok(result.includes('成功在位置 0 插入内容到文件'), '应该返回成功消息')

    const fullPath = resolve(process.cwd?.(), testFile)
    const finalContent = readFileSync(fullPath, 'utf8')
    assert.strictEqual(finalContent, initialContent, '空内容插入不应该改变文件内容')
  })

  test('应该能够处理空内容追加', async () => {
    // 先创建文件
    const { writeFileSync } = await import('node:fs')
    writeFileSync(testFile, initialContent, 'utf8')

    const result = await contentTools.appendFile(testFile, '')

    assert.ok(result.includes('成功追加内容到文件'), '应该返回成功消息')

    const fullPath = resolve(process.cwd?.(), testFile)
    const finalContent = readFileSync(fullPath, 'utf8')
    assert.strictEqual(finalContent, initialContent, '空内容追加不应该改变文件内容')
  })

  test('应该能够替换文件内容', async () => {
    // 先创建文件
    const { writeFileSync } = await import('node:fs')
    writeFileSync(testFile, initialContent, 'utf8')

    const oldContent = 'Hello'
    const newContent = 'Hi'
    const result = await contentTools.replaceFileContent(testFile, oldContent, newContent)

    assert.ok(result.includes('成功替换文件内容'), '应该返回成功消息')

    const fullPath = resolve(process.cwd?.(), testFile)
    const updatedContent = readFileSync(fullPath, 'utf8')
    assert.ok(updatedContent.includes(newContent), '文件应该包含新内容')
    assert.ok(!updatedContent.includes(oldContent), '文件不应该包含旧内容')
  })

  test('替换不存在的文件内容应该返回错误信息', async () => {
    // 先创建文件
    const { writeFileSync } = await import('node:fs')
    writeFileSync(testFile, initialContent, 'utf8')

    const result = await contentTools.replaceFileContent(testFile, '不存在的内容', '新内容')
    assert.ok(result.includes('替换失败'), '应该返回错误信息')
    assert.ok(result.includes('文件中未找到指定的旧内容'), '应该提示未找到旧内容')
  })

  test('替换不存在的文件应该返回错误信息', async () => {
    const result = await contentTools.replaceFileContent('non-existent-file.txt', 'old', 'new')
    assert.ok(result.includes('替换文件内容失败'), '应该返回错误信息')
  })

  test('应该能够处理空内容替换', async () => {
    // 先创建文件
    const { writeFileSync } = await import('node:fs')
    writeFileSync(testFile, initialContent, 'utf8')

    const result = await contentTools.replaceFileContent(testFile, 'Hello', '')

    assert.ok(result.includes('成功替换文件内容'), '应该返回成功消息')

    const fullPath = resolve(process.cwd?.(), testFile)
    const updatedContent = readFileSync(fullPath, 'utf8')
    assert.ok(!updatedContent.includes('Hello'), '空内容替换应该移除旧内容')
  })
})