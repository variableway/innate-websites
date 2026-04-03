# 完整版使用指南

## 概述

完整版提供企业级的任务管理能力，支持 CLI、MCP、Programmatic API 三种使用方式。

## 安装

### 全局安装

```bash
npm install -g @innate/ai-task-runner
# 或
pnpm add -g @innate/ai-task-runner
# 或
yarn global add @innate/ai-task-runner
```

### 项目安装

```bash
npm install --save-dev @innate/ai-task-runner
```

### 从源码构建

```bash
git clone https://github.com/your-org/ai-task-runner.git
cd ai-task-runner
pnpm install
pnpm build
```

## 快速开始

### 1. 初始化配置

```bash
task init
```

这会创建一个 `task.config.json` 文件：

```json
{
  "version": "1.0.0",
  "github": {
    "owner": "your-org",
    "repo": "your-repo",
    "autoCreateIssue": true,
    "autoCloseIssue": true,
    "issueLabels": ["ai-task"]
  },
  "git": {
    "baseBranch": "main",
    "branchPrefix": "ai-task/",
    "autoCreateBranch": true,
    "autoCommit": true,
    "autoPush": false
  },
  "storage": {
    "basePath": "./tasks",
    "archiveCompleted": true
  }
}
```

### 2. 创建第一个任务

```bash
# 交互式创建
task init "实现用户登录功能"

# 或完整参数
task init "实现用户登录功能" \
  --description "添加邮箱密码登录功能" \
  --priority high \
  --labels "feature,auth"
```

### 3. 查看任务

```bash
# 列表
task list

# 详情
task status tr-20260401-143022-a3f9
```

### 4. 执行任务

```bash
# 手动执行
task run tr-20260401-143022-a3f9

# 自动执行所有子任务
task run tr-20260401-143022-a3f9 --auto

# 试运行
task run tr-20260401-143022-a3f9 --dry-run
```

### 5. 完成任务

```bash
# 基本用法
task complete tr-20260401-143022-a3f9

# 推送并关闭
task complete tr-20260401-143022-a3f9 --push

# 自定义提交信息
task complete tr-20260401-143022-a3f9 \
  --message "feat(auth): 完成用户登录功能"
```

## CLI 命令参考

### task init - 初始化任务

```bash
task init [标题] [选项]

选项:
  -d, --description <desc>   任务描述
  -p, --priority <level>     优先级: low, medium, high, critical
  -l, --labels <labels>      标签，逗号分隔
  --skip-issue               跳过创建 GitHub Issue
  --skip-branch              跳过创建 Git 分支
```

### task run - 运行任务

```bash
task run <任务ID或文件> [选项]

选项:
  -a, --auto                 自动执行所有子任务
  -d, --dry-run              试运行模式
  --skip-issue               跳过 Issue 操作
  --skip-branch              跳过分支操作
```

### task list - 列出任务

```bash
task list [选项]

选项:
  -s, --status <status>      状态过滤
  -p, --priority <priority>  优先级过滤
  -l, --label <label>        标签过滤
  --json                     JSON 格式输出
```

### task status - 查看状态

```bash
task status <任务ID>
```

### task sync - 同步状态

```bash
task sync [任务ID] [选项]

选项:
  -a, --all                  同步所有任务
  --from-github              从 GitHub 同步
```

### task complete - 完成任务

```bash
task complete <任务ID> [选项]

选项:
  -m, --message <msg>        提交信息
  -p, --push                 推送到远程
  -f, --force                强制完成
```

## MCP 集成

### 什么是 MCP

MCP (Model Context Protocol) 是一个开放协议，让 AI 工具可以标准化地访问上下文。

### Claude Code 配置

1. 安装 MCP Server：

```bash
npm install -g @innate/ai-task-mcp
```

2. 配置 Claude Code：

创建 `claude-mcp-config.json`：

```json
{
  "mcpServers": {
    "task-runner": {
      "command": "ai-task-mcp",
      "env": {
        "TASK_STORAGE_PATH": "./tasks"
      }
    }
  }
}
```

3. 启动 Claude Code：

```bash
claude --mcp-config claude-mcp-config.json
```

### MCP 工具列表

Claude 可以使用以下工具：

- `create_task` - 创建新任务
- `get_task` - 获取任务详情
- `list_tasks` - 列出任务
- `update_task_status` - 更新任务状态
- `update_subtask_status` - 更新子任务状态
- `complete_task` - 完成任务

### MCP 使用示例

在 Claude Code 中：

```
用户: 创建一个任务实现用户登录

Claude: 我来为你创建这个任务。

[调用 create_task]

Claude: 任务已创建！
ID: tr-20260401-151022-b7d2
标题: 实现用户登录

你可以通过以下方式跟踪进度：
- 任务文件: ./tasks/active/tr-20260401-151022-b7d2.md
- GitHub Issue: #43
- 分支: ai-task/tr-20260401-151022-b7d2

需要我开始执行这个任务吗？
```

## 编程 API

### 基本用法

```typescript
import { 
  TaskRunner, 
  LocalStorage, 
  GitClient, 
  GitHubClient 
} from '@innate/ai-task-core';

// 初始化
const storage = new LocalStorage({ basePath: './tasks' });
await storage.initialize();

const runner = new TaskRunner({ storage });

// 创建任务
const task = TaskRunner.create({
  title: '实现登录功能',
  description: '添加用户登录',
  priority: 'high',
  labels: ['feature', 'auth'],
});

// 保存
await storage.save(task);

// 分析（需要 AI 服务）
const analyzedTask = await runner.analyze(task, async (t) => {
  // 调用你的 AI 服务
  return {
    complexity: 'medium',
    estimatedHours: 4,
    scope: {
      files: ['src/auth.ts'],
      modules: ['auth'],
    },
    risks: [],
  };
});

// 生成计划
const plannedTask = await runner.plan(analyzedTask, async (t) => {
  return {
    approach: '使用 JWT',
    steps: [
      { id: '1', title: '创建模型', order: 1 },
      { id: '2', title: '实现 API', order: 2 },
    ],
  };
});

// 执行
await runner.execute(plannedTask, async (subTask) => {
  console.log('执行:', subTask.title);
  // 执行子任务
  return { success: true, subTaskId: subTask.id, duration: 1000 };
});
```

### 自定义存储适配器

```typescript
import { StorageAdapter } from '@innate/ai-task-core';

class DatabaseStorage implements StorageAdapter {
  async save(task: Task): Promise<void> {
    await db.tasks.upsert({
      where: { id: task.id },
      update: task,
      create: task,
    });
  }

  async load(taskId: string): Promise<Task | null> {
    return db.tasks.findUnique({ where: { id: taskId } });
  }

  // ...
}
```

## 配置详解

### 完整配置示例

```json
{
  "$schema": "https://innate.dev/schemas/task-config.json",
  "version": "1.0.0",

  "project": {
    "name": "my-project",
    "type": "monorepo",
    "root": "."
  },

  "ai": {
    "provider": "openai",
    "model": "gpt-4-turbo",
    "temperature": 0.2,
    "autoAnalyze": true,
    "autoExecute": false,
    "requireApprovalFor": [
      "delete",
      "install-deps",
      "database-migration"
    ]
  },

  "github": {
    "owner": "your-org",
    "repo": "your-repo",
    "token": "${GITHUB_TOKEN}",
    "autoCreateIssue": true,
    "autoCloseIssue": true,
    "issueLabels": ["ai-task"],
    "issueTemplate": "./templates/issue.md"
  },

  "git": {
    "baseBranch": "main",
    "branchPrefix": "ai-task/",
    "autoCreateBranch": true,
    "autoCommit": true,
    "commitMessageTemplate": "{type}: [{id}] {title}",
    "autoPush": false,
    "autoMerge": false
  },

  "storage": {
    "type": "local",
    "basePath": "./tasks",
    "archiveCompleted": true
  }
}
```

### 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `GITHUB_TOKEN` | GitHub Token | `ghp_xxx` |
| `OPENAI_API_KEY` | OpenAI API Key | `sk-xxx` |
| `TASK_STORAGE_PATH` | 任务存储路径 | `./tasks` |
| `TASK_CONFIG_PATH` | 配置文件路径 | `./task.config.json` |

## 高级用法

### 批量操作

```bash
# 批量创建
cat tasks.txt | xargs -I {} task init "{}"

# 批量完成
task list --status in_progress --json | \
  jq -r '.[].id' | \
  xargs -I {} task complete {}
```

### 与 Git Hooks 集成

```bash
# .git/hooks/pre-commit
#!/bin/bash
# 提交前检查是否有未完成的任务

TASK_ID=$(git branch --show-current | grep -o 'tr-[0-9]*-[0-9]*-[a-z0-9]*')

if [ -n "$TASK_ID" ]; then
  task status "$TASK_ID"
fi
```

### CI/CD 集成

```yaml
# .github/workflows/task-automation.yml
name: Task Automation
on:
  issues:
    types: [closed]

jobs:
  complete:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install -g @innate/ai-task-runner
      - run: task sync --all
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 故障排除

### 安装失败

```bash
# 检查 Node.js 版本
node --version  # 需要 >= 18

# 清除缓存
npm cache clean --force
```

### 权限错误

```bash
# macOS/Linux
sudo chown -R $(whoami) $(npm config get prefix)/lib/node_modules

# Windows (管理员 PowerShell)
# 不需要特殊权限
```

### MCP 连接失败

```bash
# 检查 MCP Server 是否正常
ai-task-mcp

# 检查配置
cat ~/.claude/mcp-config.json
```

## 最佳实践

### 1. 项目结构

```
my-project/
├── src/                    # 源代码
├── tasks/                  # 任务目录
│   ├── active/             # 进行中
│   └── archive/            # 已完成
├── task.config.json        # 配置
└── package.json
```

### 2. 任务命名

- 使用动词开头：`实现...`, `修复...`, `添加...`
- 简洁明了，不超过 100 字符
- 包含关键信息：`实现用户登录功能（JWT）`

### 3. 标签策略

```
类型: feature, bug, refactor, docs, test
模块: auth, api, ui, db, core
优先级: p0-critical, p1-high, p2-medium, p3-low
```

### 4. 提交规范

```
feat(auth): [tr-xxx] 实现用户登录

- 添加 JWT 认证
- 实现登录 API
- 添加测试
```

## 迁移指南

### 从简化版迁移

1. 安装完整版：
```bash
npm install -g @innate/ai-task-runner
```

2. 任务文件完全兼容，直接使用：
```bash
task list
task run tr-xxx
```

3. 可选：创建配置文件：
```bash
task init
```

### 降级到简化版

1. 复制简化版文件到项目
2. 任务文件格式不变
3. 使用脚本操作：`./scripts/task-*.sh`
