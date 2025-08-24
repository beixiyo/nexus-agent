# Nexus Agent

让浏览器网页控制你的电脑，跨越系统边界，免费调用 LLM 的能力

<video muted autoplay controls src="https://github.com/user-attachments/assets/17d127dd-553f-4185-8463-8f6344e36f94" title="项目功能演示"></video>

## 已经适配的平台

- 通义千问 https://www.tongyi.com/qianwen
- DeepSeek https://chat.deepseek.com/

## 注意事项

- 开启或者切换新会话时，请刷新页面以初始化
- 尽量使用键盘回车发送消息，而不是点击发送按钮，因为发送按钮有些平台无法 hack 到

## 原理

- 监听用户输入、发送，当发送时，将用户内容改为标准格式化的内容，发给 LLN
- 当 LLM 响应时，智能判断是否需要工具执行，如果需要，则调用后端执行工具，并自动将工具执行结果发送给 LLM
