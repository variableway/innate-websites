---
name: ai-task-runner
description: "AI 任务执行自动化工具。当用户要求'执行任务'、'运行任务'、'初始化任务'、提到任务文件(.md)或 GitHub Issue 时，帮助用户执行完整的开发工作流：创建 GitHub Issue、Git 分支、追踪执行进度、自动提交代码并关闭 Issue。适用于自动化管理开发任务、追踪复杂功能实现、规范化开发流程。"
---

# AI Task Runner - 简化版

用于自动化管理 AI 开发任务的本地脚本工具。

## 核心功能

1. **任务初始化** - 从需求创建结构化任务，自动生成 GitHub Issue 和 Git 分支
2. **进度追踪** - 记录子任务执行状态，自动更新任务文件
3. **自动提交** - 完成后自动提交代码，关闭 GitHub Issue

## 快速开始

### 前置要求

确保已安装：
- `gh` CLI (GitHub CLI) - 用于操作 Issue
- `git` - 用于分支管理

检查：
```bash
gh auth status    # 确保已登录
git --version     # 确保已安装
```

### 使用工作流

```
用户: "执行这个任务" 或 "初始化新任务"
  ↓
解析需求 → 生成任务文件 → 运行脚本
  ↓
创建 Issue + 分支 → 执行子任务 → 提交 + 关闭 Issue
```

## 脚本说明

所有脚本位于 `.kimi-skills/task-runner/scripts/` 目录。

### task-init.sh - 初始化任务

**用途**: 创建新任务，自动生成 Issue 和分支

**使用场景**:
- 用户提供了任务需求，需要创建任务记录
- 用户说"创建任务"或"初始化任务"

**调用方式**:
```bash
./scripts/task-init.sh --title "任务标题" --file "./task-description.md"
```

**脚本功能**:
1. 生成任务 ID (格式: tr-{timestamp}-{hash})
2. 创建 GitHub Issue
3. 创建 Git 分支 `ai-task/{id}`
4. 生成任务文件 `tasks/active/{id}.md`
5. 输出任务信息

**示例**:
```bash
# 方式 1: 从文件读取
./scripts/task-init.sh --file ./requirements.md

# 方式 2: 直接指定标题
./scripts/task-init.sh --title "实现用户认证功能"

# 方式 3: 指定标签
./scripts/task-init.sh --title "修复登录 Bug" --labels "bug,auth"
```

### task-sync.sh - 同步状态

**用途**: 同步任务文件与 GitHub Issue 的状态

**使用场景**:
- 手动修改了 Issue 状态，需要同步到任务文件
- 检查任务当前状态
- 批量更新所有任务

**调用方式**:
```bash
./scripts/task-sync.sh [task-id] [--all]
```

**示例**:
```bash
# 同步单个任务
./scripts/task-sync.sh tr-20260401-a3f9

# 同步所有任务
./scripts/task-sync.sh --all
```

### task-complete.sh - 完成任务

**用途**: 任务完成后，自动提交代码并关闭 Issue

**使用场景**:
- 所有子任务已标记完成
- 用户说"任务完成"或"提交任务"

**调用方式**:
```bash
./scripts/task-complete.sh --id {task-id} [--message "提交信息"]
```

**脚本功能**:
1. 检查所有子任务是否完成
2. `git add .`
3. `git commit -m "feat: [{id}] {title}"`
4. `git push origin {branch}`
5. `gh issue close {issue-number}`
6. 移动任务文件到 `tasks/archive/`

**示例**:
```bash
./scripts/task-complete.sh --id tr-20260401-a3f9
./scripts/task-complete.sh --id tr-20260401-a3f9 --message "feat: 完成用户认证功能"
```

## 任务文件格式

任务文件是 Markdown 格式，包含 YAML frontmatter。

### 完整示例

```markdown
---
id: "tr-20260401-104530-a3f9"
meta:
  title: "实现用户认证系统"
  description: "基于 JWT 的用户认证功能"
  priority: high
  labels: ["feature", "auth"]
status: in_progress
createdAt: "2026-04-01T10:45:30Z"
updatedAt: "2026-04-01T11:20:00Z"
completedAt: null
github:
  number: 42
  url: "https://github.com/org/repo/issues/42"
  state: open
git:
  branch: "ai-task/tr-20260401-104530-a3f9"
  baseBranch: "main"
---

## 原始需求

实现一个基于 JWT 的用户认证系统，包含登录、注册功能。

## AI 分析

### 复杂度: medium
### 预估工时: 4-6 小时

### 影响范围
- `src/auth/*.ts`
- `src/middleware/auth.ts`

## 执行计划

1. 创建数据库模型
2. 实现 JWT 工具
3. 实现登录 API
4. 编写测试

## 子任务

- [x] 1. 创建数据库模型
- [x] 2. 实现 JWT 工具
- [ ] 3. 实现登录 API
- [ ] 4. 编写测试

## 执行笔记

### 2026-04-01 11:00
完成了数据库模型设计，使用 Prisma。

### 2026-04-01 11:20
JWT 工具实现完成，使用 jsonwebtoken 库。
```

### 关键字段说明

| 字段 | 说明 | 示例 |
|------|------|------|
| `id` | 任务唯一 ID | `tr-20260401-104530-a3f9` |
| `status` | 任务状态 | `draft`, `in_progress`, `completed` |
| `github.number` | GitHub Issue 号 | `42` |
| `git.branch` | Git 分支名 | `ai-task/tr-20260401-104530-a3f9` |
| `subTasks` | 子任务列表 | `- [ ] 任务内容` |

## 与用户交互的工作流

### 场景 1: 用户有需求，需要创建任务

用户: "帮我创建一个任务，实现用户认证功能"

你的操作:
1. 询问关键信息（优先级、标签等）
2. 生成任务内容（分析、规划、子任务）
3. 运行初始化脚本:
   ```bash
   ./scripts/task-init.sh --title "实现用户认证功能" --labels "feature,auth"
   ```
4. 告诉用户任务已创建，包括：
   - Issue 链接
   - 分支名
   - 任务文件路径

### 场景 2: 用户要求执行任务

用户: "执行 tasks/active/tr-xxx.md 这个任务"

你的操作:
1. 读取任务文件
2. 检查当前状态
3. 找到第一个未完成的子任务
4. 执行任务
5. 更新子任务状态为完成 `[x]`
6. 更新 `updatedAt` 时间
7. 记录执行笔记（可选）
8. 保存文件

### 场景 3: 用户说任务完成了

用户: "这个任务完成了，帮我提交"

你的操作:
1. 确认所有子任务已标记完成
2. 检查代码变更
3. 运行完成脚本:
   ```bash
   ./scripts/task-complete.sh --id tr-xxx
   ```
4. 告知用户提交结果

## 注意事项

### 执行子任务时的原则

1. **顺序执行** - 按子任务列表顺序执行
2. **状态更新** - 完成后立即更新 `[ ]` → `[x]`
3. **依赖检查** - 如果子任务有依赖，确保前置任务已完成
4. **失败处理** - 如果子任务失败，暂停并询问用户

### 需要人工确认的操作

以下操作在执行前需询问用户：
- 删除文件或目录
- 修改配置文件（package.json, .env 等）
- 安装新的依赖包
- 执行数据库迁移
- 修改公共 API 接口
- 涉及权限或安全的修改

### 文件修改规范

修改任务文件时：
1. 保持 YAML frontmatter 格式正确
2. 使用 ISO 8601 格式的时间戳
3. 子任务列表保持 `- [ ]` 或 `- [x]` 格式
4. 执行笔记按时间倒序添加

## 故障排除

### gh CLI 未登录

```
Error: Could not resolve to a Repository with the name 'xxx/xxx'.
```

解决：运行 `gh auth login` 登录

### 分支已存在

```
Error: A branch named 'ai-task/xxx' already exists.
```

解决：询问用户是否切换到已有分支，或使用 `--force` 覆盖

### Issue 创建失败

检查：
- 是否有仓库写入权限
- 标签是否存在（脚本会自动创建不存在的标签）

## 参考资料

- [task-format.md](references/task-format.md) - 任务文件完整格式规范
- [examples/](examples/) - 示例任务文件
