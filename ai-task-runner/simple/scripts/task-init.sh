#!/bin/bash
#
# AI Task Runner - 任务初始化脚本
# 创建 GitHub Issue、Git 分支和任务文件
#

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 默认配置
TASKS_DIR="${TASKS_DIR:-./tasks}"
ACTIVE_DIR="$TASKS_DIR/active"
LABELS="ai-task"

# 打印帮助信息
show_help() {
    cat << EOF
AI Task Runner - 任务初始化脚本

用法:
    $0 [选项]

选项:
    -t, --title TITLE       任务标题（必需）
    -f, --file FILE         从文件读取任务描述
    -l, --labels LABELS     GitHub 标签，逗号分隔（默认: ai-task）
    -p, --priority PRIORITY 优先级: low, medium, high, critical
    -d, --description DESC  任务描述
    -h, --help              显示帮助信息

示例:
    # 直接指定标题
    $0 --title "实现用户认证功能"

    # 从文件读取
    $0 --file ./requirements.md --labels "feature,auth"

    # 完整参数
    $0 --title "修复登录 Bug" --priority high --labels "bug,auth" --description "修复..."
EOF
}

# 解析参数
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -t|--title)
                TITLE="$2"
                shift 2
                ;;
            -f|--file)
                SOURCE_FILE="$2"
                shift 2
                ;;
            -l|--labels)
                LABELS="$2"
                shift 2
                ;;
            -p|--priority)
                PRIORITY="$2"
                shift 2
                ;;
            -d|--description)
                DESCRIPTION="$2"
                shift 2
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                echo -e "${RED}错误: 未知参数 $1${NC}"
                show_help
                exit 1
                ;;
        esac
    done
}

# 检查依赖
check_dependencies() {
    if ! command -v gh &> /dev/null; then
        echo -e "${RED}错误: 未找到 gh CLI${NC}"
        echo "请安装: https://cli.github.com/"
        exit 1
    fi

    if ! command -v git &> /dev/null; then
        echo -e "${RED}错误: 未找到 git${NC}"
        exit 1
    fi

    # 检查 gh 是否已登录
    if ! gh auth status &> /dev/null; then
        echo -e "${RED}错误: gh CLI 未登录${NC}"
        echo "请运行: gh auth login"
        exit 1
    fi
}

# 获取 Git 信息
get_git_info() {
    # 获取当前仓库信息
    REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
    if [[ -z "$REMOTE_URL" ]]; then
        echo -e "${RED}错误: 当前目录不是 Git 仓库${NC}"
        exit 1
    fi

    # 提取 owner 和 repo
    if [[ "$REMOTE_URL" =~ github.com[:/]([^/]+)/([^/.]+) ]]; then
        GITHUB_OWNER="${BASH_REMATCH[1]}"
        GITHUB_REPO="${BASH_REMATCH[2]}"
    else
        echo -e "${RED}错误: 无法解析 GitHub 仓库信息${NC}"
        exit 1
    fi

    BASE_BRANCH=$(git rev-parse --abbrev-ref HEAD)
}

# 生成任务 ID
generate_task_id() {
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    RANDOM_HASH=$(openssl rand -hex 2 2>/dev/null || echo "$(date +%N | cut -c1-4)")
    TASK_ID="tr-${TIMESTAMP}-${RANDOM_HASH}"
}

# 创建目录结构
create_directories() {
    mkdir -p "$ACTIVE_DIR"
}

# 创建 GitHub Issue
create_github_issue() {
    echo -e "${BLUE}🐙 创建 GitHub Issue...${NC}"

    local body="## 任务描述

${DESCRIPTION:-$TITLE}

## 元数据

- **任务 ID**: ${TASK_ID}
- **优先级**: ${PRIORITY:-medium}
- **创建时间**: $(date -u +"%Y-%m-%dT%H:%M:%SZ")

---
*此 Issue 由 AI Task Runner 自动创建*
"

    # 创建 Issue
    local issue_url
    issue_url=$(gh issue create \
        --title "$TITLE" \
        --body "$body" \
        --label "$LABELS" \
        2>/dev/null) || {
        echo -e "${RED}错误: 创建 GitHub Issue 失败${NC}"
        exit 1
    }

    # 提取 Issue 编号
    ISSUE_NUMBER=$(echo "$issue_url" | grep -oE '/issues/[0-9]+' | cut -d/ -f3)
    ISSUE_URL="$issue_url"

    echo -e "${GREEN}✓ Issue 创建成功: #${ISSUE_NUMBER}${NC}"
}

# 创建 Git 分支
create_git_branch() {
    echo -e "${BLUE}🌿 创建 Git 分支...${NC}"

    BRANCH_NAME="ai-task/${TASK_ID}"

    # 检查分支是否已存在
    if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
        echo -e "${YELLOW}⚠ 分支已存在: ${BRANCH_NAME}${NC}"
        echo -e "${YELLOW}  将使用已有分支${NC}"
    else
        # 创建并切换到新分支
        git checkout -b "$BRANCH_NAME" 2>/dev/null || {
            echo -e "${RED}错误: 创建分支失败${NC}"
            exit 1
        }
        echo -e "${GREEN}✓ 分支创建成功: ${BRANCH_NAME}${NC}"
    fi
}

# 生成任务文件
generate_task_file() {
    echo -e "${BLUE}📝 生成任务文件...${NC}"

    TASK_FILE="${ACTIVE_DIR}/${TASK_ID}.md"
    local current_time
    current_time=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    cat > "$TASK_FILE" << EOF
---
id: "${TASK_ID}"
meta:
  title: "${TITLE}"
  description: "${DESCRIPTION:-}"$(if [[ -n "$PRIORITY" ]]; then echo "
  priority: ${PRIORITY}"; fi)
  labels: [$(echo "$LABELS" | sed 's/,/", "/g' | sed 's/^/"/;s/$/"/')]
status: draft
createdAt: "${current_time}"
updatedAt: "${current_time}"
completedAt: null
github:
  number: ${ISSUE_NUMBER}
  url: "${ISSUE_URL}"
  state: open
git:
  branch: "${BRANCH_NAME}"
  baseBranch: "${BASE_BRANCH}"
---

## 原始需求

${DESCRIPTION:-$TITLE}

## AI 分析

### 复杂度评估
<!-- AI 将在此处填充复杂度分析 -->

### 影响范围
<!-- AI 将在此处填充影响文件和模块 -->

### 风险评估
<!-- AI 将在此处填充风险评估 -->

## 执行计划

### 方案概述
<!-- AI 将在此处填充选定的方案 -->

### 实施步骤
<!-- AI 将在此处填充详细步骤 -->

## 子任务

- [ ] 1. <!-- 子任务 1 -->
- [ ] 2. <!-- 子任务 2 -->
- [ ] 3. <!-- 子任务 3 -->

## 执行笔记

<!-- 执行过程中记录笔记 -->
EOF

    echo -e "${GREEN}✓ 任务文件创建成功: ${TASK_FILE}${NC}"
}

# 生成 JSON 元数据文件
generate_metadata_file() {
    local meta_file="${ACTIVE_DIR}/${TASK_ID}.json"
    local current_time
    current_time=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    cat > "$meta_file" << EOF
{
  "id": "${TASK_ID}",
  "title": "${TITLE}",
  "description": "${DESCRIPTION:-}",
  "status": "draft",
  "createdAt": "${current_time}",
  "updatedAt": "${current_time}",
  "github": {
    "number": ${ISSUE_NUMBER},
    "url": "${ISSUE_URL}",
    "state": "open"
  },
  "git": {
    "branch": "${BRANCH_NAME}",
    "baseBranch": "${BASE_BRANCH}"
  },
  "subTasks": [],
  "history": [
    {
      "action": "created",
      "timestamp": "${current_time}",
      "details": "Task initialized with Issue #${ISSUE_NUMBER}"
    }
  ]
}
EOF
}

# 输出摘要
print_summary() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║         任务初始化完成                 ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "📋 ${BLUE}任务 ID:${NC} ${TASK_ID}"
    echo -e "📝 ${BLUE}标题:${NC} ${TITLE}"
    echo -e "🐙 ${BLUE}GitHub Issue:${NC} #${ISSUE_NUMBER}"
    echo -e "   ${CYAN}${ISSUE_URL}${NC}"
    echo -e "🌿 ${BLUE}Git 分支:${NC} ${BRANCH_NAME}"
    echo -e "📁 ${BLUE}任务文件:${NC} ${TASK_FILE}"
    echo ""
    echo -e "${YELLOW}下一步:${NC}"
    echo -e "  1. 完善任务文件中的分析和计划部分"
    echo -e "  2. 细化子任务列表"
    echo -e "  3. 开始执行子任务"
    echo ""
}

# 主函数
main() {
    parse_args "$@"

    # 验证必需参数
    if [[ -z "$TITLE" && -z "$SOURCE_FILE" ]]; then
        echo -e "${RED}错误: 请提供 --title 或 --file${NC}"
        show_help
        exit 1
    fi

    # 如果从文件读取
    if [[ -n "$SOURCE_FILE" ]]; then
        if [[ ! -f "$SOURCE_FILE" ]]; then
            echo -e "${RED}错误: 文件不存在: ${SOURCE_FILE}${NC}"
            exit 1
        fi
        # 从文件提取标题（第一行）
        if [[ -z "$TITLE" ]]; then
            TITLE=$(head -1 "$SOURCE_FILE" | sed 's/^#* *//')
        fi
        # 从文件提取描述
        if [[ -z "$DESCRIPTION" ]]; then
            DESCRIPTION=$(sed -n '2,/^$/p' "$SOURCE_FILE" | head -20)
        fi
    fi

    echo -e "${BLUE}🚀 AI Task Runner - 初始化任务${NC}"
    echo ""

    check_dependencies
    get_git_info
    generate_task_id
    create_directories
    create_github_issue
    create_git_branch
    generate_task_file
    generate_metadata_file
    print_summary
}

# 运行主函数
main "$@"
