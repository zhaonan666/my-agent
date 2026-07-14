# My Agent：当前 Todo List

> 当前目标：完成 M0 和 M1。先从 FastAPI 跑通一个使用 LangGraph 现成框架的工具调用 Agent。完成前不要开始数据库、MCP、RAG 或多 Agent。

## 使用方法

- `[ ]` 未开始
- `[>]` 进行中
- `[x]` 已完成
- `[!]` 被阻塞，并在任务下写明原因

每次只保留一个 `[>]`。完成任务时，在“学习记录”中用自己的话写一句收获。

## M0：开发环境与项目骨架

### 0.1 认识当前环境

- [ ] 在终端进入 `my-agent` 并运行 `pwd`。
- [ ] 确认 Python 版本为 3.11 或更高：`python3 --version`。
- [ ] 确认 Node.js 和 npm 可用：`node --version`、`npm --version`。
- [ ] 阅读并理解 `.gitignore` 的用途。
- [ ] 创建根目录 `README.md`，写清项目目标和启动方式占位。

验收：能够解释前端、后端分别运行在哪个进程中，以及浏览器如何通过 HTTP 调用后端。

### 0.2 创建 FastAPI 后端

- [ ] 创建 `backend/`。
- [ ] 在 `backend/` 创建 Python 虚拟环境 `.venv`。
- [ ] 创建 `backend/pyproject.toml`。
- [ ] 安装第一批依赖：FastAPI、Uvicorn、Pydantic Settings。
- [ ] 创建 `backend/app/__init__.py`。
- [ ] 创建 `backend/app/main.py`。
- [ ] 实现 `GET /health`，返回 `{ "status": "ok" }`。
- [ ] 使用 Uvicorn 启动后端。
- [ ] 在浏览器打开 `/docs`，调用健康检查。
- [ ] 创建 `backend/tests/test_health.py`。
- [ ] 运行测试并确认通过。

验收命令预期形态：

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

### 0.3 创建 Next.js 前端

- [ ] 使用 `create-next-app` 创建 `frontend/`。
- [ ] 选择 TypeScript、Tailwind CSS、App Router 和 ESLint。
- [ ] 启动前端并打开首页。
- [ ] 删除模板中当前不需要的展示内容。
- [ ] 在首页显示“My Agent”。
- [ ] 创建一个按钮调用后端 `/health`。
- [ ] 页面显示后端返回的健康状态。
- [ ] 若遇到 CORS 错误，先理解原因，再在 FastAPI 配置本地开发来源。

验收：浏览器页面能显示后端的 `ok`，前端和后端可独立启动。

### 0.4 基础工程配置

- [ ] 创建 `.env.example`，只放变量名和示例占位值。
- [ ] 创建/检查 `.gitignore`，排除 `.env`、`.venv`、`node_modules` 和构建产物。
- [ ] 后端配置 Ruff。
- [ ] 确认前端 ESLint 可以运行。
- [ ] 更新根目录 README，记录前后端启动命令。
- [ ] 提交第一个 Git commit。

## M1：第一个工具调用 Agent

### 1.1 配置模型

- [ ] 确定第一版只使用一个模型 Provider。
- [ ] 在 `.env.example` 添加模型和 API key 对应变量名。
- [ ] 使用 Pydantic Settings 从环境变量读取配置。
- [ ] 确认 API key 不会被日志输出，也不会提交到 Git。
- [ ] 安装 LangChain、对应模型集成包和 LangGraph。
- [ ] 写一个最小脚本调用模型并打印普通文本回答。

验收：能解释“模型 Provider”“模型名称”“API key”三者的区别。

### 1.2 创建工具

- [ ] 创建 `backend/app/agent/`。
- [ ] 创建 `backend/app/agent/tools.py`。
- [ ] 用 LangChain `@tool` 实现 `get_current_time`。
- [ ] 实现安全计算器；禁止直接使用无保护的 Python `eval`。
- [ ] 为每个工具写清晰 docstring，因为它会影响模型选择。
- [ ] 为两个工具分别写单元测试。
- [ ] 手工观察工具的名称、描述和参数 schema。

验收：能够回答“模型为什么知道什么时候调用工具”。

### 1.3 使用 LangGraph prebuilt agent

- [ ] 创建 `backend/app/agent/graph.py`。
- [ ] 使用 LangGraph 当前推荐的 prebuilt agent API 创建 Agent。
- [ ] 把模型、时间工具和计算器交给 Agent。
- [ ] 输入普通问候，确认 Agent 不需要调用工具。
- [ ] 输入计算问题，确认 Agent 调用计算器。
- [ ] 输入时间问题，确认 Agent 调用时间工具。
- [ ] 打印并观察完整 messages，而不只是最终答案。
- [ ] 为一次“tool call → tool result → final answer”写 fake-model 测试。

验收：可以画出一次 Agent 调用的消息序列，并解释 tool call ID 的作用。

### 1.4 暴露 Chat API

- [ ] 创建请求模型 `ChatRequest`。
- [ ] 创建响应模型 `ChatResponse`。
- [ ] 实现 `POST /api/chat`。
- [ ] 使用异步 `ainvoke` 调用 Agent。
- [ ] 返回最终回答以及本次使用过的工具名称。
- [ ] 处理空消息并返回 422。
- [ ] 处理模型调用异常，但不向客户端泄露 API key 或内部堆栈。
- [ ] 增加模型调用超时。
- [ ] 从 Swagger 测试普通问题、计算问题和时间问题。
- [ ] 为 Chat API 写至少三个测试：成功、参数错误、Agent 异常。

建议第一版响应结构：

```json
{
  "answer": "...",
  "tools_used": ["calculator"]
}
```

### 1.5 接入最小聊天页面

- [ ] 创建聊天页布局。
- [ ] 创建消息列表组件。
- [ ] 创建输入框和发送按钮。
- [ ] 用户提交后调用 `POST /api/chat`。
- [ ] 发送期间禁用重复提交并显示 Loading。
- [ ] 展示用户消息和 Agent 回答。
- [ ] 展示本次调用过的工具名称。
- [ ] 展示网络错误，并允许用户重试。
- [ ] 支持 Enter 发送、Shift+Enter 换行。
- [ ] 使用 Tailwind 完成基本桌面与移动端布局。

验收：只启动前后端，就能在浏览器完成普通聊天和工具调用。

## M1 完成检查

- [ ] 后端测试全部通过。
- [ ] 前端 lint 通过。
- [ ] `.env` 未进入 Git。
- [ ] README 的启动步骤在一个新终端中验证过。
- [ ] 录制或截图一次完整演示。
- [ ] 用自己的话解释以下概念：Message、Tool、Tool Call、Agent、Graph、API、异步调用。
- [ ] 在下方写出本阶段最难的三个问题。
- [ ] 更新 `PROJECT_PLAN.md` 中不再符合实际的假设。
- [ ] 提交 M1 完成 commit。

## 下一阶段预告（现在不要展开）

M1 完成后，将 Todo 重写为 M2/M3：

- Next.js 聊天体验完善；
- FastAPI SSE；
- LangGraph 流式事件；
- token 增量显示；
- 工具开始/结束/失败活动卡片；
- run ID、取消和错误恢复。

## 学习记录

### 当前进行中的任务

尚未开始。建议从“0.1 认识当前环境”的第一项开始，并把它改为 `[>]`。

### 已理解的概念

- 暂无。

### 遇到的问题

- 暂无。

### 本阶段最难的三个问题

1. 待填写。
2. 待填写。
3. 待填写。

