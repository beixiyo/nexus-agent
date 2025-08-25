# @jl-org/nexus-agent

一个解析 LLM XML 输出并执行工具调用的 Agent 系统

## 📦 安装

```bash
# 使用 npm
npm install @jl-org/nexus-agent

# 使用 yarn
yarn add @jl-org/nexus-agent

# 使用 pnpm
pnpm add @jl-org/nexus-agent

# 全局安装（推荐，可以直接使用 CLI 工具）
npm install -g @jl-org/nexus-agent
```

## 🚀 快速开始

### 作为 CLI 工具使用

本包提供了两个 CLI 工具，安装后可以直接在命令行中使用：

#### `nexus-agent` - HTTP 服务器

启动一个 HTTP 服务器，提供 REST API 接口来处理 LLM XML 输出。

```bash
# 基本用法
nexus-agent [工作目录路径，默认当前目录]

# 示例
nexus-agent
nexus-agent /path/to/workspace
```

**参数说明：**
- `工作目录路径`：可选的工作目录，默认为当前目录

**选项说明：**
- `-p, --port`：设置服务器端口（默认: 3000）

**API 接口：**

1. **处理 XML 内容**

  ```bash
  POST /api/agent/process
  Content-Type: application/json

  {
    "xmlContent": "<user_task>创建文件</user_task><tools>[{\"id\":\"1\",\"name\":\"write_file\",\"parameters\":{\"filePath\":\"test.txt\",\"content\":\"Hello\"}}]</tools>"
  }
  ```

2. **获取 Agent 信息**

   ```bash
   GET /api/agent/info
   ```

3. **健康检查**

   ```bash
   GET /api/health
   ```

#### `jl-agent` - XML 文件处理工具

用于处理包含 LLM XML 输出的文件，自动执行工具调用并返回结果。

```bash
# 基本用法
jl-agent <xml文件路径> [工作目录路径]

# 示例
jl-agent response.xml
jl-agent response.xml /path/to/workspace
```

**参数说明：**
- `xml文件路径`：包含 LLM XML 输出的文件路径（必需）
- `工作目录路径`：可选的工作目录，默认为当前目录

**示例文件 `response.xml`：**
```xml
<user_task>创建一个测试文件</user_task>
<thinking>我需要创建一个文件来测试功能</thinking>
<tools>[{"id":"1","name":"write_file","parameters":{"filePath":"test.txt","content":"Hello World"}}]</tools>
```

**使用示例：**
```bash
# 处理 XML 文件
jl-agent response.xml

# 指定工作目录
jl-agent response.xml /Users/username/projects/my-project
```

### 作为库使用

```typescript
import { AgentExecutor } from '@jl-org/nexus-agent'

const agent = new AgentExecutor({
  debug: true,
  workspaceRoot: '/path/to/your/workspace'
})

const result = await agent.process(xmlContent)
console.log(result)
```

## 🔧 配置选项

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `PORT` | 服务器端口 | `3000` |
| `WORKSPACE_ROOT` | 工作目录路径 | `process.cwd()` |

## 🛠️ 支持的工具

### 文件操作工具

| 工具名称 | 功能描述 | 参数 |
|----------|----------|------|
| `read_file` | 读取文件内容 | `filePath`: 文件路径 |
| `write_file` | 写入文件内容 | `filePath`: 文件路径, `content`: 文件内容 |
| `list_file` | 列出目录文件 | `workspacePath`: 目录路径 |
| `delete_file` | 删除文件 | `filePath`: 要删除的文件路径 |
| `copy_file` | 复制文件 | `sourcePath`: 源文件路径, `targetPath`: 目标文件路径 |
| `move_file` | 移动文件 | `sourcePath`: 源文件路径, `targetPath`: 目标文件路径 |
| `create_directory` | 创建目录 | `dirPath`: 要创建的目录路径 |
| `delete_directory` | 删除目录 | `dirPath`: 要删除的目录路径, `recursive`: 是否递归删除 |
| `get_file_info` | 获取文件信息 | `filePath`: 文件路径 |

### 文件内容处理工具

| 工具名称 | 功能描述 | 参数 |
|----------|----------|------|
| `replace_file_content` | 替换文件内容 | `filePath`: 文件路径, `oldContent`: 旧内容, `newContent`: 新内容 |
| `append_file` | 追加内容到文件 | `filePath`: 文件路径, `content`: 要追加的内容 |
| `insert_file_content` | 在指定位置插入内容 | `filePath`: 文件路径, `position`: 插入位置, `content`: 要插入的内容 |

### 系统信息工具

| 工具名称 | 功能描述 | 参数 |
|----------|----------|------|
| `get_system_info` | 获取系统信息 | 无 |
| `get_env_variable` | 获取环境变量 | `name`: 环境变量名称 |
| `set_env_variable` | 设置环境变量 | `name`: 环境变量名称, `value`: 环境变量值 |

### 网络和命令工具

| 工具名称 | 功能描述 | 参数 |
|----------|----------|------|
| `search_web` | 网络搜索 | `query`: 搜索查询 |
| `run_command` | 执行系统命令 | `command`: 要执行的命令 |

## 🔒 安全特性

- **路径安全检查**：所有文件操作都限制在工作目录内
- **权限控制**：支持细粒度的工具权限管理

## 🧪 测试

```bash
# 运行所有测试
pnpm test
```
