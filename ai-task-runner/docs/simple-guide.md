# 简化版使用指南

## 概述

简化版是一个**零依赖**的解决方案，只需要 `gh` CLI 和 `git` 即可使用。

适合场景：
- 快速尝试 AI Task Runner
- 个人项目
- 不熟悉 Node.js 的用户
- 只需要 Kimi CLI 集成

## 安装

### 1. 复制文件

将 `simple/` 目录复制到你的项目中：

```bash
# 方式 1: 直接复制
cp -r ai-task-runner/simple ./my-project/.kimi-skills/task-runner

# 方式 2: 使用 subtree (可选)
git subtree add --prefix=.kimi-skills/task-runner \
  https://github.com/your-org/ai-task-runner.git main --squash
```

### 2. 前置依赖

确保已安装：

```bash
# 检查 gh CLI
gh --version
gh auth status  # 确保已登录

# 检查 git
git --version
```

### 3. 配置 Kimi CLI

在 Kimi CLI 中加载 Skill：

```bash
# 启动时指定
kimi --skills ./.kimi-skills/task-runner

# 或添加到配置
# ~/.config/kimi/settings.json
{
  "skills": ["./.kimi-skills/task-runner"]
}
```

## 目录结构

```
.kimi-skills/task-runner/
├── SKILL.md              # Kimi Skill 定义
├── scripts/              # 可执行脚本
│   ├── task-init.sh      # 初始化任务
│   ├── task-sync.sh      # 同步状态
│   └── task-complete.sh  # 完成任务
├── references/           # 参考文档
│   └── task-format.md    # 任务格式规范
└── examples/             # 示例任务
    └── example-task.md
```

## 使用流程

### 1. 初始化新任务

在 Kimi CLI 中：

```
用户: 创建一个任务，实现用户登录功能

Kimi: 我来帮你创建这个任务。

[AI 生成任务分析和计划]

Kimi: 正在初始化任务...

```bash
./scripts/task-init.sh \
  --title "实现用户登录功能" \
  --labels "feature,auth" \
  --priority high
```

✅ 任务已创建:
   ID: tr-20260401-143022-a3f9
   Issue: #42 https://github.com/...
   分支: ai-task/tr-20260401-143022-a3f9
   文件: ./tasks/active/tr-20260401-143022-a3f9.md
```

### 2. 查看任务文件

生成的任务文件示例：

```markdown
---
id: "tr-20260401-143022-a3f9"
meta:
  title: "实现用户登录功能"
  priority: high
  labels: ["feature", "auth"]
status: draft
github:
  number: 42
  url: "https://github.com/..."
  state: open
git:
  branch: "ai-task/tr-20260401-143022-a3f9"
---

## 原始需求

实现用户登录功能

## 子任务

- [ ] 1. 创建登录页面
- [ ] 2. 实现登录 API
- [ ] 3. 添加表单验证
- [ ] 4. 编写测试
```

### 3. 执行任务

```
用户: 执行任务 tr-20260401-143022-a3f9

Kimi: 我来执行这个任务。

[切换到任务分支 ai-task/tr-20260401-143022-a3f9]

▶ 执行子任务: 创建登录页面
✓ 完成

▶ 执行子任务: 实现登录 API  
✓ 完成

...

所有子任务已完成！
```

Kimi 会：
1. 读取任务文件
2. 切换到对应分支
3. 按顺序执行子任务
4. 更新任务状态

### 4. 完成任务

```
用户: 任务完成了，帮我提交

Kimi: 正在完成任务...

```bash
./scripts/task-complete.sh --id tr-20260401-143022-a3f9
```

✅ 任务已完成:
   - 代码已提交
   - Issue #42 已关闭
   - 任务已归档
```

## 脚本使用说明

### task-init.sh

**用途**: 初始化新任务

**语法**:
```bash
task-init.sh --title "标题" [选项]
```

**选项**:
- `-t, --title TITLE` - 任务标题（必需）
- `-f, --file FILE` - 从文件读取描述
- `-l, --labels LABELS` - 标签，逗号分隔
- `-p, --priority PRIORITY` - 优先级
- `-d, --description DESC` - 描述

**示例**:
```bash
# 基本用法
./scripts/task-init.sh --title "实现登录功能"

# 完整参数
./scripts/task-init.sh \
  --title "修复 Bug" \
  --description "修复用户反馈的问题" \
  --labels "bug,urgent" \
  --priority critical
```

### task-sync.sh

**用途**: 同步任务状态

**语法**:
```bash
task-sync.sh [任务ID] [选项]
```

**选项**:
- `-a, --all` - 同步所有任务
- `-s, --status STATUS` - 过滤状态
- `-v, --verbose` - 详细输出

**示例**:
```bash
# 同步单个任务
./scripts/task-sync.sh tr-20260401-143022-a3f9

# 同步所有任务
./scripts/task-sync.sh --all

# 只显示已关闭的
./scripts/task-sync.sh --all --status closed
```

### task-complete.sh

**用途**: 完成任务

**语法**:
```bash
task-complete.sh --id TASK_ID [选项]
```

**选项**:
- `-i, --id ID` - 任务ID（必需）
- `-m, --message MSG` - 提交信息
- `-p, --push` - 推送到远程
- `-f, --force` - 强制完成
- `-d, --dry-run` - 试运行

**示例**:
```bash
# 基本用法
./scripts/task-complete.sh --id tr-20260401-143022-a3f9

# 自定义提交信息并推送
./scripts/task-complete.sh \
  --id tr-20260401-143022-a3f9 \
  --message "feat: 完成用户登录功能" \
  --push
```

## 自定义配置

### 修改默认配置

编辑脚本中的配置变量：

```bash
# task-init.sh
TASKS_DIR="${TASKS_DIR:-./tasks}"  # 任务目录
LABELS="ai-task"                    # 默认标签

# task-complete.sh
AUTO_PUSH="${AUTO_PUSH:-false}"     # 自动推送
```

或使用环境变量：

```bash
export TASKS_DIR="./my-tasks"
export AUTO_PUSH="true"
```

### 自定义提交信息模板

修改 `task-complete.sh` 中的 `generateCommitMessage` 函数：

```bash
generateCommitMessage() {
  local task_id="$1"
  local title="$2"
  echo "custom-prefix: [${task_id}] ${title}"
}
```

## 故障排除

### Issue 创建失败

```
Error: Could not resolve to a Repository...
```

解决：
```bash
# 1. 检查 gh 登录状态
gh auth status

# 2. 重新登录
gh auth login

# 3. 确保在 Git 仓库目录中
git remote -v
```

### 分支创建失败

```
Error: A branch named '...' already exists
```

解决：
```bash
# 手动切换到已有分支
git checkout ai-task/tr-xxx

# 或删除旧分支（谨慎）
git branch -D ai-task/tr-xxx
```

### 权限不足

```
Error: Resource not accessible by personal access token
```

解决：
1. 检查 Token 权限：需要 `repo` 和 `workflow` 权限
2. 对于私有仓库，确保 Token 有访问权限

## 最佳实践

### 1. 任务粒度

- 每个任务应该是**一个完整的功能**
- 子任务数量控制在 **5-10 个**
- 每个子任务应该**在 30-60 分钟内完成**

### 2. 分支管理

- 始终在工作分支上开发：`ai-task/{id}`
- 完成后删除远程分支（可选）
- 定期同步主分支代码

### 3. Issue 使用

- 使用标签区分任务类型：`feature`, `bug`, `refactor`
- 添加适当的优先级标签
- 在 Issue 中记录关键决策

### 4. 文件管理

- 定期归档已完成的任务
- 保留任务历史用于复盘
- 不要手动修改任务 ID

## 进阶用法

### 批量创建任务

```bash
# tasks.txt 内容：
# 实现登录功能
# 实现注册功能
# 实现密码重置

cat tasks.txt | while read title; do
  ./scripts/task-init.sh --title "$title" --labels "feature"
done
```

### 与 CI/CD 集成

```yaml
# .github/workflows/task-sync.yml
name: Sync Tasks
on:
  schedule:
    - cron: '0 */6 * * *'  # 每6小时
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/task-sync.sh --all
```

### 自定义 Hook

在脚本中添加自定义逻辑：

```bash
# task-complete.sh

# 在提交前运行测试
run_tests() {
  if [ -f "package.json" ]; then
    npm test
  fi
}

# 在关闭 Issue 后发送通知
send_notification() {
  local task_id="$1"
  # 调用 Slack API 或其他通知服务
}
```
