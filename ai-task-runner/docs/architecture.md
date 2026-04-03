# 架构设计文档

## 概述

AI Task Runner 采用**双版本架构**，满足从个人到企业级的不同需求。

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Task Runner                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌─────────────────────────────────┐ │
│  │   简化版     │      │           完整版                 │ │
│  │  (simple/)   │      │        (packages/)               │ │
│  │              │      │                                 │ │
│  │ Bash 脚本    │      │  ┌─────────┐ ┌─────┐ ┌──────┐  │ │
│  │ SKILL.md     │      │  │  Core   │ │ CLI │ │ MCP  │  │ │
│  │              │      │  │ 引擎    │ │工具 │ │Server│  │ │
│  │ • 快速上手   │      │  └────┬────┘ └──┬──┘ └──┬───┘  │ │
│  │ • 零依赖     │      │       └─────────┴────────┘      │ │
│  │ • Kimi 专用  │      │              │                   │ │
│  │              │      │              ▼                   │ │
│  └──────────────┘      │  ┌───────────────────────────┐  │ │
│         │              │  │      TypeScript API       │  │ │
│         │              │  │    • 类型安全             │  │ │
│         │              │  │    • 可扩展               │  │ │
│         │              │  │    • 多工具支持           │  │ │
│         │              │  └───────────────────────────┘  │ │
│         │              │                                 │ │
│         └──────────────┴─────────────────────────────────┘ │
│                          │                                  │
│                          ▼                                  │
│         ┌──────────────────────────────────────┐           │
│         │           统一任务格式                │           │
│         │      Markdown + YAML frontmatter     │           │
│         └──────────────────────────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 设计原则

### 1. 渐进式复杂度

```
简单需求 ──────► 复杂需求
    │               │
    ▼               ▼
  简化版          完整版
  (Bash)       (TypeScript)
    │               │
    └───────┬───────┘
            ▼
       统一任务格式
```

### 2. 格式优先

任务文件格式是核心，两个版本使用**完全相同的格式**：

```markdown
---
id: "tr-20260401-104530-a3f9"
meta:
  title: "任务标题"
  priority: high
status: in_progress
github:
  number: 42
git:
  branch: "ai-task/tr-..."
---

## 子任务

- [ ] 1. 子任务 1
- [x] 2. 子任务 2 (已完成)
```

### 3. 插件化架构

完整版采用模块化设计：

```
Core (核心引擎)
  ├── Parser (解析器)
  ├── Storage (存储)
  ├── Executor (执行器)
  ├── Git (版本控制)
  └── GitHub (Issue 管理)

CLI (命令行)
  └── 基于 Core 的命令封装

MCP (Model Context Protocol)
  └── 基于 Core 的协议实现
```

## 数据流

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  用户输入  │────▶│  解析器   │────▶│  存储器   │────▶│  GitHub  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                       │
                                       ▼
                                  ┌──────────┐
                                  │  任务文件 │
                                  │  .md/.json│
                                  └──────────┘
                                       │
                                       ▼
┌──────────┐     ┌──────────┐     ┌──────────┐
│   Git    │◀────│  执行器   │◀────│  任务数据 │
└──────────┘     └──────────┘     └──────────┘
```

## 核心模块

### Parser 模块

职责：解析和序列化任务文件

```typescript
// 解析
parseTaskFile(content: string): ParsedTaskFile

// 序列化
serializeTaskToMarkdown(task: Task): string
```

### Storage 模块

职责：任务数据的持久化

```typescript
interface StorageAdapter {
  save(task: Task): Promise<void>
  load(taskId: string): Promise<Task | null>
  list(filters?: ListFilters): Promise<Task[]>
  archive(taskId: string): Promise<void>
}
```

### Executor 模块

职责：任务执行和工作流管理

```typescript
class TaskRunner {
  create(params): Task
  analyze(task, analyzer): Promise<Task>
  plan(task, planner): Promise<Task>
  execute(task, executor, options): Promise<Task>
  complete(task): Promise<Task>
}
```

## 版本对比

| 特性 | 简化版 | 完整版 |
|------|--------|--------|
| 安装方式 | 复制文件 | npm install |
| 依赖 | gh, git | Node.js 运行时 |
| 编程接口 | ❌ | ✅ TypeScript |
| CLI | ❌ | ✅ 完整命令集 |
| MCP | ❌ | ✅ 标准协议 |
| 扩展性 | 手动修改源码 | 插件系统 |
| 配置 | 环境变量 | JSON 配置文件 |
| 适用场景 | 个人/快速尝试 | 团队/生产环境 |

## 集成方案

### Kimi CLI (简化版)

```
用户输入
    │
    ▼
Kimi 读取 SKILL.md
    │
    ▼
调用 scripts/*.sh
    │
    ▼
操作 Git/GitHub
```

### Claude Code / Cline (完整版 MCP)

```
Claude Code
    │
    ▼
MCP Client
    │
    ▼
ai-task-mcp server
    │
    ▼
Core API
```

配置示例：

```json
{
  "mcpServers": {
    "task-runner": {
      "command": "npx",
      "args": ["-y", "@innate/ai-task-mcp"]
    }
  }
}
```

## 扩展点

### 添加新的存储适配器

```typescript
class CustomStorage implements StorageAdapter {
  async save(task: Task): Promise<void> {
    // 实现保存逻辑
  }
  // ...
}
```

### 添加新的 AI 提供者

```typescript
const analyzer = async (task: Task): Promise<TaskAnalysis> => {
  // 调用自定义 AI 服务
  return analysis;
};

await runner.analyze(task, analyzer);
```

## 安全考虑

1. **Token 管理**
   - 使用环境变量存储 GitHub Token
   - 不写入配置文件

2. **权限控制**
   - 危险操作需要确认
   - 可配置自动审批规则

3. **审计日志**
   - 所有操作记录到任务历史
   - 支持追踪执行过程

## 性能优化

1. **延迟加载**
   - 仅在需要时加载任务详情
   - 列表视图使用元数据缓存

2. **并发控制**
   - 子任务串行执行（保证顺序）
   - 批量操作支持并发

3. **缓存策略**
   - GitHub Issue 状态缓存
   - 本地文件系统缓存
