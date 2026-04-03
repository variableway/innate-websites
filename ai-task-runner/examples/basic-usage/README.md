# 基础使用示例

## 场景 1: 快速创建任务

### 简化版

```bash
# 1. 进入你的项目
cd my-project

# 2. 复制简化版
mkdir -p .kimi-skills
cp -r /path/to/ai-task-runner/simple .kimi-skills/task-runner

# 3. 创建任务
.kimi-skills/task-runner/scripts/task-init.sh \
  --title "修复登录 Bug" \
  --priority high \
  --labels "bug,auth"

# 输出:
# ✅ 任务已初始化
#    Issue: #42
#    分支: ai-task/tr-20260401-143022-a3f9
#    文件: ./tasks/active/tr-20260401-143022-a3f9.md
```

### 完整版

```bash
# 1. 安装
npm install -g @innate/ai-task-runner

# 2. 初始化配置
task init

# 3. 创建任务
task init "修复登录 Bug" --priority high --labels "bug,auth"
```

## 场景 2: 在 Kimi CLI 中使用

```
用户: 帮我执行 tasks/active/tr-xxx.md 这个任务

Kimi: 我来执行这个任务。

正在读取任务文件...
任务: 实现用户登录功能
状态: in_progress
子任务: 2/6 完成

下一个子任务: 实现登录 API
确认执行? (Y/n) Y

✓ 子任务完成: 实现登录 API
任务状态已更新

下一个子任务: 添加表单验证
...
```

## 场景 3: 查看任务状态

### 简化版
```bash
# 查看单个任务
cat tasks/active/tr-xxx.md

# 列出所有任务
ls -la tasks/active/
```

### 完整版
```bash
# 查看详情
task status tr-xxx

# 列表
task list

# 过滤
task list --status in_progress
task list --priority high
```

## 场景 4: 完成任务

### 简化版
```bash
# 完成任务
.kimi-skills/task-runner/scripts/task-complete.sh --id tr-xxx

# 输出:
# ✅ 任务完成
#    Issue: #42 已关闭
#    代码已提交
#    任务已归档
```

### 完整版
```bash
# 完成任务
task complete tr-xxx

# 推送并关闭
task complete tr-xxx --push
```

## 完整工作流示例

```bash
#!/bin/bash
# 完整的工作流示例

# 1. 创建任务
./scripts/task-init.sh --title "添加黑暗模式" --labels "feature,ui"

# 2. 切换到分支
git checkout ai-task/tr-xxx

# 3. 开发代码
# ... 编辑代码 ...

# 4. 更新任务状态
# 编辑 tasks/active/tr-xxx.md，标记子任务完成

# 5. 完成任务
./scripts/task-complete.sh --id tr-xxx --push

echo "任务完成！"
```
