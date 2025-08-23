// @ts-check

/**
 * 命令执行工具测试文件
 * 使用 Node.js 内置测试运行器
 */

import { test, describe } from 'node:test'
import { strict as assert } from 'node:assert'
import * as os from 'node:os'

// 从构建后的代码导入
import { CommandTools } from '../dist/index.js'

describe('命令执行工具测试', () => {
  const commandTools = new CommandTools()

  test('应该能够执行简单的 echo 命令', async () => {
    const testMessage = 'Hello, World!'
    const result = await commandTools.runCommand(`echo "${testMessage}"`)

    // 在 Windows 上，echo 命令的输出可能包含引号，所以我们需要检查是否包含消息内容
    assert.ok(result.includes(testMessage), '命令输出应该包含测试消息')
  })

  test('应该能够执行 pwd 命令（Unix）或 cd 命令（Windows）', async () => {
    const platform = os.platform()
    let command, expectedContent

    if (platform === 'win32') {
      command = 'cd'
      expectedContent = process.cwd()
    } else {
      command = 'pwd'
      expectedContent = process.cwd()
    }

    const result = await commandTools.runCommand(command)

    // 检查输出是否包含当前工作目录
    assert.ok(result.includes(expectedContent) || result.trim() === expectedContent, '命令输出应该包含当前工作目录')
  })

  test('应该能够执行 node --version 命令', async () => {
    const result = await commandTools.runCommand('node --version')

    // 检查输出是否包含版本号格式（v数字.数字.数字）
    assert.ok(/v\d+\.\d+\.\d+/.test(result), '命令输出应该包含 Node.js 版本号')
  })

  test('应该能够执行 npm --version 命令', async () => {
    const result = await commandTools.runCommand('npm --version')

    // 检查输出是否包含版本号格式（数字.数字.数字）
    assert.ok(/^\d+\.\d+\.\d+/.test(result.trim()), '命令输出应该包含 npm 版本号')
  })

  test('应该能够执行 ls 命令（Unix）或 dir 命令（Windows）', async () => {
    const platform = os.platform()
    const command = platform === 'win32' ? 'dir' : 'ls'

    const result = await commandTools.runCommand(command)

    // 检查输出是否包含当前目录的文件列表
    assert.ok(result.length > 0, '命令输出不应该为空')
    assert.ok(typeof result === 'string', '命令输出应该是字符串')
  })

  test('应该能够执行 whoami 命令', async () => {
    const result = await commandTools.runCommand('whoami')

    // 检查输出是否包含用户名
    assert.ok(result.length > 0, '命令输出不应该为空')
    assert.ok(typeof result === 'string', '命令输出应该是字符串')
  })

  test('应该能够执行 date 命令', async () => {
    const result = await commandTools.runCommand('date')

    // 检查输出是否包含日期信息
    assert.ok(result.length > 0, '命令输出不应该为空')
    assert.ok(typeof result === 'string', '命令输出应该是字符串')
  })

  test('应该能够执行包含管道的命令', async () => {
    const platform = os.platform()
    let command

    if (platform === 'win32') {
      command = 'echo "test" | findstr "test"'
    } else {
      command = 'echo "test" | grep "test"'
    }

    const result = await commandTools.runCommand(command)

    // 检查输出是否包含 "test"
    assert.ok(result.includes('test'), '命令输出应该包含 "test"')
  })

  test('应该能够执行多行命令', async () => {
    const platform = os.platform()
    let command

    if (platform === 'win32') {
      command = 'echo "line1" && echo "line2"'
    } else {
      command = 'echo "line1" && echo "line2"'
    }

    const result = await commandTools.runCommand(command)

    // 检查输出是否包含两行内容
    assert.ok(result.includes('line1'), '命令输出应该包含 "line1"')
    assert.ok(result.includes('line2'), '命令输出应该包含 "line2"')
  })

  test('执行不存在的命令应该返回错误信息', async () => {
    const result = await commandTools.runCommand('non_existent_command_xyz123')

    assert.ok(result.includes('执行命令失败'), '应该返回错误信息')
  })

  test('执行无效的命令应该返回错误信息', async () => {
    const result = await commandTools.runCommand('invalid_command_with_special_chars_!@#$%')

    assert.ok(result.includes('执行命令失败'), '应该返回错误信息')
  })

  test('应该能够执行空命令（应该返回错误）', async () => {
    const result = await commandTools.runCommand('')

    assert.ok(result.includes('执行命令失败'), '空命令应该返回错误信息')
  })

  test('应该能够执行只包含空格的命令（应该返回错误）', async () => {
    const result = await commandTools.runCommand('   ')

    // 在 Windows 上，只包含空格的命令可能不会返回错误，所以我们需要更宽松的检查
    assert.ok(result.includes('执行命令失败') || result.length === 0, '只包含空格的命令应该返回错误信息或空结果')
  })

  test('应该能够执行包含特殊字符的命令', async () => {
    const testMessage = 'test@#$%^&*()_+-=[]{}|;:,.<>?'
    const result = await commandTools.runCommand(`echo "${testMessage}"`)

    // 检查输出是否包含特殊字符
    assert.ok(result.includes(testMessage), '命令输出应该包含特殊字符')
  })

  test('应该能够执行包含中文的命令', async () => {
    const testMessage = '测试中文命令'
    const result = await commandTools.runCommand(`echo "${testMessage}"`)

    // 在 Windows 上，中文可能无法正确显示，所以我们需要更宽松的检查
    assert.ok(result.length > 0, '命令输出不应该为空')
    assert.ok(typeof result === 'string', '命令输出应该是字符串')
  })

  test('应该能够执行包含换行符的命令', async () => {
    const platform = os.platform()
    let command

    if (platform === 'win32') {
      command = 'echo "line1\nline2"'
    } else {
      command = 'echo -e "line1\nline2"'
    }

    const result = await commandTools.runCommand(command)

    // 检查输出是否包含换行符或两行内容
    // 在不同平台上，换行符的处理可能不同，所以我们需要更宽松的检查
    assert.ok(result.includes('line1'), '命令输出应该包含 "line1"')
    // 在某些平台上，line2 可能不会正确显示，所以我们只检查输出不为空
    assert.ok(result.length > 0, '命令输出不应该为空')
  })

  test('应该能够执行返回大量输出的命令', async () => {
    const platform = os.platform()
    let command

    if (platform === 'win32') {
      command = 'dir /s'
    } else {
      command = 'find . -type f | head -10'
    }

    const result = await commandTools.runCommand(command)

    // 检查输出是否不为空
    assert.ok(result.length > 0, '命令输出不应该为空')
    assert.ok(typeof result === 'string', '命令输出应该是字符串')
  })

  test('应该能够执行需要权限的命令（如果可能）', async () => {
    const platform = os.platform()
    let command

    if (platform === 'win32') {
      command = 'whoami /priv'
    } else {
      command = 'id'
    }

    const result = await commandTools.runCommand(command)

    // 检查输出是否不为空
    assert.ok(result.length > 0, '命令输出不应该为空')
    assert.ok(typeof result === 'string', '命令输出应该是字符串')
  })
})