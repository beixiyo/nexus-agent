# Nexus Agent

让浏览器网页控制你的电脑，跨越系统边界，免费调用 LLM 的能力

<video muted autoplay controls src="https://github.com/user-attachments/assets/17d127dd-553f-4185-8463-8f6344e36f94" title="项目功能演示"></video>

## 📖 项目简介

**Nexus Agent** 是一个创新的浏览器插件，它能够将云端大语言模型（如 ChatGPT、Gemini、DeepSeek 等）与您的本地计算机无缝连接。通过智能的 XML 格式转换和本地工具执行，让您在使用各种 LLM 服务时，能够直接操作本地文件、执行系统命令、获取网络信息等。

### 🎯 核心特性

- **🔄 跨平台 LLM 访问**: 支持 Gemini、DeepSeek、通义千问等主流 LLM 平台
- **🔧 本地工具执行**: 提供文件操作、系统命令、网络搜索等 20+ 种本地工具
- **🤖 智能 XML 转换**: 自动将自然语言转换为结构化 XML 格式
- **🛡️ 安全权限管理**: 细粒度的工具权限控制和用户确认机制

## 📋 支持的 LLM 平台

| 平台 | 网址 | 状态 | 说明 |
|------|------|------|------|
| **通义千问** | https://www.tongyi.com/qianwen | ✅ 已适配 | 阿里云大模型平台 |
| **DeepSeek** | https://chat.deepseek.com/ | ✅ 已适配 | 深度求索大模型 |
| **AI Studio Gemini** | https://aistudio.google.com/prompts/new_chat | ✅ 已适配 | Google Gemini 平台 |

## 🛠️ 可用工具列表

详见 [packages/agent/README.md](./packages/agent/README.md)

## 🚀 快速开始

### 1. 安装浏览器插件

#### 开发者模式安装

1. 下载插件文件：[Nexus Agent Extension](https://github.com/beixiyo/nexus-agent/releases/tag/v1.0.0)
2. 解压下载的文件
3. 打开 Chrome 浏览器，进入 `chrome://extensions/`
4. 开启右上角的 **"开发者模式"**
5. 点击 **"加载已解压的扩展程序"**
6. 选择解压后的插件文件夹
7. 插件安装完成

### 2. 启动本地服务器

#### 全局安装方式（推荐）

```bash
# 全局安装 nexus-agent
npm install -g @jl-org/nexus-agent

# 启动服务器（默认端口 3000）
nexus-agent

# 指定工作目录启动
nexus-agent /path/to/your/workspace

# 指定端口启动
nexus-agent --port 8080
```

### 3. 访问对应的 LLM 平台

1. 打开支持的 LLM 平台（如通义千问、DeepSeek 等）
2. 等待插件 "Nexus Agent 初始化完成" 提示
3. 在聊天界面中，使用 **键盘回车** 发送消息
4. 当 LLM 需要执行本地操作时，插件会自动处理

#### 本地开发方式

```bash
# 克隆项目
git clone https://github.com/your-username/nexus-agent.git
cd nexus-agent

# 安装依赖
pnpm install

# 启动开发服务器
pnpm serve:dev
```

### 3. 配置插件

1. 点击浏览器工具栏中的 Nexus Agent 插件图标
2. 在设置页面中配置：
   - **服务器地址**：默认为 `http://localhost:3000`
   - **工作目录**：设置 Agent 可以操作的文件目录
   - **工具权限**：选择需要启用的工具

### 4. 开始使用

1. 打开支持的 LLM 平台（如通义千问、DeepSeek 等）
2. **刷新页面** 以初始化插件
3. 在聊天界面中，使用 **键盘回车** 发送消息
4. 当 LLM 需要执行本地操作时，插件会自动处理

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
