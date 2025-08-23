// @ts-check

/**
 * 文件操作工具测试文件
 * 使用 Node.js 内置测试运行器
 */

import { test, describe, afterEach } from 'node:test'
import { strict as assert } from 'node:assert'
import { existsSync, unlinkSync, rmdirSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

// 从构建后的代码导入
import { FileTools } from '../dist/index.js'

describe('文件操作工具测试', () => {
  const testDir = 'test-files'
  const testFile = `${testDir}/test.txt`
  const testContent = 'Hello, this is a test file!'
  const fileTools = new FileTools()

  // 递归删除目录的辅助函数
  function removeDirectoryRecursive(dirPath) {
    if (existsSync(dirPath)) {
      const files = readdirSync(dirPath)
      for (const file of files) {
        const fullPath = resolve(dirPath, file)
        const stats = statSync(fullPath)
        if (stats.isDirectory()) {
          removeDirectoryRecursive(fullPath)
        } else {
          unlinkSync(fullPath)
        }
      }
      rmdirSync(dirPath)
    }
  }

  afterEach(() => {
    // 清理测试文件和目录
    const fullTestFile = resolve(process.cwd(), testFile)
    const fullTestDir = resolve(process.cwd(), testDir)

    if (existsSync(fullTestFile)) {
      unlinkSync(fullTestFile)
    }

    if (existsSync(fullTestDir)) {
      removeDirectoryRecursive(fullTestDir)
    }
  })

  test('应该能够写入文件并创建目录', async () => {
    const result = await fileTools.writeFile(testFile, testContent)

    assert.ok(result.includes('成功写入文件'), '应该返回成功消息')

    const fullPath = resolve(process.cwd(), testFile)
    assert.ok(existsSync(fullPath), '文件应该被创建')

    const content = readFileSync(fullPath, 'utf8')
    assert.strictEqual(content, testContent, '文件内容应该正确')
  })

  test('应该能够读取文件内容', async () => {
    // 先创建文件
    await fileTools.writeFile(testFile, testContent)

    const result = await fileTools.readFile(testFile)
    assert.strictEqual(result, testContent, '读取的内容应该正确')
  })

  test('读取不存在的文件应该返回错误信息', async () => {
    const result = await fileTools.readFile('non-existent-file.txt')
    assert.ok(result.includes('读取文件失败'), '应该返回错误信息')
  })

  test('应该能够列出目录文件', async () => {
    // 先创建测试目录和文件
    await fileTools.writeFile(testFile, testContent)

    const result = await fileTools.listFile(testDir)
    assert.ok(result.includes('test.txt'), '应该包含文件名')
  })



  test('应该能够删除文件', async () => {
    // 先创建文件
    await fileTools.writeFile(testFile, testContent)

    const result = await fileTools.deleteFile(testFile)
    assert.ok(result.includes('成功删除文件'), '应该返回成功消息')

    const fullPath = resolve(process.cwd(), testFile)
    assert.ok(!existsSync(fullPath), '文件应该被删除')
  })

  test('删除不存在的文件应该返回错误信息', async () => {
    const result = await fileTools.deleteFile('non-existent-file.txt')
    assert.ok(result.includes('删除失败'), '应该返回错误信息')
  })

  test('应该能够复制文件', async () => {
    // 先创建源文件
    await fileTools.writeFile(testFile, testContent)

    const targetFile = `${testDir}/copied.txt`
    const result = await fileTools.copyFile(testFile, targetFile)

    assert.ok(result.includes('成功复制文件'), '应该返回成功消息')

    const targetPath = resolve(process.cwd(), targetFile)
    assert.ok(existsSync(targetPath), '目标文件应该存在')

    const copiedContent = readFileSync(targetPath, 'utf8')
    assert.strictEqual(copiedContent, testContent, '复制的内容应该正确')
  })

  test('复制不存在的文件应该返回错误信息', async () => {
    const result = await fileTools.copyFile('non-existent.txt', 'target.txt')
    assert.ok(result.includes('复制失败'), '应该返回错误信息')
  })

  test('应该能够移动文件', async () => {
    // 先创建源文件
    await fileTools.writeFile(testFile, testContent)

    const targetFile = `${testDir}/moved.txt`
    const result = await fileTools.moveFile(testFile, targetFile)

    assert.ok(result.includes('成功移动文件'), '应该返回成功消息')

    const sourcePath = resolve(process.cwd(), testFile)
    const targetPath = resolve(process.cwd(), targetFile)

    assert.ok(!existsSync(sourcePath), '源文件应该不存在')
    assert.ok(existsSync(targetPath), '目标文件应该存在')

    const movedContent = readFileSync(targetPath, 'utf8')
    assert.strictEqual(movedContent, testContent, '移动的内容应该正确')
  })

  test('应该能够创建目录', async () => {
    const result = await fileTools.createDirectory(testDir)
    assert.ok(result.includes('成功创建目录'), '应该返回成功消息')

    const fullPath = resolve(process.cwd(), testDir)
    assert.ok(existsSync(fullPath), '目录应该被创建')
  })

  test('创建已存在的目录应该返回错误信息', async () => {
    // 先创建目录
    await fileTools.createDirectory(testDir)

    const result = await fileTools.createDirectory(testDir)
    assert.ok(result.includes('创建失败'), '应该返回错误信息')
  })

  test('应该能够删除空目录', async () => {
    // 先创建目录
    await fileTools.createDirectory(testDir)

    const result = await fileTools.deleteDirectory(testDir)
    assert.ok(result.includes('成功删除目录'), '应该返回成功消息')

    const fullPath = resolve(process.cwd(), testDir)
    assert.ok(!existsSync(fullPath), '目录应该被删除')
  })

  test('删除不存在的目录应该返回错误信息', async () => {
    const result = await fileTools.deleteDirectory('non-existent-dir')
    assert.ok(result.includes('删除失败'), '应该返回错误信息')
  })

  test('应该能够获取文件信息', async () => {
    // 先创建文件
    await fileTools.writeFile(testFile, testContent)

    const result = await fileTools.getFileInfo(testFile)
    const fileInfo = JSON.parse(result)

    assert.strictEqual(fileInfo.name, 'test.txt', '文件名应该正确')
    assert.strictEqual(fileInfo.isFile, true, '应该标识为文件')
    assert.strictEqual(fileInfo.isDirectory, false, '不应该标识为目录')
    assert.ok(fileInfo.size > 0, '文件大小应该大于0')
    assert.ok(fileInfo.path, '文件路径应该存在')
    assert.ok(fileInfo.createdTime, '创建时间应该存在')
    assert.ok(fileInfo.modifiedTime, '修改时间应该存在')
    assert.ok(fileInfo.permissions, '权限信息应该存在')
  })

  test('获取不存在的文件信息应该返回错误信息', async () => {
    const result = await fileTools.getFileInfo('non-existent-file.txt')
    assert.ok(result.includes('获取失败'), '应该返回错误信息')
  })
})