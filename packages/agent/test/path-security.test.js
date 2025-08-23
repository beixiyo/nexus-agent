import { PathSecurityUtils } from '../dist/index.js'

// 模拟工作目录
const workspaceRoot = '/__workspace'

console.log('=== 路径安全检查测试 ===\n')

// 测试用例
const testCases = [
  {
    name: '正常相对路径',
    path: 'src/index.js',
    expected: true
  },
  {
    name: '子目录路径',
    path: 'src/components/Button.js',
    expected: true
  },
  {
    name: '当前目录',
    path: '.',
    expected: true
  },
  {
    name: '上级目录（应该失败）',
    path: '../outside.js',
    expected: false
  },
  {
    name: '多级上级目录（应该失败）',
    path: '../../../etc/passwd',
    expected: false
  },
  {
    name: '绝对路径（应该失败）',
    path: '/etc/passwd',
    expected: false
  },
  {
    name: 'Windows 绝对路径（应该失败）',
    path: 'C:\\Windows\\System32\\config\\SAM',
    expected: false
  },
  {
    name: '包含 .. 的路径（应该失败）',
    path: 'src/../../outside.js',
    expected: false
  }
]

// 运行测试
testCases.forEach((testCase, index) => {
  console.log(`测试 ${index + 1}: ${testCase.name}`)
  console.log(`路径: ${testCase.path}`)

  try {
    const result = PathSecurityUtils.checkPathSecurity(workspaceRoot, testCase.path)
    const passed = result.isSafe === testCase.expected

    console.log(`结果: ${result.isSafe ? '安全' : '不安全'}`)
    if (!result.isSafe) {
      console.log(`错误: ${result.error}`)
    }
    console.log(`测试: ${passed ? '✅ 通过' : '❌ 失败'}`)
  }
  catch (error) {
    console.log(`异常: ${error.message}`)
    console.log(`测试: ${testCase.expected === false ? '✅ 通过' : '❌ 失败'}`)
  }

  console.log('')
})

console.log('=== 测试完成 ===')