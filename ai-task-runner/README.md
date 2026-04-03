# AI Task Runner

🤖 AI 任务执行自动化工具 - 支持双模式运行

## 项目概述

AI Task Runner 是一个用于自动化管理 AI 开发任务的工具，支持从需求分析到代码提交的完整工作流：

1. **解析任务** → 从 Markdown 文件读取任务
2. **创建 Issue** → 自动创建 GitHub Issue
3. **创建分支** → 自动创建 Git 功能分支
4. **执行追踪** → 记录子任务执行进度
5. **自动提交** → 完成后自动提交代码并关闭 Issue

## 双版本设计

本项目提供两个版本，满足不同场景需求：

### 🚀 简化版 (`simple/`)

**适用场景**: 快速上手、个人项目、轻量级使用

```
simple/
├── SKILL.md              # Kimi CLI Skill 文件
├── scripts/              # 本地可执行脚本
│   ├── task-init.sh      # 初始化任务
│   ├── task-sync.sh      # 同步状态
│   └── task-complete.sh  # 完成任务
└── examples/             # 示例任务文件
```

**特点**:
- 零依赖（仅需 `gh` CLI 和 `git`）
- 开箱即用
- 直接与 Kimi CLI 集成
- Bash 脚本，易于理解和修改

### 🏗️ 完整版 (`packages/`)

**适用场景**: 团队项目、多 AI 工具集成、企业级使用

```
packages/
├── core/                 # 核心引擎（纯 TS）
├── cli/                  # 命令行工具
└── mcp/                  # MCP Server
```

**特点**:
- TypeScript 编写，类型安全
- 支持 CLI、MCP、Programmatic API
- 可扩展的插件系统
- 支持多种 AI 工具（Kimi、Claude、Cline 等）

## 快速开始

### 选择你的版本

| 需求 | 推荐版本 | 安装方式 |
|------|----------|----------|
| 快速尝试 | 简化版 | 复制 `simple/` 到项目 |
| 个人项目 | 简化版 | 同上 |
| 团队协作 | 完整版 | `npm install -g @innate/ai-task-runner` |
| 多 AI 工具 | 完整版 | 同上 + MCP 配置 |
| 深度定制 | 完整版 | 源码修改 |

### 简化版使用

```bash
# 1. 复制到项目
cp -r ai-task-runner/simple ./my-project/.kimi-skills/task-runner

# 2. 配置 (可选)
cd my-project
# 确保 gh CLI 已登录
gh auth status

# 3. 在 Kimi CLI 中使用
# 输入: "帮我运行这个任务文件"
```

### 完整版使用

```bash
# 1. 安装
npm install -g @innate/ai-task-runner

# 2. 初始化配置
task init

# 3. 运行任务
task run ./tasks/my-task.md --auto-execute
```

## 文档导航

- [📖 架构设计文档](docs/architecture.md) - 系统设计和决策记录
- [📚 简化版使用指南](docs/simple-guide.md) - 简化版详细说明
- [📗 完整版使用指南](docs/full-guide.md) - 完整版详细说明
- [🔧 API 文档](docs/api.md) - 编程接口文档
- [📝 任务文件格式](docs/task-format.md) - 任务 Markdown 规范
- [❓ 常见问题](docs/faq.md) - FAQ 和故障排除

## 项目结构

```
ai-task-runner/
├── README.md                 # 本文件
├── LICENSE                   # 许可证
├── simple/                   # ⭐ 简化版
│   ├── SKILL.md              # Kimi Skill
│   ├── scripts/              # 脚本文件
│   └── examples/             # 示例
├── packages/                 # 🚀 完整版 (monorepo)
│   ├── core/                 # 核心引擎
│   ├── cli/                  # CLI 工具
│   └── mcp/                  # MCP Server
├── docs/                     # 📚 文档
│   ├── architecture.md       # 架构设计
│   ├── simple-guide.md       # 简化版指南
│   ├── full-guide.md         # 完整版指南
│   ├── api.md                # API 文档
│   ├── task-format.md        # 任务格式
│   └── faq.md                # 常见问题
├── examples/                 # 📝 示例项目
│   ├── basic-usage/          # 基础使用示例
│   └── advanced-usage/       # 高级使用示例
└── scripts/                  # 🔨 构建脚本
    ├── build.sh
    ├── test.sh
    └── release.sh
```

## 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件。
