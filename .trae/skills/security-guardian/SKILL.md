---
name: "security-guardian"
description: "Security guardian skill for preventing sensitive data leaks. Automatically detects and blocks commits containing tokens, passwords, API keys, and other credentials."
---

# Security Guardian - 安全守护者

防止敏感信息（Token、密码、API Key 等）意外提交到 Git 仓库。

---

## 🎯 核心职责

**唯一目标**: 确保任何敏感信息都不会进入 Git 历史。

---

## 🔍 检测范围

### 自动检测的敏感信息类型

| 类型 | 模式示例 | 风险等级 |
|------|----------|----------|
| **GitHub Token** | `ghp_xxxxxxxx`, `github_pat_xxx` | 🔴 Critical |
| **API Keys** | `api_key=xxx`, `apikey: xxx` | 🔴 Critical |
| **Passwords** | `password=xxx`, `pwd: xxx` | 🟠 High |
| **Private Keys** | `-----BEGIN PRIVATE KEY-----` | 🔴 Critical |
| **Database URLs** | `mongodb+srv://user:pass@` | 🟠 High |
| **AWS Credentials** | `AKIAxxxxxxxxxxxx` | 🔴 Critical |
| **JWT Tokens** | `eyJhbG...` (特定长度) | 🟡 Medium |

---

## 🛡️ 防护措施

### 1. 提交前自动检查

**在检测到以下行为时必须拦截：**

```markdown
❌ 禁止行为:
- 包含真实 Token 的 export 命令
- 完整的 API key 字符串
- 明文密码
- 私钥内容
- 数据库连接字符串（含密码）

✅ 允许行为:
- 使用占位符: export TOKEN="YOUR_TOKEN_HERE"
- 环境变量提示: 请设置 GITHUB_TOKEN 环境变量
- 配置模板: token = "<your-api-key>"
```

### 2. 文档编写规范

**编写文档时，敏感信息必须用以下方式之一处理：**

**选项 A: 占位符**
```markdown
export GITHUB_TOKEN="YOUR_GITHUB_TOKEN"
```

**选项 B: 环境变量引用**
```markdown
确保已设置环境变量:
```bash
export GITHUB_TOKEN="$GITHUB_TOKEN"
```
```

**选项 C: 配置说明**
```markdown
在 `.env` 文件中添加:
```
GITHUB_TOKEN=your_token_here
```
注意: `.env` 文件已在 `.gitignore` 中
```

### 3. 自动修复建议

当检测到敏感信息时，AI 应该：

1. **立即停止** - 不执行提交操作
2. **警告用户** - 明确指出哪个文件哪一行包含敏感信息
3. **提供替换方案** - 给出安全的替代写法

---

## 📋 工作流程

### 用户要求提交文件时

```
用户: "提交这些更改"
      ↓
AI 检查: 扫描所有修改的文件
      ↓
发现敏感信息? 
      ├── 是 → 阻止提交，给出警告和修复建议
      └── 否 → 正常提交
```

### 检测到敏感信息的响应模板

```markdown
⚠️ **安全警告: 检测到敏感信息**

在以下位置发现潜在的敏感数据：
- 文件: `docs/tasks/workflow.md`
- 行号: 82
- 类型: GitHub Personal Access Token

**为什么这很危险？**
1. Token 一旦进入 Git 历史，将永久保存
2. 任何人都可以查看历史获取 Token
3. 恶意使用者可以操作你的 GitHub 账户

**如何修复？**

请将:
```bash
export GITHUB_TOKEN="ghp_xxxxx..."
```

替换为:
```bash
export GITHUB_TOKEN="YOUR_GITHUB_TOKEN_HERE"
```

并在文档中添加说明:
```markdown
> 注意: 请将 YOUR_GITHUB_TOKEN_HERE 替换为你的真实 Token，
> 或从环境变量读取: export GITHUB_TOKEN="$GITHUB_TOKEN"
```

确认修改后，我会帮你提交。
```

---

## 🔧 技术实现

### Git Hook 配置（推荐）

创建 `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Security Guardian - Pre-commit Hook

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# 敏感信息模式
PATTERNS=(
    # GitHub Tokens
    'ghp_[a-zA-Z0-9]{36}'
    'github_pat_[a-zA-Z0-9_]+'
    'gho_[a-zA-Z0-9]{36}'
    
    # Generic API Keys
    'api[_-]?key\s*[=:]\s*["'\'''][a-zA-Z0-9]{16,}'
    
    # Passwords
    'password\s*[=:]\s*["'\'''][^"'\'''
]+'
    
    # Private Keys
    '-----BEGIN (RSA |DSA |EC |OPENSSH )?PRIVATE KEY-----'
    
    # AWS Keys
    'AKIA[0-9A-Z]{16}'
    
    # Database URLs with password
    'mongodb(\+srv)?://[^:]+:[^@]+@'
    'postgres(ql)?://[^:]+:[^@]+@'
    'mysql://[^:]+:[^@]+@'
)

# 检查暂存区
FOUND=0
for pattern in "${PATTERNS[@]}"; do
    if git diff --cached --diff-filter=ACM | grep -qE "$pattern"; then
        FOUND=1
        break
    fi
done

if [ $FOUND -eq 1 ]; then
    echo "${RED}❌ Security Alert: Potential sensitive data detected in commit!${NC}"
    echo ""
    echo "Detected patterns:"
    for pattern in "${PATTERNS[@]}"; do
        matches=$(git diff --cached --diff-filter=ACM | grep -E "$pattern" | head -3)
        if [ ! -z "$matches" ]; then
            echo "  - Pattern: $pattern"
            echo "    Matches:"
            echo "$matches" | sed 's/^/      /'
        fi
    done
    echo ""
    echo "Please remove sensitive data before committing."
    echo "Use environment variables or placeholder values instead."
    exit 1
fi

echo "${GREEN}✓ Security check passed${NC}"
exit 0
```

启用 hook:
```bash
chmod +x .git/hooks/pre-commit
```

### 项目级配置

在 `package.json` 中添加检查脚本:

```json
{
  "scripts": {
    "security-check": "node scripts/security-check.js",
    "precommit": "npm run security-check"
  }
}
```

---

## ✅ 检查清单

提交前必须确认：

- [ ] 没有真实的 Token/API Key 在代码中
- [ ] 使用占位符代替真实值
- [ ] `.env` 文件已加入 `.gitignore`
- [ ] 文档中说明了如何获取/设置敏感信息
- [ ] CI/CD 使用 Secrets 而非硬编码

---

## 🚨 应急响应

如果敏感信息已经提交：

### 1. 立即撤销 Token
```bash
# 到 GitHub 撤销
https://github.com/settings/tokens
```

### 2. 清理 Git 历史
```bash
# 软重置到问题提交之前
git reset --soft <commit-before-issue>

# 清理敏感信息后重新提交
git commit -m "fix: remove sensitive data"

# 强制推送（覆盖历史）
git push origin main --force
```

### 3. 通知相关方
- 如果仓库是公开的，立即检查是否有异常访问
- 通知团队成员更新本地仓库

---

## 📚 相关文档

- [GitHub - Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [OWASP - Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

## 总结

**黄金法则**: 
> 任何看起来像密码、Token、密钥的字符串，都不应该出现在 Git 仓库中。

**安全层级**:
1. **预防**: 使用占位符，环境变量
2. **检测**: Git Hooks 自动拦截
3. **响应**: 立即撤销，清理历史

---

*Skill Version: 1.0*  
*Last Updated: 2026-04-04*
