# My Agent：开发 Todo

> 目标：边学边实现一个接近 nanobot 核心体验的个人 Agent。当前优先完成可见功能，暂不把自动化测试和性能优化作为阶段门槛。

## 状态说明

- `[ ]` 未开始
- `[>]` 正在进行（同时只保留一项）
- `[x]` 已完成
- `[!]` 被阻塞，需要在任务下写明原因

## 当前进度

### M0：项目骨架

- [x] 创建 FastAPI 后端项目。
- [x] 创建 Next.js + TypeScript + Tailwind CSS 前端项目。
- [x] 配置前后端本地启动。
- [x] 配置 CORS。
- [x] 使用 Pydantic Settings 读取 `.env`。
- [x] 配置项目 `.gitignore`，排除密钥、依赖和构建产物。
- [x] 创建 GitHub 仓库并推送首个版本。

### M1：第一个 Agent

- [x] 使用阿里云百炼作为模型服务。
- [x] 使用 `init_chat_model` 初始化模型。
- [x] 使用 `create_agent` 创建 Agent。
- [x] 使用 `@tool` 创建 `get_current_time` 工具。
- [x] FastAPI 提供 Chat API。
- [x] Next.js 可以发送问题并显示 Agent 回答。
- [x] 使用 `thread_id` 区分会话。
- [x] 使用 `InMemorySaver` 实现同一线程的多轮记忆。
- [x] 使用 SSE 实现回答文本流式传输。
- [x] 前端能够解析 SSE 并逐步追加 token。

## 后续体验优化：M2 聊天基础体验（暂缓）

> 当前阶段先把聊天过程做完整：能发送、能等待、能显示状态、能处理失败。完成后再开始数据库持久化。

### 2.1 消息状态与 Loading

- [ ] 为消息增加稳定的 `id` 和 `status` 字段。
- [ ] 定义消息状态：`sending`、`streaming`、`completed`、`error`。
- [ ] 用户发送后立即插入一条空的 AI 消息占位。
- [ ] 首个 token 到达前显示“Agent 正在思考…”或 Loading 动画。
- [ ] token 到达后把状态从 `sending` 改成 `streaming`。
- [ ] 收到 `done` 后把状态改成 `completed`。
- [ ] 流中断或请求失败时把状态改成 `error`。
- [ ] 请求进行中禁用发送按钮，防止重复提交。
- [ ] 请求进行中保留当前输入状态的明确规则。
- [ ] 错误消息显示“重新发送”入口。

验收：网络较慢时，用户发送后页面立即有反馈；连续点击不会发出重复请求；失败时不会永久卡在 Loading。

### 2.2 输入体验

- [ ] 空字符串和纯空格不能发送。
- [ ] Enter 发送消息。
- [ ] Shift + Enter 换行。
- [ ] 发送完成后输入框重新获得焦点。
- [ ] 输入框随多行内容适度增高。
- [ ] 中文输入法组合输入期间不能误触发送。
- [ ] 页面自动滚动到最新消息。
- [ ] 用户主动向上阅读历史时不要强制抢回底部。

### 2.3 消息展示

- [ ] 使用消息 `id` 作为 React key，不再使用数组 index。
- [ ] 区分用户消息、Agent 消息和错误消息。
- [ ] 支持基础 Markdown 展示。
- [ ] 支持代码块和行内代码。
- [ ] 长文本能够正确换行，不产生横向页面溢出。
- [ ] 显示 Agent 本轮调用过的工具名称。
- [ ] 为工具增加 `running`、`success`、`error` 展示状态。

### 2.4 流式协议完善

- [ ] 统一 SSE 事件结构：`type`、`content`、必要的标识字段。
- [ ] 支持 `token`、`tool_start`、`tool_result`、`done`、`error`。
- [ ] 后端生成器发生异常时发送 `error` 事件并正常结束响应。
- [ ] 前端正确保留不完整 SSE 数据块，避免 token 重复或 JSON 截断。
- [ ] 页面离开或重新发送时能够取消旧请求。
- [ ] 使用 `AbortController` 实现“停止生成”。

## M3：会话持久化与侧边栏

> 当前里程碑：先学习 PostgreSQL 与 SQLAlchemy，再分别持久化业务会话数据和 LangGraph Agent 状态。

### 3.0 PostgreSQL 与 SQLAlchemy 基础

- [>] 学习表、行、列、主键、外键、唯一约束、索引和事务。
- [ ] 使用 Docker Compose 启动本地 PostgreSQL。
- [ ] 理解数据库、用户、密码、端口和连接 URL。
- [ ] 使用数据库客户端连接 PostgreSQL。
- [ ] 手工练习 `SELECT`、`INSERT`、`UPDATE`、`DELETE`。
- [ ] 学习 SQLAlchemy 2.x 的 `DeclarativeBase`、`Mapped` 和 `mapped_column`。
- [ ] 学习 `create_async_engine`、`async_sessionmaker` 和 `AsyncSession`。
- [ ] 学习 SQLAlchemy 的 `select`、`commit`、`rollback` 和 `refresh`。
- [ ] 学习 FastAPI 依赖注入，为每个请求提供独立 Session。
- [ ] 学习 Alembic migration：创建、升级和回滚数据库结构。

### 3.1 Agent 状态持久化

- [ ] 安装 `langgraph-checkpoint-postgres`。
- [ ] 使用 `AsyncPostgresSaver` 替换 `InMemorySaver`。
- [ ] 首次连接时执行 checkpointer `setup()` 创建 LangGraph 表。
- [ ] 使用 FastAPI lifespan 打开和关闭 checkpointer。
- [ ] 将 Agent 创建改为接收 checkpointer 的工厂函数。
- [ ] 后端重启后，相同 `thread_id` 仍能恢复上下文。
- [ ] 不同 `thread_id` 的上下文保持隔离。
- [ ] 不使用 SQLAlchemy 读写 LangGraph 自己的 checkpoint 表。

### 3.2 会话元数据

- [ ] 使用 SQLAlchemy 定义业务表，不与 LangGraph checkpoint 表混用。
- [ ] 定义会话数据：`id`、`title`、`created_at`、`updated_at`。
- [ ] 使用 Alembic 创建 threads 表迁移。
- [ ] 实现创建会话接口。
- [ ] 实现会话列表接口。
- [ ] 实现重命名会话接口。
- [ ] 实现删除会话接口，并同步删除 checkpoint。
- [ ] 首条用户消息生成默认会话标题。

### 3.3 前端会话管理

- [ ] 完成左侧会话列表布局。
- [ ] 支持新建会话。
- [ ] 支持切换会话。
- [ ] 支持重命名会话。
- [ ] 支持删除会话并二次确认。
- [ ] 刷新页面后恢复当前会话。
- [ ] 加载并展示历史消息。
- [ ] 移动端侧边栏可以收起和展开。

验收：刷新浏览器或重启后端后，会话列表、消息历史和 Agent 上下文仍然存在。

## M4：文件输入与附件

### 4.1 前端文件选择

- [ ] 点击“+”按钮打开文件选择器。
- [ ] 支持拖拽文件到输入区域。
- [ ] 支持从剪贴板粘贴图片。
- [ ] 发送前显示附件名称、大小和类型。
- [ ] 支持移除待发送附件。
- [ ] 显示文件上传进度和失败状态。
- [ ] 限制单文件大小、文件数量和允许类型。

### 4.2 后端上传能力

- [ ] 创建文件上传接口。
- [ ] 使用生成的文件 ID，而不是直接信任客户端文件名。
- [ ] 校验 MIME、扩展名和实际文件大小。
- [ ] 文件保存到受控 workspace 或对象存储目录。
- [ ] 防止路径穿越和同名文件覆盖。
- [ ] 定义附件元数据：ID、名称、MIME、大小、保存位置、创建时间。

### 4.3 Agent 文件理解

- [ ] Chat 请求可以携带附件 ID。
- [ ] 支持图片作为多模态消息交给模型。
- [ ] 支持读取 TXT、Markdown 和代码文件。
- [ ] 支持提取 PDF 文本。
- [ ] 支持 DOCX、XLSX、PPTX 的基础文本提取。
- [ ] 大文件不直接全部塞进上下文，先截断或生成摘要。
- [ ] Agent 回答中能够引用附件名称。

验收：用户可以上传一张图片或一个文档，询问内容并得到相关回答。

## M5：语音输入

### 5.1 前端录音

- [ ] 点击麦克风按钮请求浏览器录音权限。
- [ ] 使用 `MediaRecorder` 开始和停止录音。
- [ ] 显示录音中状态和持续时间。
- [ ] 支持取消本次录音。
- [ ] 录音结束后生成音频 Blob。
- [ ] 权限被拒绝或设备不可用时显示明确错误。

### 5.2 语音转文字

- [ ] 创建音频上传/转写接口。
- [ ] 选择百炼语音识别或其他转写 Provider。
- [ ] 后端校验音频格式和大小。
- [ ] 返回转写文字。
- [ ] 将转写文字填入输入框，允许用户修改后发送。
- [ ] 显示“上传中、转写中、完成、失败”状态。

### 5.3 后续语音能力

- [ ] 支持按住说话模式。
- [ ] 支持录音波形或音量提示。
- [ ] 可选：Agent 回答文字转语音播放。
- [ ] 可选：允许用户选择是否自动发送转写结果。

验收：用户完成录音后，输入框出现可编辑的转写文本，并能作为普通消息发送给 Agent。

## M6：实用工具

- [ ] 增加安全计算器工具，不直接使用无保护的 `eval`。
- [ ] 增加天气查询工具。
- [ ] 增加网页搜索工具。
- [ ] 增加安全网页读取工具。
- [ ] 增加 workspace 文件读取工具。
- [ ] 工具参数使用清晰类型和描述。
- [ ] 工具设置超时和输出长度上限。
- [ ] 只读工具与有副作用工具进行区分。
- [ ] 高风险工具执行前请求用户确认。

## M7：上下文和记忆

- [ ] 统计上下文 token 使用量。
- [ ] 长会话接近上下文上限时自动总结。
- [ ] 保留近期原始消息和较早消息摘要。
- [ ] 区分会话短期记忆与用户长期记忆。
- [ ] 支持保存明确的用户偏好。
- [ ] 支持查看和删除长期记忆。
- [ ] 不把 API Key、密码等敏感信息写入记忆。

## M8：模型、设置与 Skills

- [ ] 后端支持多个模型配置。
- [ ] 前端设置页可以查看和切换模型。
- [ ] 模型选择保存到会话或用户设置。
- [ ] 支持 system prompt 配置。
- [ ] 定义 Markdown Skill 格式。
- [ ] 加载 workspace 中的 Skills。
- [ ] 前端显示可用 Skills 及启用状态。

## M9：MCP

- [ ] 连接第一个 MCP Server。
- [ ] 获取并注册 MCP 工具。
- [ ] 显示 MCP 连接状态和错误。
- [ ] 处理工具名称冲突。
- [ ] 设置 MCP 工具权限范围。
- [ ] 支持新增、启用、禁用和移除 MCP Server。

## M10：自动化与后台任务

- [ ] 创建提醒或定时任务。
- [ ] 持久化任务计划和执行状态。
- [ ] 后台执行 Agent run。
- [ ] 记录每次运行结果。
- [ ] 支持取消、重试和幂等。
- [ ] 任务完成后通知前端。

## M11：多 Agent

- [ ] 主 Agent 可以创建有边界的子任务。
- [ ] Worker 返回结构化结果。
- [ ] 限制子 Agent 深度、并发数、token 和时间。
- [ ] 前端显示主 Agent 与子 Agent 的执行关系。
- [ ] 支持取消子 Agent。

## M12：发布前完善

- [ ] 用户登录与鉴权。
- [ ] 用户之间的会话、文件和记忆隔离。
- [ ] API 限流与调用额度。
- [ ] 日志脱敏。
- [ ] 模型 token 与成本记录。
- [ ] Agent trace 与错误追踪。
- [ ] Docker Compose 本地部署。
- [ ] 生产环境配置与 HTTPS。
- [ ] 数据备份和恢复方案。
- [ ] 更新 README 安装和使用说明。

## 推荐实现顺序

```text
Loading 与消息状态
→ 输入体验和错误处理
→ 工具活动展示
→ PostgreSQL 会话持久化
→ 会话侧边栏
→ 文件输入
→ 语音输入
→ 更多工具
→ 长期记忆
→ Skills / MCP
→ 自动化
→ 多 Agent
```

## 学习记录

### 当前进行中

- M3.0：学习 PostgreSQL、SQL 基础和 SQLAlchemy 2.x 异步 ORM。

### 已掌握

- FastAPI 基础路由和异步调用。
- Next.js Client Component 与基础状态管理。
- LangChain `init_chat_model`、`create_agent` 和 `@tool`。
- LangGraph thread/checkpointer 的短期记忆概念。
- FastAPI SSE 与前端 ReadableStream 解析。

### 已遇到并解决的问题

- Python 虚拟环境与模块导入路径。
- Ruff 导入排序与 VS Code 工作区配置。
- CORS 的 Origin 与端口概念。
- v2 stream chunk 数据结构。
- SSE buffer 未清理导致 token 重复。
- 后端生成器异常导致 `ERR_INCOMPLETE_CHUNKED_ENCODING`。

### 待补充

- 每完成一个里程碑，在这里记录最难的问题与自己的理解。
