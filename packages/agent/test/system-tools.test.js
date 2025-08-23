// @ts-check

/**
 * 系统工具测试文件
 * 使用 Node.js 内置测试运行器
 */

import { test, describe, beforeEach, afterEach } from 'node:test'
import { strict as assert } from 'node:assert'

// 从构建后的代码导入
import { SystemTools } from '../dist/index.js'

describe('系统工具测试', () => {
  const systemTools = new SystemTools()
  const testEnvVar = 'TEST_ENV_VARIABLE'
  const testEnvValue = 'test_value_123'

  beforeEach(() => {
    // 清理测试环境变量
    delete process.env[testEnvVar]
  })

  afterEach(() => {
    // 清理测试环境变量
    delete process.env[testEnvVar]
  })

  test('应该能够获取系统信息', async () => {
    const result = await systemTools.getSystemInfo()
    const systemInfo = JSON.parse(result)

    // 验证系统信息的基本结构
    assert.ok(systemInfo.platform, '平台信息应该存在')
    assert.ok(systemInfo.arch, '架构信息应该存在')
    assert.ok(systemInfo.nodeVersion, 'Node.js 版本信息应该存在')
    assert.ok(systemInfo.cwd, '当前工作目录应该存在')
    assert.ok(typeof systemInfo.uptime === 'number', '运行时间应该是数字')

    // 验证内存信息
    assert.ok(systemInfo.memory, '内存信息应该存在')
    assert.ok(typeof systemInfo.memory.total === 'number', '总内存应该是数字')
    assert.ok(typeof systemInfo.memory.free === 'number', '空闲内存应该是数字')
    assert.ok(typeof systemInfo.memory.used === 'number', '已用内存应该是数字')
    assert.ok(systemInfo.memory.total > 0, '总内存应该大于0')
    assert.ok(systemInfo.memory.free >= 0, '空闲内存应该大于等于0')
    assert.ok(systemInfo.memory.used >= 0, '已用内存应该大于等于0')
    assert.ok(systemInfo.memory.total >= systemInfo.memory.used, '总内存应该大于等于已用内存')
    assert.ok(systemInfo.memory.total >= systemInfo.memory.free, '总内存应该大于等于空闲内存')
  })

  test('系统信息应该包含有效的平台信息', async () => {
    const result = await systemTools.getSystemInfo()
    const systemInfo = JSON.parse(result)

    const validPlatforms = ['win32', 'darwin', 'linux', 'freebsd', 'openbsd', 'sunos', 'aix', 'android']
    assert.ok(validPlatforms.includes(systemInfo.platform), `平台 ${systemInfo.platform} 应该是有效平台`)
  })

  test('系统信息应该包含有效的架构信息', async () => {
    const result = await systemTools.getSystemInfo()
    const systemInfo = JSON.parse(result)

    const validArchs = ['arm', 'arm64', 'ia32', 'mips', 'mipsel', 'ppc', 'ppc64', 's390', 's390x', 'x32', 'x64']
    assert.ok(validArchs.includes(systemInfo.arch), `架构 ${systemInfo.arch} 应该是有效架构`)
  })

  test('应该能够获取存在的环境变量', async () => {
    // 设置测试环境变量
    process.env[testEnvVar] = testEnvValue

    const result = await systemTools.getEnvVariable(testEnvVar)
    assert.ok(result.includes(`环境变量 ${testEnvVar} = ${testEnvValue}`), '应该返回正确的环境变量值')
  })

  test('获取不存在的环境变量应该返回错误信息', async () => {
    const result = await systemTools.getEnvVariable('NON_EXISTENT_ENV_VAR')
    assert.ok(result.includes('环境变量 NON_EXISTENT_ENV_VAR 不存在'), '应该返回不存在的信息')
  })

  test('应该能够设置环境变量', async () => {
    const result = await systemTools.setEnvVariable(testEnvVar, testEnvValue)
    assert.ok(result.includes(`成功设置环境变量: ${testEnvVar} = ${testEnvValue}`), '应该返回成功消息')

    // 验证环境变量是否真的被设置
    assert.strictEqual(process.env[testEnvVar], testEnvValue, '环境变量应该被正确设置')
  })

  test('应该能够覆盖已存在的环境变量', async () => {
    // 先设置一个值
    process.env[testEnvVar] = 'old_value'

    const result = await systemTools.setEnvVariable(testEnvVar, testEnvValue)
    assert.ok(result.includes(`成功设置环境变量: ${testEnvVar} = ${testEnvValue}`), '应该返回成功消息')

    // 验证环境变量是否被覆盖
    assert.strictEqual(process.env[testEnvVar], testEnvValue, '环境变量应该被正确覆盖')
  })

  test('应该能够设置空字符串环境变量', async () => {
    const result = await systemTools.setEnvVariable(testEnvVar, '')
    assert.ok(result.includes(`成功设置环境变量: ${testEnvVar} = `), '应该返回成功消息')

    // 验证环境变量是否被设置为空字符串
    assert.strictEqual(process.env[testEnvVar], '', '环境变量应该被设置为空字符串')
  })

  test('应该能够设置包含特殊字符的环境变量', async () => {
    const specialValue = 'test@#$%^&*()_+-=[]{}|;:,.<>?'
    const result = await systemTools.setEnvVariable(testEnvVar, specialValue)
    assert.ok(result.includes(`成功设置环境变量: ${testEnvVar} = ${specialValue}`), '应该返回成功消息')

    // 验证环境变量是否被正确设置
    assert.strictEqual(process.env[testEnvVar], specialValue, '包含特殊字符的环境变量应该被正确设置')
  })

  test('应该能够设置包含空格的环境变量', async () => {
    const spaceValue = 'test value with spaces'
    const result = await systemTools.setEnvVariable(testEnvVar, spaceValue)
    assert.ok(result.includes(`成功设置环境变量: ${testEnvVar} = ${spaceValue}`), '应该返回成功消息')

    // 验证环境变量是否被正确设置
    assert.strictEqual(process.env[testEnvVar], spaceValue, '包含空格的环境变量应该被正确设置')
  })

  test('应该能够设置包含换行符的环境变量', async () => {
    const multilineValue = 'line1\nline2\nline3'
    const result = await systemTools.setEnvVariable(testEnvVar, multilineValue)
    assert.ok(result.includes(`成功设置环境变量: ${testEnvVar} = ${multilineValue}`), '应该返回成功消息')

    // 验证环境变量是否被正确设置
    assert.strictEqual(process.env[testEnvVar], multilineValue, '包含换行符的环境变量应该被正确设置')
  })

  test('系统信息的内存使用应该合理', async () => {
    const result = await systemTools.getSystemInfo()
    const systemInfo = JSON.parse(result)

    // 验证内存使用的合理性
    const { total, free, used } = systemInfo.memory

    // 总内存应该等于已用内存加空闲内存（允许小的舍入误差）
    const memorySum = free + used
    const difference = Math.abs(total - memorySum)
    const tolerance = total * 0.01 // 允许1%的误差

    assert.ok(difference <= tolerance, `内存总和应该接近总内存，差异: ${difference}, 总内存: ${total}`)
  })

  test('系统运行时间应该是正数', async () => {
    const result = await systemTools.getSystemInfo()
    const systemInfo = JSON.parse(result)

    assert.ok(systemInfo.uptime >= 0, '系统运行时间应该是非负数')
  })

  test('当前工作目录应该是绝对路径', async () => {
    const result = await systemTools.getSystemInfo()
    const systemInfo = JSON.parse(result)

    assert.ok(systemInfo.cwd.startsWith('/') || systemInfo.cwd.match(/^[A-Z]:\\/), '当前工作目录应该是绝对路径')
  })
})