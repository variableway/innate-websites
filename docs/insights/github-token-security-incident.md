# GitHub Token 泄露事件复盘与防范

**日期**: 2026-04-04  
**类型**: Security / 安全实践  
**状态**: 已解决

---

## 1. 事件背景

在开发过程中，将包含 GitHub Personal Access Token 的文档提交到了 Git 仓库，并在 push 时收到 GitHub 的安全警告：

```
remote: —— GitHub Personal Access Token ——————————————————————
remote:   locations:
remote:     - commit: 39fbe8b42d9eb202b59d71d26a56b16b08c72c49
remote:       path: docs/tasks/workflow.md:82
```

---

## 2. 问题分析

### 2.1 泄露原因

1. **直接写入文档**: 在 `workflow.md` 中直接写入了 `export GITHUB_TOKEN="..."` 的完整命令
2. **未检查即提交**: 提交前没有检查是否包含敏感信息
3. **Git 历史永久保存**: 即使后续修改，历史提交中仍保留敏感数据

### 2.2 风险等级

| 风险 | 说明 |
|------|------|
| **高危** | Token 具有 GitHub API 完全访问权限 |
| **影响** | 恶意使用者可操作仓库、读取私有数据 |
| **紧急** | 必须立即撤销 Token 并清理历史 |

---

## 3. 解决过程

### 3.1 立即止损

```bash
# 步骤 1: 到 GitHub 撤销已泄露的 Token
# 访问: https://github.com/settings/tokens
# 操作: 找到对应 Token → Delete

# 步骤 2: 生成新的 Token
# 访问: https://github.com/settings/tokens/new
# 操作: 选择适当权限 → Generate new token

# 步骤 3: 更新本地环境变量
# 编辑 ~/.zshrc，替换为新的 Token
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
source ~/.zshrc
```

### 3.2 清理 Git 历史

由于 Token 已经提交到 Git 历史，需要重写历史记录：

```bash
# 方法: 使用 git reset --soft 重新组织提交

# 1. 软重置到问题提交之前
# 这会保留所有文件更改，但取消提交记录
git reset --soft 39fbe8b^

# 2. 检查暂存区中的文件
# 确认 workflow.md 中的 Token 已被清理或替换为占位符
git diff --cached docs/tasks/workflow.md

# 3. 重新提交（不包含敏感信息）
git commit -m "fix: remove exposed GitHub token and update features

- Clean up exposed GITHUB_TOKEN from workflow.md
- Add Insights module
- Add Project switcher in Issues page  
- Clean Task X: prefix from issue titles"

# 4. 强制推送（覆盖远程历史）
# ⚠️ 注意: 这会改变提交历史，其他协作者需要重新同步
git push origin main --force
```

### 3.3 验证清理

```bash
# 检查 Git 历史中是否还有 Token
git log --all --source --remotes --oneline -S "github_pat"
# 应该无输出，表示已清理

# 检查远程仓库
# 再次 push 时应该不再收到安全警告
git push origin main
```

---

## 4. 经验教训

### 4.1 为什么出问题

| 错误 | 原因 |
|------|------|
| 直接写 Token 到文档 | 为了方便复制粘贴，忽略了安全风险 |
| 未检查就 commit | 没有敏感信息检查流程 |
| 文档中包含真实命令 | 应该用占位符代替真实值 |

### 4.2 正确的做法

**文档中应该这样写**:

```markdown
# 好的示例 - 使用占位符
export GITHUB_TOKEN="YOUR_GITHUB_TOKEN_HERE"

# 或 - 提示用户从环境变量获取
cd packages/task-watcher && node bin/cli.js sync
# 注意: 请确保已设置 GITHUB_TOKEN 环境变量
```

**不要这样写**:

```markdown
# 坏的示例 - 泄露风险
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx..."
```

---

## 5. 防范措施

### 5.1 Git Hooks 自动检查

创建 `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# 检查是否包含 GitHub Token 模式
if git diff --cached | grep -qE "ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]+"; then
    echo "❌ ERROR: Detected potential GitHub Token in commit!"
    echo "Please remove the token before committing."
    exit 1
fi
exit 0
```

### 5.2 IDE 插件

- **VS Code**: GitGuardian 插件
- **JetBrains**: .ignore 插件

### 5.3 使用 `.gitignore`

```bash
# 忽略可能包含敏感信息的文件
.env
.env.local
*.pem
*.key
credentials.json
```

### 5.4 安全替代方案

| 场景 | 安全做法 |
|------|----------|
| 文档示例 | 使用 `YOUR_TOKEN_HERE` 占位符 |
| 脚本执行 | 从环境变量读取 `process.env.GITHUB_TOKEN` |
| CI/CD | 使用 GitHub Secrets |
| 本地开发 | 使用 `.env` 文件（已加入 .gitignore） |

---

## 6. 相关资源

- [GitHub Docs - Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Git - filter-branch documentation](https://git-scm.com/docs/git-filter-branch)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) - 更高效的敏感数据清理工具

---

## 总结

**核心原则**: 永远不要把真实的 Token、密码、密钥等敏感信息提交到 Git 仓库。

**防护层级**:
1. **个人**: 养成习惯，提交前检查
2. **工具**: 使用 Git Hooks 自动拦截
3. **流程**: 使用占位符和文档说明

---

*记录时间: 2026-04-04*  
*关键词: security, git, token, best-practice, incident-response*
