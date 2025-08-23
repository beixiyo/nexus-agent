# Agent 工具执行器

一个用于解析 LLM 输出的 XML 格式响应并执行工具调用的 Agent 系统。

## 功能特性

- 🔧 **工具执行**: 支持多种文件操作、系统信息获取、网络搜索等工具
- 📁 **灵活的工作目录**: 可配置工作目录根路径，默认为 `process.cwd()`
- 🚀 **高性能**: 异步执行，支持工具调用缓存
- 🛡️ **类型安全**: 完整的 TypeScript 类型定义
- 🐛 **调试支持**: 可选的调试模式

## 安装

```bash
pnpm install
```

## 使用方法

### 基本使用

```typescript
import { Agent } from './src/agent'

/** 使用默认工作目录 (process.cwd()) */
const agent = new Agent({ debug: true })

const result = await agent.process(xmlContent)
console.log(result)
```

### 配置工作目录

```typescript
import { resolve } from 'node:path'
import { Agent } from './src/agent'

/** 指定自定义工作目录 */
const agent = new Agent({
  debug: true,
  workspaceRoot: resolve('/path/to/your/workspace')
})

const result = await agent.process(xmlContent)
console.log(result)
```

### CLI 使用

```bash
# 使用默认工作目录
node cli.js response.xml

# 指定工作目录
node cli.js response.xml /path/to/workspace
```

## 配置选项

### AgentOptions

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `debug` | `boolean` | `false` | 是否启用调试模式 |
| `workspaceRoot` | `string` | `process.cwd()` | 工作目录根路径 |

## 支持的工具

### 文件操作工具

- `write_file`: 写入文件
- `read_file`: 读取文件
- `list_file`: 列出目录文件
- `delete_file`: 删除文件
- `copy_file`: 复制文件
- `move_file`: 移动文件
- `create_directory`: 创建目录
- `delete_directory`: 删除目录
- `get_file_info`: 获取文件信息

### 内容处理工具

- `replace_file_content`: 替换文件内容
- `append_file`: 追加文件内容
- `insert_file_content`: 插入文件内容

### 系统工具

- `get_system_info`: 获取系统信息
- `get_env_variable`: 获取环境变量
- `set_env_variable`: 设置环境变量

### 网络工具

- `search_web`: 网络搜索

### 命令工具

- `run_command`: 执行命令

## 工作目录配置说明

**问题**: 之前的版本中，所有文件操作都相对于 `process.cwd()` 进行，这在某些场景下不够灵活。

**解决方案**: 新增 `workspaceRoot` 配置项，允许用户指定自定义的工作目录根路径。

### 使用场景

1. **多项目环境**: 当你在不同的项目目录中工作时，可以指定特定的工作目录
2. **沙盒环境**: 为了安全考虑，限制文件操作范围
3. **相对路径处理**: 统一处理相对路径的基准点

### 示例

```typescript
/** 场景 1: 在特定项目目录中工作 */
const agent = new Agent({
  workspaceRoot: '/Users/username/projects/my-project'
})

/** 场景 2: 使用相对路径 */
const agent = new Agent({
  workspaceRoot: resolve('./workspace')
})

/** 场景 3: 使用环境变量 */
const agent = new Agent({
  workspaceRoot: process.env.WORKSPACE_ROOT || process.cwd()
})
```

## 开发

```bash
# 构建
pnpm build

# 测试
pnpm test
```
