# 常见问题 (FAQ)

## 通用问题

### Q: 简化版和完整版有什么区别？

| 方面 | 简化版 | 完整版 |
|------|--------|--------|
| 依赖 | gh CLI + git | Node.js |
| 安装 | 复制文件 | npm install |
| 使用 | Kimi CLI 集成 | CLI + MCP + API |
| 扩展 | 修改源码 | 插件系统 |
| 适用 | 个人/快速尝试 | 团队/生产 |

**建议**: 先使用简化版验证流程，团队使用时切换到完整版。

### Q: 两个版本可以混用吗？

可以。任务文件格式完全相同，可以：
- 用简化版创建，完整版执行
- 用完整版创建，简化版执行
- 两个版本同时操作同一任务

### Q: 任务文件会泄露敏感信息吗？

不会。任务文件只存储：
- 任务描述和计划
- GitHub Issue 引用（公开）
- 分支名（公开）

**注意**: 不要将 API 密钥写入任务文件。

## 安装问题

### Q: gh CLI 安装失败

macOS:
```bash
brew install gh
```

Linux:
```bash
# Ubuntu/Debian
sudo apt install gh

# 或其他发行版
# https://github.com/cli/cli/blob/trunk/docs/install_linux.md
```

Windows:
```powershell
winget install --id GitHub.cli
```

### Q: npm install 权限错误

不要 sudo！改用：

```bash
# 修改 npm 目录权限
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# 重新安装
npm install -g @innate/ai-task-runner
```

## 使用问题

### Q: Issue 创建失败

错误信息：
```
Could not resolve to a Repository
```

解决步骤：
1. 检查 gh 登录状态：`gh auth status`
2. 重新登录：`gh auth login`
3. 确认在 Git 仓库中：`git remote -v`
4. 检查仓库权限

### Q: 分支已存在

```bash
# 切换到已有分支
git checkout ai-task/tr-xxx

# 或删除旧分支（谨慎）
git branch -D ai-task/tr-xxx
git push origin --delete ai-task/tr-xxx  # 删除远程分支
```

### Q: 如何修改已创建的任务？

直接编辑任务文件：

```bash
# 编辑 Markdown 文件
vim ./tasks/active/tr-xxx.md

# 同步状态
./scripts/task-sync.sh tr-xxx  # 简化版
task sync tr-xxx               # 完整版
```

### Q: 子任务顺序错了怎么办？

编辑任务文件修改序号：

```markdown
## 子任务

- [ ] 1. 第一个任务
- [ ] 2. 第二个任务  ← 修改这里
- [ ] 3. 第三个任务
```

## 配置问题

### Q: 如何关闭自动创建 Issue？

简化版：
```bash
./scripts/task-init.sh --skip-issue
```

完整版：
```json
{
  "github": {
    "autoCreateIssue": false
  }
}
```

### Q: 如何自定义提交信息？

简化版：
```bash
./scripts/task-complete.sh --message "自定义信息"
```

完整版：
```json
{
  "git": {
    "commitMessageTemplate": "custom: [{id}] {title}"
  }
}
```

### Q: 如何修改任务存储路径？

简化版：
```bash
export TASKS_DIR="./my-tasks"
./scripts/task-init.sh --title "xxx"
```

完整版：
```json
{
  "storage": {
    "basePath": "./my-tasks"
  }
}
```

## MCP 问题

### Q: Claude Code 无法连接 MCP

检查步骤：
1. 确认 MCP Server 安装：`which ai-task-mcp`
2. 检查配置文件路径：
   ```bash
   cat ~/.claude/mcp-config.json
   ```
3. 手动测试：
   ```bash
   echo '{"jsonrpc":"2.0","method":"initialize","id":1}' | ai-task-mcp
   ```

### Q: MCP 工具不显示

在 Claude Code 中：
```
/tools
```

确认输出包含 `task-runner` 相关工具。

## Git 问题

### Q: 提交失败（nothing to commit）

```bash
# 检查是否有变更
git status

# 如果有变更但未提交，手动提交
git add .
git commit -m "手动提交"

# 然后完成任务
./scripts/task-complete.sh --id tr-xxx --skip-commit
```

### Q: 推送被拒绝

```bash
# 先拉取更新
git pull origin main --rebase

# 解决冲突后重新推送
git push origin ai-task/tr-xxx
```

## 性能问题

### Q: 任务列表加载慢

原因：任务文件过多

解决：
```bash
# 归档旧任务
./scripts/task-complete.sh --id tr-old-task

# 或使用完整版的过滤
task list --status in_progress
```

### Q: MCP 响应慢

检查：
1. 任务数量是否过多
2. 存储路径是否在慢速磁盘
3. 网络连接（如果使用远程存储）

## 最佳实践

### Q: 如何组织大型项目的任务？

建议结构：
```
project/
├── tasks/
│   ├── active/
│   │   ├── feature-1/
│   │   │   └── tr-xxx.md
│   │   └── feature-2/
│   ├── archive/
│   └── templates/
│       ├── feature.md
│       └── bugfix.md
```

### Q: 如何批量归档旧任务？

完整版：
```bash
# 归档 30 天前完成的任务
task list --status completed --json | \
  jq -r '.[] | select(.completedAt < (now - 30*24*60*60 | todate)) | .id' | \
  xargs -I {} task archive {}
```

### Q: 如何导出任务报告？

```bash
# 导出为 JSON
task list --json > tasks-report.json

# 导出为 Markdown
task list --json | \
  jq -r '.[] | "## \(.meta.title)\n- ID: \(.id)\n- Status: \(.status)\n"' > report.md
```

## 贡献与反馈

### Q: 如何提交 Bug 报告？

1. 提供以下信息：
   - 版本号：`task --version`
   - 操作系统：`uname -a`
   - 复现步骤
   - 错误信息

2. 提交到：[GitHub Issues](https://github.com/your-org/ai-task-runner/issues)

### Q: 如何贡献代码？

1. Fork 仓库
2. 创建分支：`git checkout -b feature/my-feature`
3. 提交更改：`git commit -m "feat: xxx"`
4. 推送分支：`git push origin feature/my-feature`
5. 创建 Pull Request

## 其他

### Q: 支持哪些 Git 托管平台？

目前支持：
- GitHub（完全支持）
- GitLab（部分支持，通过 gh CLI 兼容层）
- Gitea（实验性支持）

### Q: 支持哪些 AI 工具？

- Kimi Code CLI（通过简化版 Skill）
- Claude Code（通过 MCP）
- Cline（通过 MCP）
- 任何支持 MCP 的 AI 工具
- 自定义 AI 集成（通过编程 API）

### Q: 商业使用需要授权吗？

MIT 许可证，可以自由用于商业项目。
