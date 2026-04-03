# 任务文件格式规范

## 概述

任务文件使用 Markdown 格式，包含 YAML frontmatter 用于存储结构化元数据。

## 文件结构

```markdown
---
[YAML frontmatter - 元数据]
---

[Markdown 内容 - 任务详情]
```

## YAML Frontmatter 规范

### 完整字段列表

```yaml
---
# 必需字段
id: "tr-{timestamp}-{hash}"           # 任务唯一 ID
meta:
  title: "任务标题"                    # 简短标题（必需）
  description: "任务描述"              # 详细描述
  priority: medium                      # 优先级: low, medium, high, critical
  labels: ["feature", "backend"]       # GitHub 标签列表
status: draft                         # 任务状态
createdAt: "2026-04-01T10:00:00Z"    # 创建时间 (ISO 8601)
updatedAt: "2026-04-01T10:00:00Z"    # 更新时间 (ISO 8601)
completedAt: null                     # 完成时间 (ISO 8601 或 null)

# GitHub 集成字段
github:
  number: 42                          # Issue 编号
  url: "https://github.com/..."       # Issue URL
  state: open                         # Issue 状态: open, closed

# Git 集成字段
git:
  branch: "ai-task/tr-xxx"            # 功能分支名
  baseBranch: "main"                  # 基础分支
---
```

### 字段详细说明

#### `id`
- **类型**: string
- **格式**: `tr-{timestamp}-{random}`
- **示例**: `tr-20260401-104530-a3f9`
- **说明**: 全局唯一标识符，生成后不可修改

#### `meta.title`
- **类型**: string
- **限制**: 建议不超过 100 个字符
- **示例**: "实现用户认证功能"
- **说明**: 任务标题，会用于 GitHub Issue 标题

#### `meta.priority`
- **类型**: string
- **可选值**: `low`, `medium`, `high`, `critical`
- **默认**: `medium`
- **说明**: 任务优先级，用于排序和过滤

#### `meta.labels`
- **类型**: string[]
- **示例**: `["feature", "auth", "backend"]`
- **说明**: GitHub 标签，会自动应用到 Issue

#### `status`
- **类型**: string
- **可选值**:
  - `draft` - 草稿，刚创建
  - `analyzing` - AI 分析中
  - `planned` - 计划已生成，等待执行
  - `in_progress` - 执行中
  - `review_needed` - 需要人工审核
  - `completed` - 已完成
  - `failed` - 执行失败
  - `cancelled` - 已取消

#### 时间字段
- **格式**: ISO 8601 UTC 格式
- **示例**: `"2026-04-01T10:00:00Z"`
- **生成**: 使用 `date -u +"%Y-%m-%dT%H:%M:%SZ"`

## Markdown 内容规范

### 推荐章节结构

```markdown
## 原始需求

用户原始需求描述，保持原话或精炼描述。

## AI 分析

### 复杂度评估
描述任务复杂度等级和预估工时。

### 影响范围
列出影响的文件、模块、API。

### 风险评估
列出潜在风险和缓解措施。

## 执行计划

### 方案概述
描述选定的解决方案。

### 备选方案
描述考虑过的其他方案及放弃原因。

### 实施步骤
详细的分步实施计划。

### 测试策略
如何测试该功能。

## 子任务

- [ ] 1. 子任务 1
- [ ] 2. 子任务 2
- [ ] 3. 子任务 3

## 执行笔记

### 2026-04-01 10:00 - 笔记标题
详细执行记录...
```

### 子任务格式

子任务使用 GitHub Flavored Markdown 的任务列表格式：

```markdown
- [ ] 1. 未完成的任务
- [x] 2. 已完成的任务
- [ ] 3. 待开始的任务
```

**规则**:
- 必须包含序号（用于排序）
- 使用 `[ ]` 表示未完成
- 使用 `[x]` 表示已完成
- 序号后可以添加执行者（可选）：`- [ ] 1. @username 任务内容`

### 执行笔记格式

执行笔记按时间倒序排列，使用三级标题：

```markdown
### {YYYY-MM-DD HH:MM} - {简短描述}

详细内容...

#### 遇到的问题
- 问题 1
- 问题 2

#### 解决方案
- 方案 1
- 方案 2

#### 代码片段
```typescript
// 示例代码
```
```

## 示例文件

### 最小化示例

```markdown
---
id: "tr-20260401-100000-abc1"
meta:
  title: "简单任务"
status: draft
createdAt: "2026-04-01T10:00:00Z"
updatedAt: "2026-04-01T10:00:00Z"
github:
  number: 1
  state: open
git:
  branch: "ai-task/tr-20260401-100000-abc1"
---

## 原始需求

实现一个简单功能。

## 子任务

- [ ] 1. 实现功能
- [ ] 2. 编写测试
```

### 完整示例

参考 [example-task.md](../examples/example-task.md)

## 验证工具

可以使用以下命令验证任务文件格式：

```bash
# 检查 YAML frontmatter
sed -n '/^---$/,/^---$/p' task-file.md

# 检查任务 ID 格式
grep "^id:" task-file.md | grep -E "tr-[0-9]{8}-[0-9]{6}-[a-z0-9]{4}"

# 检查子任务格式
grep -E "^- \[[ x]\]" task-file.md
```

## 版本兼容性

- **v1.0**: 当前版本
- 向后兼容保证：新增字段不会破坏旧版本解析
