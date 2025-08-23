# LLM Agent 服务器

这是一个基于 Hono 的模块化服务器，将 AI/Agent 的功能通过 REST API 暴露出来。

## 功能特性

- **模块化设计**: 清晰的路由结构，易于维护和扩展
- **自动化工具执行**: Agent 自动解析 XML 并执行所有工具调用
- **错误处理**: 统一的错误处理机制
- **API 文档**: 内置详细的 API 文档
- **类型安全**: 完整的 TypeScript 类型支持

## API 接口

### 健康检查

```bash
GET /health
```

### Agent 相关接口

#### 处理 LLM XML 输出

```bash
POST /api/agent/process
```

**请求体**:
```json
{
  "xmlContent": "<user_task>创建一个文件</user_task><thinking>我需要创建一个文件</thinking><tools>[{\"id\":\"1\",\"name\":\"write_file\",\"parameters\":{\"filePath\":\"test.txt\",\"content\":\"Hello World\"}}]</tools>"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "result": "文件已创建",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 获取 Agent 信息

```bash
GET /api/agent/info
```

**响应**:
```json
{
  "success": true,
  "data": {
    "workspaceRoot": "/path/to/workspace",
    "supportedTools": [ ... ]
  }
}
```

## 使用示例

### 使用 curl 测试

#### 处理 XML 并自动执行工具

```bash
curl -X POST http://localhost:3000/api/agent/process \
  -H "Content-Type: application/json" \
  -d '{
    "xmlContent": "<user_task>创建一个测试文件</user_task><thinking>我需要创建一个文件</thinking><tools>[{\"id\":\"1\",\"name\":\"write_file\",\"parameters\":{\"filePath\":\"test.txt\",\"content\":\"这是一个测试文件\"}}]</tools>"
  }'
```

### 使用 JavaScript/TypeScript

```typescript
/** 处理 XML 并自动执行工具 */
const response = await fetch('http://localhost:3000/api/agent/process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    xmlContent: '<user_task>创建一个文件</user_task><thinking>我需要创建一个文件</thinking><tools>[{"id":"1","name":"write_file","parameters":{"filePath":"test.txt","content":"Hello World"}}]</tools>'
  })
})

const result = await response.json()
console.log(result.data.result)

/** 获取 Agent 信息 */
const infoResponse = await fetch('http://localhost:3000/api/agent/info')
const info = await infoResponse.json()
console.log(info.data.supportedTools)
```

## 项目结构

```
src/server/
├── index.ts              # 服务器入口
├── config/
│   └── index.ts         # 服务器配置
├── middleware/
│   └── errorHandler.ts   # 错误处理中间件
└── routes/
    └── agent.ts          # Agent 相关路由
```

## 配置

### 环境变量

- `PORT`: 服务器端口，默认为 3000

### 工作目录

默认使用当前工作目录作为工作空间根目录，可以通过 Agent 选项或环境变量进行配置。

## 错误处理

所有接口都使用统一的错误处理格式：

```json
{
  "success": false,
  "error": "错误信息",
  "stack": "错误堆栈（仅在开发环境）"
}
```

## 工作原理

1. **接收 XML**: 服务器接收来自 LLM 的结构化 XML 输出
2. **解析响应**: 自动解析 XML 中的工具调用信息
3. **执行工具**: 根据 XML 中的工具定义自动执行相应的操作
4. **返回结果**: 返回最终的处理结果

Agent 支持的所有工具操作都在服务端自动处理，客户端只需要发送 XML 格式的请求即可。

## 开发

### 添加新路由

1. 在 `src/server/routes/` 目录下创建新的路由文件
2. 在 `src/server/index.ts` 中注册路由
3. 更新相关文档
