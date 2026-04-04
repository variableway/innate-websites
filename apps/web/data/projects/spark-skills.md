# Spark Skills - AI Agent 配置指南

本文档介绍如何为不同的 AI Agent 工具配置和使用 Spark Skills。

## 支持的 AI Agent

本仓库的 Skills 兼容以下 AI Agent 工具：

| Agent | 配置文件位置 | 状态 |
|-------|-------------|------|
| **Claude Code** | `~/.claude/skills/` | ✅ 完全支持 |
| **Kimi CLI** | `~/.kimi/skills/` | ✅ 完全支持 |
| **Codex** | `~/.codex/skills/` | ✅ 完全支持 |
| **OpenCode** | `~/.opencode/skills/` | ✅ 完全支持 |

所有 Skill 均以标准 `SKILL.md` 作为入口文件，Agent 会自动识别并加载。

## 快速设置

### 方式一：使用安装脚本（推荐）

```bash
# 安装所有 skills 到 Claude Code
./install.sh claude-code

# 安装所有 skills 到 Kimi CLI
./install.sh kimi

# 安装所有 skills 到 Codex
./install.sh codex

# 安装所有 skills 到 OpenCode
./install.sh opencode
```

安装脚本会自动：
1. 创建对应 Agent 的 skills 目录
2. 将本仓库中的所有 skill 以符号链接形式安装
3. 跳过已存在的 skill，避免重复创建

### 方式二：手动链接

如果只需要特定 skill，可以手动创建符号链接：

```bash
# Claude Code 示例
ln -s $(pwd)/github-task-workflow ~/.claude/skills/github-task-workflow
ln -s $(pwd)/spark-task-init-skill ~/.claude/skills/spark-task-init

# Kimi CLI 示例
ln -s $(pwd)/github-task-workflow ~/.kimi/skills/github-task-workflow
ln -s $(pwd)/spark-task-init-skill ~/.kimi/skills/spark-task-init
```

### 方式三：项目级配置（一键初始化）

```bash
# 在当前 git 仓库中自动安装 hooks、配置和 skills
bash /path/to/spark-skills/setup-project.sh
```

这会帮你完成：
1. 安装 `post-commit` 和 `prepare-commit-msg` Git hooks
2. 创建 `.github-task-workflow.yaml` 项目配置
3. 创建 `tasks/` 目录和示例 task 文件
4. 创建 `.github/workflows/close-issue-on-merge.yml`
5. 将所有 skills 安装到各 Agent 目录

## 验证安装

安装完成后，验证 skill 是否正确加载：

```bash
# 查看 Claude Code 已安装的 skills
ls -la ~/.claude/skills/

# 查看 Kimi CLI 已安装的 skills
ls -la ~/.kimi/skills/
```

启动对应的 AI Agent，skill 会自动生效。

## 使用示例

### 示例 1：使用 GitHub Task Workflow

**普通对话模式（推荐）**：
```bash
# 直接对 AI 说：
# "请执行 tasks/login-refactor.md，要求使用 JWT 实现登录"
```

**编排器模式**：
```bash
# 初始化工作流
python github-task-workflow/scripts/orchestrate.py init tasks/my-task.md

# AI 实现任务...

# 完成并关闭 Issue
python github-task-workflow/scripts/orchestrate.py finish
```

### 示例 2：使用 Spark Task Init

```bash
# 初始化任务目录结构
spark task init

# 创建新特性
spark task create my-feature

# 查看所有特性
spark task list

# 实现特性（需要 kimi CLI）
spark task impl my-feature
```

### 示例 3：创建自定义 Skill

1. 在仓库根目录创建新文件夹：
```bash
mkdir my-custom-skill
```

2. 编写 `SKILL.md`，包含标准 frontmatter：
```yaml
---
name: my-custom-skill
description: 一句话描述该 skill 的用途和触发场景
type: skill
supported_agents:
  - claude-code
  - kimi
  - codex
  - opencode
---

# My Custom Skill

## 使用方式

当用户说"执行 xxx"时，执行以下步骤：
1. 步骤一
2. 步骤二
3. 步骤三

## 示例

```bash
# 示例命令
my-command --help
```
```

3. 安装到各 Agent：
```bash
./install.sh claude-code
./install.sh kimi
# ... 其他 Agent
```

## 目录结构

```
spark-skills/
├── agents.md                 # 本文件：Agent 配置指南
├── README.md                 # 仓库总览
├── SETUP.md                  # 构建过程文档
├── install.sh                # 多 Agent 安装脚本
├── setup-project.sh          # 项目级一键配置脚本
├── github-task-workflow/     # Skill: GitHub 任务工作流
│   ├── SKILL.md             # Skill 入口
│   ├── scripts/             # 可执行脚本
│   └── references/          # 详细参考文档
├── spark-task-init-skill/    # Skill: spark task 初始化
│   └── SKILL.md
└── ...                       # 其他 skills
```

## Skill 文件规范

每个 skill 必须包含：

1. **SKILL.md** - 唯一入口文件，必须包含 YAML frontmatter
2. **scripts/** (可选) - 可执行脚本目录
3. **references/** (可选) - 扩展参考文档

### SKILL.md 标准格式

```yaml
---
name: skill-name                      # skill 的唯一标识
description: 一句话描述               # 用于 Agent 识别触发场景
type: skill                           # 类型：skill / agent
supported_agents:                     # 支持的 Agent 列表
  - claude-code
  - kimi
  - codex
  - opencode
---

# Skill 标题

## 使用方式

描述 Agent 如何使用此 skill。

## 示例

提供具体的使用示例和命令。
```

## 故障排除

### Skill 未生效

1. 检查 skill 目录是否正确链接：
```bash
ls -la ~/.claude/skills/  # 或对应 Agent 目录
```

2. 确认 `SKILL.md` 文件存在且格式正确

3. 重启 AI Agent 客户端

### 权限问题

```bash
# 确保脚本可执行
chmod +x install.sh
chmod +x setup-project.sh
chmod +x github-task-workflow/scripts/*.py
```

### 路径问题

如果符号链接指向的原始目录被移动或删除，需要重新创建链接：

```bash
# 删除旧链接
rm ~/.claude/skills/github-task-workflow

# 重新创建
ln -s /新路径/spark-skills/github-task-workflow ~/.claude/skills/github-task-workflow
```

## 相关资源

- [README.md](./README.md) - 仓库总览和快速开始
- [SETUP.md](./SETUP.md) - 仓库构建过程记录
- [github-task-workflow/SKILL.md](./github-task-workflow/SKILL.md) - GitHub 工作流 Skill 详情
- [spark-task-init-skill/SKILL.md](./spark-task-init-skill/SKILL.md) - Task Init Skill 详情
