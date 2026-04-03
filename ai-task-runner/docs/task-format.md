# 任务文件格式规范

## 概述

任务文件使用 **Markdown + YAML frontmatter** 格式，这是两个版本共同使用的标准格式。

## 文件扩展名

- `.md` - Markdown 格式（主文件）
- `.json` - JSON 元数据（缓存）

## 完整示例

```markdown
---
id: "tr-20260401-104530-a3f9"
meta:
  title: "实现用户认证系统"
  description: "基于 JWT 的用户认证和授权功能"
  priority: high
  labels: ["feature", "auth", "backend"]
  author: "user@example.com"
status: in_progress
createdAt: "2026-04-01T10:45:30Z"
updatedAt: "2026-04-01T14:20:00Z"
completedAt: null
github:
  number: 42
  url: "https://github.com/org/repo/issues/42"
  state: open
git:
  branch: "ai-task/tr-20260401-104530-a3f9"
  baseBranch: "main"
  commits: ["abc123", "def456"]
---

## 原始需求

实现一个完整的用户认证系统...

## AI 分析

### 复杂度评估
**等级**: medium-high
**预估工时**: 6-8 小时

### 影响范围
**文件**: 
- `src/auth/*.ts`
- `src/middleware/auth.ts`

**模块**: auth, user, middleware

### 风险评估
1. **high**: Token 泄露风险
   - **缓解措施**: 实现 Token 黑名单机制

## 执行计划

### 方案概述
采用 JWT 实现无状态认证...

### 备选方案
- **Session + Cookie**: 有状态，不适合分布式（放弃）

### 实施步骤
1. **数据库设计** (45min)
   - 设计 User 表结构
   - 创建迁移

2. **密码工具** (30min)
   - 实现 hashPassword
   - 实现 verifyPassword

### 测试策略
- 单元测试覆盖所有工具函数
- 集成测试覆盖所有 API

## 子任务

- [x] 1. 创建数据库模型
- [x] 2. 实现密码工具
- [ ] 3. 实现 JWT 工具
- [ ] 4. 实现登录 API
- [ ] 5. 实现认证中间件
- [ ] 6. 编写测试

## 执行笔记

### 2026-04-01 11:30 - 数据库设计完成

完成了 Prisma schema 设计...

遇到的问题：
- 最初考虑使用 `cuid`，后改为 `uuid`

### 2026-04-01 12:30 - 密码工具完成

使用 bcrypt 实现...
```

## YAML Frontmatter 规范

### 字段说明

#### `id` (必需)
- **类型**: string
- **格式**: `tr-{YYYYMMDD}-{HHMMSS}-{4位随机hash}`
- **示例**: `tr-20260401-104530-a3f9`
- **说明**: 全局唯一标识符，生成后不可修改

#### `meta` (必需)

**meta.title** (必需)
- 任务标题
- 长度：1-200 字符

**meta.description** (可选)
- 任务描述
- 支持多行

**meta.author** (可选)
- 创建者
- 格式：邮箱或用户名

**meta.labels** (可选)
- 标签列表
- 默认：`[]`

**meta.priority** (可选)
- 优先级
- 可选值：`low`, `medium`, `high`, `critical`
- 默认：`medium`

#### `status` (必需)
- **类型**: string
- **可选值**:
  - `draft` - 草稿
  - `analyzing` - AI 分析中
  - `planned` - 计划已生成
  - `in_progress` - 执行中
  - `review_needed` - 需要审核
  - `completed` - 已完成
  - `failed` - 失败
  - `cancelled` - 已取消

#### 时间字段

**createdAt** (必需)
- 创建时间
- 格式：ISO 8601 UTC
- 示例：`"2026-04-01T10:45:30Z"`

**updatedAt** (必需)
- 更新时间
- 格式：ISO 8601 UTC

**completedAt** (可选)
- 完成时间
- 格式：ISO 8601 UTC
- 未完成时为 `null`

#### `github` (可选)

**github.number** (可选)
- Issue 编号
- 类型：number

**github.url** (可选)
- Issue URL
- 类型：string

**github.state** (可选)
- Issue 状态
- 可选值：`open`, `closed`

#### `git` (可选)

**git.branch** (可选)
- 功能分支名
- 示例：`"ai-task/tr-20260401-104530-a3f9"`

**git.baseBranch** (可选)
- 基础分支
- 示例：`"main"`

**git.commits** (可选)
- 提交记录
- 类型：string[]

**git.pr** (可选)
- PR 信息
  - `number`: PR 编号
  - `url`: PR URL

## Markdown 内容规范

### 章节结构

#### 原始需求

描述用户原始需求，保持原话或精炼描述。

```markdown
## 原始需求

实现一个基于 JWT 的用户认证系统...
```

#### AI 分析

##### 复杂度评估
```markdown
### 复杂度评估
**等级**: medium
**预估工时**: 4-6 小时
```

##### 影响范围
```markdown
### 影响范围

**文件**: 
- `src/auth.ts`
- `src/middleware/auth.ts`

**模块**: auth, middleware

**APIs**:
- POST /auth/login
- POST /auth/register
```

##### 风险评估
```markdown
### 风险评估

1. **high**: Token 泄露风险
   - **缓解措施**: 实现 Token 黑名单

2. **medium**: 密码加密性能
   - **缓解措施**: 使用 bcrypt with salt rounds 10
```

#### 执行计划

##### 方案概述
```markdown
### 方案概述

采用 JWT 实现无状态认证：
- Access Token: 短期有效
- Refresh Token: 长期有效
```

##### 备选方案
```markdown
### 备选方案

- **Session + Cookie**: 有状态（放弃）
  - 原因：不适合分布式部署

- **Auth0**: 成本较高（放弃）
  - 原因：增加外部依赖
```

##### 实施步骤
```markdown
### 实施步骤

1. **数据库设计** (45min)
   - 设计 User 表
   - 创建迁移

2. **密码工具** (30min)
   - 实现 hashPassword
   - 实现 verifyPassword
```

##### 测试策略
```markdown
### 测试策略

- 单元测试覆盖所有工具函数
- 集成测试覆盖所有 API
- 使用 Jest + Supertest
```

### 子任务

使用 GFM (GitHub Flavored Markdown) 任务列表格式：

```markdown
## 子任务

- [ ] 1. 未完成的任务
- [x] 2. 已完成的任务
- [ ] 3. 待开始的任务
```

**规则**:
1. 必须包含序号
2. `[ ]` 表示未完成
3. `[x]` 表示已完成
4. 支持嵌套（但不推荐）

### 执行笔记

按时间倒序排列：

```markdown
## 执行笔记

### 2026-04-01 14:00 - 最新进展
最新笔记...

### 2026-04-01 11:30 - 数据库设计
之前的笔记...

### 2026-04-01 10:00 - 任务开始
最旧的笔记...
```

## 最小化示例

```markdown
---
id: "tr-20260401-100000-abc1"
meta:
  title: "简单任务"
status: draft
createdAt: "2026-04-01T10:00:00Z"
updatedAt: "2026-04-01T10:00:00Z"
---

## 原始需求

实现一个简单功能。

## 子任务

- [ ] 1. 实现功能
- [ ] 2. 编写测试
```

## 验证工具

### 检查 YAML 格式

```bash
# 提取 frontmatter
sed -n '/^---$/,/^---$/p' task.md

# 验证 ID 格式
grep "^id:" task.md | grep -E "tr-\d{8}-\d{6}-[a-z0-9]{4}"
```

### 检查子任务格式

```bash
# 检查子任务
grep -E "^- \[[ x]\]" task.md

# 统计完成率
TOTAL=$(grep -cE "^- \[[ x]\]" task.md)
DONE=$(grep -cE "^- \[x\]" task.md)
echo "$DONE / $TOTAL"
```

## 版本兼容性

- **v1.0** - 当前版本
- 向后兼容：新增字段不会破坏旧版本
- 未来扩展：可能增加新的 meta 字段
