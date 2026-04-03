# 高级使用示例

## 场景 1: 批量任务管理

### 批量创建任务

```bash
#!/bin/bash
# batch-create.sh

tasks=(
  "实现用户注册"
  "实现用户登录"
  "实现密码重置"
  "实现邮箱验证"
)

for title in "${tasks[@]}"; do
  echo "创建任务: $title"
  task init "$title" --labels "feature,auth"
  sleep 1  # 避免 ID 冲突
done
```

### 批量完成任务

```bash
#!/bin/bash
# batch-complete.sh

# 获取所有进行中的任务
task list --status in_progress --json | \
  jq -r '.[].id' | \
  while read task_id; do
    echo "完成任务: $task_id"
    task complete "$task_id" --push
  done
```

## 场景 2: CI/CD 集成

### GitHub Actions - 自动同步

```yaml
# .github/workflows/task-sync.yml
name: Task Sync
on:
  schedule:
    - cron: '0 */6 * * *'  # 每6小时
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install AI Task Runner
        run: npm install -g @innate/ai-task-runner
      
      - name: Sync tasks
        run: task sync --all
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### GitHub Actions - 自动创建任务

```yaml
# .github/workflows/task-from-issue.yml
name: Task from Issue
on:
  issues:
    types: [labeled]

jobs:
  create-task:
    if: github.event.label.name == 'ai-task'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install AI Task Runner
        run: npm install -g @innate/ai-task-runner
      
      - name: Create task
        run: |
          task init "${{ github.event.issue.title }}" \
            --description "${{ github.event.issue.body }}" \
            --labels "ai-task,${{ join(github.event.issue.labels.*.name, ',') }}"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 场景 3: 编程 API 集成

### 自定义 AI 分析

```typescript
// custom-analyzer.ts
import { TaskRunner, LocalStorage, type Task } from '@innate/ai-task-core';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeTask(task: Task) {
  const runner = new TaskRunner({
    storage: new LocalStorage(),
  });

  const analyzedTask = await runner.analyze(task, async (t) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个技术专家，分析任务复杂度并提供建议。',
        },
        {
          role: 'user',
          content: `分析这个任务:\n${t.meta.title}\n${t.meta.description}`,
        },
      ],
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    return {
      complexity: analysis.complexity,
      estimatedHours: analysis.estimatedHours,
      scope: analysis.scope,
      risks: analysis.risks,
    };
  });

  console.log('分析完成:', analyzedTask.analysis);
}
```

### 自定义存储适配器

```typescript
// database-storage.ts
import { StorageAdapter, type Task } from '@innate/ai-task-core';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DatabaseStorage implements StorageAdapter {
  async save(task: Task): Promise<void> {
    await prisma.task.upsert({
      where: { id: task.id },
      update: {
        title: task.meta.title,
        description: task.meta.description,
        status: task.status,
        updatedAt: new Date(),
        data: JSON.stringify(task),
      },
      create: {
        id: task.id,
        title: task.meta.title,
        description: task.meta.description,
        status: task.status,
        createdAt: new Date(),
        updatedAt: new Date(),
        data: JSON.stringify(task),
      },
    });
  }

  async load(taskId: string): Promise<Task | null> {
    const record = await prisma.task.findUnique({
      where: { id: taskId },
    });

    return record ? JSON.parse(record.data) : null;
  }

  async list(filters?: ListFilters): Promise<Task[]> {
    const records = await prisma.task.findMany({
      where: {
        status: filters?.status,
      },
      orderBy: { createdAt: 'desc' },
    });

    return records.map(r => JSON.parse(r.data));
  }

  async archive(taskId: string): Promise<void> {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'archived',
        archivedAt: new Date(),
      },
    });
  }
}
```

## 场景 4: MCP 高级配置

### Claude Code 配置

```json
// claude-mcp-config.json
{
  "mcpServers": {
    "task-runner": {
      "command": "npx",
      "args": ["-y", "@innate/ai-task-mcp"],
      "env": {
        "TASK_STORAGE_PATH": "./tasks",
        "NODE_ENV": "production"
      }
    }
  }
}
```

### 自定义 MCP 工具

```typescript
// custom-mcp-server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { TaskRunner, LocalStorage } from '@innate/ai-task-core';

const server = new Server({
  name: 'custom-task-runner',
  version: '1.0.0',
});

// 添加自定义工具
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case 'analyze_code':
      // 自定义代码分析工具
      return analyzeCode(request.params.arguments);
    
    case 'generate_tests':
      // 自定义测试生成工具
      return generateTests(request.params.arguments);
    
    default:
      // 调用默认的 task runner 工具
      return defaultHandler(request);
  }
});
```

## 场景 5: 任务模板系统

### 创建模板

```bash
# templates/feature.md
cat > templates/feature.md << 'EOF'
---
meta:
  priority: medium
  labels: ["feature"]
---

## AI 分析

### 复杂度评估
**等级**: medium
**预估工时**: 4-6 小时

### 影响范围
**文件**: 
**模块**: 

### 风险评估

## 执行计划

### 方案概述

### 实施步骤
1. 
2. 
3. 

### 测试策略

## 子任务

- [ ] 1. 
- [ ] 2. 
- [ ] 3. 
EOF
```

### 使用模板

```bash
#!/bin/bash
# create-from-template.sh

TEMPLATE=$1
TITLE=$2

# 创建任务
task init "$TITLE"

# 获取最新任务 ID
TASK_ID=$(task list --status draft --json | jq -r '.[0].id')

# 合并模板内容
cat templates/$TEMPLATE.md >> "./tasks/active/$TASK_ID.md"

echo "任务已创建: $TASK_ID"
```

## 场景 6: 任务报告生成

### 生成周报

```bash
#!/bin/bash
# weekly-report.sh

START_DATE=$(date -d '7 days ago' +%Y-%m-%d)
END_DATE=$(date +%Y-%m-%d)

echo "# 任务周报 ($START_DATE ~ $END_DATE)"
echo ""

echo "## 已完成任务"
task list --status completed --json | \
  jq -r '.[] | select(.completedAt >= "'$START_DATE'") | 
    "- " + .meta.title + " (" + .id + ")"'

echo ""
echo "## 进行中任务"
task list --status in_progress --json | \
  jq -r '.[] | "- " + .meta.title + " (" + .id + ")"'

echo ""
echo "## 统计数据"
echo "- 本周完成: $(task list --status completed --json | jq length)"
echo "- 进行中: $(task list --status in_progress --json | jq length)"
echo "- 待开始: $(task list --status draft --json | jq length)"
```

## 场景 7: 多仓库管理

### 统一管理脚本

```bash
#!/bin/bash
# multi-repo.sh

REPOS=(
  "~/projects/frontend"
  "~/projects/backend"
  "~/projects/mobile"
)

COMMAND=$1
shift

for repo in "${REPOS[@]}"; do
  echo "=== $repo ==="
  cd "$repo" || continue
  
  case $COMMAND in
    list)
      task list
      ;;
    sync)
      task sync --all
      ;;
    report)
      task list --json | jq -r '.[] | "\(.id): \(.meta.title)"'
      ;;
  esac
  
  echo ""
done
```

### 使用

```bash
./multi-repo.sh list   # 列出所有仓库的任务
./multi-repo.sh sync   # 同步所有仓库的任务状态
```
