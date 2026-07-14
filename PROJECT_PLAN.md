# My Agent：总体项目计划

## 1. 项目目标

`my-agent` 是一个用于边学边做的全栈 Agent 项目。长期目标是复刻 nanobot 的大部分核心能力，但不直接复制 nanobot 的实现，也不从零编写 Agent Runtime，而是优先使用成熟框架完成产品：

- 使用 Next.js、TypeScript、Tailwind CSS 构建 Web 前端；
- 使用 FastAPI 构建后端 API；
- 使用 LangChain 封装模型和工具；
- 使用 LangGraph 构建 Agent 工作流、会话状态和持久化；
- 逐步实现聊天、工具调用、流式响应、会话、记忆、文件、搜索、定时任务、MCP、多 Agent 等能力；
- 每个阶段都必须有能运行、能演示、能测试的成果。

本项目同时有两个成功标准：

1. 产品标准：最终得到一个可实际使用的个人 AI Agent。
2. 学习标准：能够解释每个模块解决的问题，而不是只会复制代码。

## 2. 技术栈

### 前端

- Next.js（App Router）
- TypeScript
- Tailwind CSS
- shadcn/ui（需要组件时再安装）
- Markdown 渲染
- 原生 `fetch` + SSE；状态复杂后再考虑 TanStack Query

### 后端

- Python 3.11+
- FastAPI
- Pydantic Settings
- LangChain
- LangGraph
- SQLAlchemy 2.x + Alembic
- PostgreSQL（早期允许 SQLite）
- pytest

### 工程与部署

- Git
- Ruff
- ESLint
- Docker Compose（数据库阶段再引入）
- LangSmith 或 Langfuse（Agent 跑通后再引入）

## 3. 架构原则

### 3.1 先使用框架，再理解内部原理

第一版使用 LangGraph 提供的 prebuilt agent。只有当现成 Agent 无法表达明确需求时，才改成自定义 `StateGraph`。

### 3.2 前后端职责分离

- Next.js 负责界面、交互和展示；
- FastAPI 是所有业务入口；
- LangGraph 负责一次 Agent run 内的状态和流程；
- 数据库负责长期事实；
- 工具负责与文件、网页、外部服务交互。

### 3.3 始终保持可运行

每个里程碑结束时，项目必须能够启动。不要同时重构前端、后端和 Agent。

### 3.4 先小后大

实现顺序遵循：

```text
普通聊天
→ 工具调用
→ Web 页面
→ 流式响应
→ 多会话
→ 持久化
→ 文件与搜索
→ 记忆
→ 自动化
→ MCP
→ 多 Agent
```

### 3.5 安全边界不能最后补

文件、网络、Shell 等工具必须限制权限、超时和输出长度。高风险操作要增加用户确认。

## 4. 目标架构

```text
Browser
  ↓ HTTP / SSE
Next.js Web App
  ↓ REST / SSE
FastAPI
  ├── Thread / Message / Run API
  ├── Agent Service
  │     ↓
  │   LangGraph
  │     ├── LLM
  │     ├── Tool Registry
  │     ├── Context Policy
  │     └── Checkpointer
  ├── File / Search / MCP / Automation Services
  └── PostgreSQL / Object Storage
```

建议目录最终演进为：

```text
my-agent/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   └── lib/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── agent/
│   │   ├── tools/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   └── main.py
│   └── tests/
├── docs/
├── docker-compose.yml
├── PROJECT_PLAN.md
└── TODO.md
```

不需要现在一次性创建所有目录；做到相关功能时再创建。

## 5. 功能范围：对应 nanobot 的渐进式复刻

| nanobot 能力 | my-agent 实现方式 | 阶段 |
|---|---|---|
| Agent tool loop | LangGraph prebuilt agent，之后升级 StateGraph | M1 / M6 |
| 多模型 Provider | LangChain chat model adapter + 配置层 | M7 |
| WebUI | Next.js + Tailwind CSS | M2 |
| 流式响应 | FastAPI StreamingResponse + SSE | M3 |
| Session | thread/message/run 模型 + LangGraph checkpointer | M4 |
| 工具系统 | LangChain `@tool` + 自定义 registry/policy | M1 / M5 |
| Web 搜索与抓取 | 第三方搜索 API + 安全网页读取 | M5 |
| 文件读写 | workspace 范围内的文件工具 | M5 |
| 长短期记忆 | checkpoint + summary + memory profile | M6 |
| Skills | Markdown 指令包 + loader | M7 |
| MCP | LangChain/LangGraph MCP adapter | M8 |
| 定时任务 | scheduler + 持久化 job + Agent run | M9 |
| 多 Agent | supervisor/worker subgraph | M10 |
| 多渠道 | Web 优先，之后增加 Telegram/Slack adapter | M11 |
| 可观测性与评测 | trace、数据集、回归 eval | M5 起持续建设 |

## 6. 里程碑

### M0：开发环境与最小骨架（1–2 天）

交付：前后端都能启动，浏览器能调用后端健康检查。

学习：终端、Git、Python 虚拟环境、npm、HTTP、环境变量。

### M1：第一个可调用工具的 Agent（2–3 天）

交付：在 FastAPI Swagger 中发送消息；Agent 能自主决定是否调用计算器和时间工具。

学习：Chat Model、Message、Tool、Tool Call、Prompt、prebuilt agent。

### M2：最小聊天 WebUI（2–4 天）

交付：浏览器聊天页能够发送问题、显示 Markdown 回答和错误状态。

学习：React 组件、state、表单、fetch、Tailwind 布局、跨域。

### M3：流式响应与工具活动（2–4 天）

交付：回答逐步出现；页面显示工具开始、完成、失败。

学习：异步生成器、SSE、结构化运行事件、断线处理。

### M4：多会话与持久化（3–5 天）

交付：会话列表、新建/重命名/删除会话、刷新后保留历史。

学习：关系数据库、迁移、repository、LangGraph checkpointer、thread ID。

### M5：实用工具与安全（1 周）

交付：网页搜索、网页读取、工作区文件读取；有超时、大小限制和访问边界。

学习：工具 schema、错误反馈、SSRF、路径穿越、权限、审计日志。

### M6：上下文与记忆（1 周）

交付：长对话自动总结；Agent 能保存并读取明确的用户偏好。

学习：token budget、短期历史、摘要、长期记忆、信息过期与删除。

### M7：配置、多模型与 Skills（1 周）

交付：设置页切换模型；通过 Markdown Skill 增加一套工作指令。

学习：Provider 抽象、配置验证、Prompt 版本、Skill 加载。

### M8：MCP（3–5 天）

交付：连接一个 MCP Server，发现并调用其工具，显示连接状态。

学习：MCP transport、工具发现、名称冲突、权限边界。

### M9：自动化与后台任务（1 周）

交付：创建定时 Agent 任务，保存执行记录并在完成后通知 UI。

学习：scheduler、worker、幂等、重试、取消、任务恢复。

### M10：多 Agent（1 周）

交付：主 Agent 可以把一个有边界的研究子任务交给 worker，并合并结构化结果。

学习：subgraph、supervisor、预算、并发、任务隔离。

### M11：部署与更多渠道（持续）

交付：部署 Web 版本；按实际需求增加 Telegram 或 Slack，而不是一次接入所有渠道。

学习：Docker、反向代理、鉴权、日志、备份、监控。

## 7. 每个功能的固定学习循环

每次只处理一个小功能，并按以下顺序推进：

1. 写一句用户故事，例如“用户可以发送消息并看到回答”。
2. 画最小数据流，确认请求从哪里进入、状态存在哪里。
3. 阅读框架官方文档中的一个对应示例。
4. 先复制并运行最小示例。
5. 用自己的命名重新实现，并删除不理解的代码。
6. 手工验证成功路径与一个失败路径。
7. 增加至少一个自动化测试。
8. 在 `TODO.md` 勾选任务并记录新问题。
9. 提交一个小 Git commit。

## 8. 开发规则

- 一次只完成 `TODO.md` 中一个“进行中”任务。
- 遇到不懂的概念，先写下自己的理解，再查文档。
- 不直接复制 nanobot 大段源码；可以参考它的模块边界和错误场景。
- 不把 API key 写入代码或提交到 Git。
- 新依赖必须能回答“它解决了什么问题”。
- 完成一个里程碑后再引入下一批依赖。
- Bug 修复必须尽量增加回归测试。
- 每个 API 和事件都使用 Pydantic/TypeScript 类型，不依赖隐式字典结构。

## 9. 当前明确不做

在 M5 完成前，不做以下内容：

- 多 Agent；
- RAG 和向量数据库；
- 自由 Shell 执行；
- MCP；
- 定时任务；
- 多渠道；
- Kubernetes；
- 微服务拆分；
- 自研 LLM Provider 或 Agent loop。

## 10. 项目完成标准

项目达到“复刻 nanobot 大部分核心能力”的标准时，应满足：

- 用户可以在 WebUI 管理多个持久会话；
- Agent 可以流式回答并展示工具执行过程；
- 支持安全的搜索、网页、文件和 MCP 工具；
- 支持模型配置、Skills、短期会话和长期记忆；
- 支持可恢复的后台任务和至少一种自动化；
- 支持有预算限制的子 Agent；
- 具有鉴权、权限、审计、trace 和基础 eval；
- 关键功能有测试，项目可通过文档在新环境启动。

