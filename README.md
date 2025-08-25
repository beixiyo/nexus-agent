# Nexus Agent

让浏览器网页控制你的电脑，跨越系统边界，免费调用 LLM 的能力

<video muted autoplay controls src="https://github.com/user-attachments/assets/17d127dd-553f-4185-8463-8f6344e36f94" title="项目功能演示"></video>

## 📖 项目简介

**Nexus Agent** 是一个创新的浏览器插件，它能够将云端大语言模型（如 ChatGPT、Gemini、DeepSeek 等）与您的本地计算机无缝连接。通过智能的 XML 格式转换和本地工具执行，让您在使用各种 LLM 服务时，能够直接操作本地文件、执行系统命令、获取网络信息等。

### 🎯 核心特性

- **🔄 跨平台 LLM 访问**: 支持 ChatGPT、Gemini、DeepSeek、通义千问等主流 LLM 平台
- **🔧 本地工具执行**: 提供文件操作、系统命令、网络搜索等 20+ 种本地工具
- **🤖 智能 XML 转换**: 自动将自然语言转换为结构化 XML 格式
- **🛡️ 安全权限管理**: 细粒度的工具权限控制和用户确认机制
- **📱 现代化 UI**: 美观的界面设计，支持深色/浅色主题切换

## 🚀 快速开始

### 环境要求

- **Node.js**: 18.0 或更高版本
- **包管理器**: pnpm（推荐）
- **浏览器**: Chrome 88+ 或基于 Chromium 的浏览器

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-repo/nexus-agent.git
   cd nexus-agent
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **启动本地服务器**
   ```bash
   pnpm serve:dev
   ```
   服务器将在 `http://localhost:3000` 启动

4. **构建浏览器插件**
   ```bash
   pnpm ext:build
   ```

5. **安装浏览器插件**
   - 打开 Chrome 浏览器
   - 访问 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `packages/chrome-ext/dist` 目录

## 📋 支持的 LLM 平台

| 平台 | 网址 | 状态 | 说明 |
|------|------|------|------|
| **通义千问** | https://www.tongyi.com/qianwen | ✅ 已适配 | 阿里云大模型平台 |
| **DeepSeek** | https://chat.deepseek.com/ | ✅ 已适配 | 深度求索大模型 |
| **AI Studio Gemini** | https://aistudio.google.com/prompts/new_chat | ✅ 已适配 | Google Gemini 平台 |

## 🛠️ 可用工具列表

### 📁 文件操作工具

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

### 📝 文件内容处理工具

| 工具名称 | 功能描述 | 参数 |
|----------|----------|------|
| `replace_file_content` | 替换文件内容 | `filePath`: 文件路径, `oldContent`: 旧内容, `newContent`: 新内容 |
| `append_file` | 追加内容到文件 | `filePath`: 文件路径, `content`: 要追加的内容 |
| `insert_file_content` | 在指定位置插入内容 | `filePath`: 文件路径, `position`: 插入位置, `content`: 要插入的内容 |

### 💻 系统信息工具

| 工具名称 | 功能描述 | 参数 |
|----------|----------|------|
| `get_system_info` | 获取系统信息 | 无 |
| `get_env_variable` | 获取环境变量 | `name`: 环境变量名称 |
| `set_env_variable` | 设置环境变量 | `name`: 环境变量名称, `value`: 环境变量值 |

### 🌐 网络和命令工具

| 工具名称 | 功能描述 | 参数 |
|----------|----------|------|
| `search_web` | 执行网络搜索 | `query`: 搜索关键词 |
| `run_command` | 执行系统命令 | `command`: 命令字符串 |

## 🎮 使用方法

### 基本使用流程

1. **启动本地服务器**
   ```bash
   pnpm serve:dev
   ```

2. **访问支持的 LLM 平台**
   - 打开浏览器，访问支持的 LLM 平台（如 ChatGPT、Gemini 等）
   - 插件会自动检测并显示 Agent 状态

3. **启用 Agent 功能**
   - 在输入框附近找到 Agent 图标
   - 点击图标启用 Agent 模式
   - 状态指示器变为绿色表示已启用

4. **开始使用**
   - 正常输入您的问题（使用自然语言）
   - 插件会自动将问题转换为结构化格式
   - LLM 会分析并调用相应的工具
   - 工具执行结果会自动返回给 LLM
   - 获得最终的智能回答

### 使用示例

#### 示例 1: 文件操作
```
用户输入: "帮我创建一个名为 test.txt 的文件，内容为 'Hello World'"

Agent 处理流程:
1. 解析用户请求
2. 调用 write_file 工具
3. 创建文件并写入内容
4. 返回执行结果
5. LLM 生成最终回答
```

#### 示例 2: 网络搜索
```
用户输入: "搜索今天的天气情况"

Agent 处理流程:
1. 解析用户请求
2. 调用 search_web 工具
3. 获取天气信息
4. 返回搜索结果
5. LLM 基于结果回答
```

#### 示例 3: 系统信息
```
用户输入: "查看我的系统信息"

Agent 处理流程:
1. 解析用户请求
2. 调用 get_system_info 工具
3. 获取系统详细信息
4. 返回系统信息
5. LLM 整理并展示信息
```

## ⚙️ 配置说明

### 本地服务器配置

在 `packages/agent/src/server/config/index.ts` 中可以配置：

```typescript
export const config = {
  /** 服务器端口 */
  port: 3000,

  /** 工作目录 */
  workspace: process.cwd(),

  /** 允许的工具列表 */
  allowedTools: ['read_file', 'write_file', 'search_web'],

  /** 安全设置 */
  security: {
    /** 是否启用路径安全检查 */
    enablePathCheck: true,

    /** 允许访问的路径前缀 */
    allowedPaths: [process.cwd()]
  }
}
```

### 浏览器插件配置

在插件弹出窗口中可以配置：

- **服务器地址**: 本地服务器的访问地址
- **工作目录**: Agent 可以操作的文件目录
- **工具权限**: 启用/禁用特定工具
- **自动启用**: 是否在支持的网站自动启用 Agent

## 🔒 安全说明

### 权限控制

- **最小权限原则**: 插件只请求必要的权限
- **路径安全检查**: 防止访问系统关键目录
- **用户确认机制**: 危险操作需要用户确认
- **工具权限管理**: 可以禁用特定工具

### 数据安全

- **本地执行**: 所有工具在本地执行，数据不离开您的计算机
- **无数据收集**: 插件不收集或上传任何用户数据
- **透明操作**: 所有操作都有详细的日志记录

## 🐛 故障排除

### 常见问题

#### 1. 插件无法连接到本地服务器
**解决方案**:
- 确保本地服务器正在运行：`pnpm serve:dev`
- 检查服务器地址配置是否正确
- 确认防火墙没有阻止连接

#### 2. 工具执行失败
**解决方案**:
- 检查文件路径是否正确
- 确认有足够的文件操作权限
- 查看浏览器控制台的错误信息

#### 3. 在特定网站无法启用 Agent
**解决方案**:
- 确认网站是否在支持列表中
- 尝试刷新页面重新初始化
- 检查插件是否正确安装

#### 4. XML 解析错误
**解决方案**:
- 确保使用键盘回车发送消息
- 避免在消息中使用特殊字符
- 检查 LLM 响应格式是否正确

### 调试模式

启用调试模式可以获取更详细的日志信息：

1. 在插件设置中启用"调试模式"
2. 打开浏览器开发者工具
3. 查看 Console 标签页的日志信息

## 📝 注意事项

### 重要提醒

- **开启或切换新会话时，请刷新页面以初始化**
- **尽量使用键盘回车发送消息，而不是点击发送按钮**，因为发送按钮有些平台无法 hack 到
- **确保本地服务器正在运行**，否则 Agent 功能无法使用
- **注意文件操作权限**，避免误删重要文件

### 最佳实践

1. **定期备份重要文件**，避免意外操作导致数据丢失
2. **使用相对路径**，提高跨平台兼容性
3. **合理配置工作目录**，限制 Agent 的操作范围
4. **及时更新插件**，获得最新的功能和安全修复

## 🔧 开发指南

### 项目结构

```
nexus-agent/
├── packages/
│   ├── agent/              # 本地服务器和工具执行器
│   │   ├── src/
│   │   │   ├── agent/      # Agent 核心逻辑
│   │   │   ├── server/     # HTTP 服务器
│   │   │   └── tools/      # 工具实现
│   │   └── Task.md         # XML 规范文档
│   └── chrome-ext/         # 浏览器插件
│       ├── src/
│       │   ├── content/    # 内容脚本
│       │   ├── background/ # 后台脚本
│       │   └── components/ # UI 组件
│       └── manifest.json   # 插件清单
└── README.md
```

### 开发命令

```bash
# 开发模式
pnpm serve:dev      # 启动本地服务器
pnpm ext:dev        # 开发浏览器插件

# 构建
pnpm serve:build    # 构建本地服务器
pnpm ext:build      # 构建浏览器插件

# 测试
pnpm test           # 运行测试
pnpm lint           # 代码检查
```

### 添加新工具

1. 在 `packages/agent/src/agent/tools/` 中创建工具实现
2. 在 `packages/agent/Task.md` 中更新工具文档
3. 在 `packages/chrome-ext/src/config/prompt.ts` 中更新工具列表
4. 测试工具功能并更新文档

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本项目
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 创建 Pull Request

## 📞 支持与反馈

如果您在使用过程中遇到问题或有任何建议，请：

- 📧 发送邮件至：[your-email@example.com]
- 🐛 在 GitHub 上提交 Issue
- 💬 加入我们的讨论群组

---

**Nexus Agent** - 让 AI 更智能，让工作更高效！ 🚀
