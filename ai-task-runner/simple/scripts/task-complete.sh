#!/bin/bash
#
# AI Task Runner - 任务完成脚本
# 完成任务：提交代码、关闭 Issue、归档任务
#

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# 默认配置
TASKS_DIR="${TASKS_DIR:-./tasks}"
ACTIVE_DIR="$TASKS_DIR/active"
ARCHIVE_DIR="$TASKS_DIR/archive"
AUTO_PUSH="${AUTO_PUSH:-false}"

# 打印帮助信息
show_help() {
    cat << EOF
AI Task Runner - 任务完成脚本

用法:
    $0 --id TASK_ID [选项]

必需选项:
    -i, --id ID             任务 ID

可选选项:
    -m, --message MSG       提交信息（默认使用任务标题）
    -p, --push              自动推送到远程（覆盖配置）
    --no-push               不自动推送
    -f, --force             强制完成，即使子任务未完成
    -d, --dry-run           试运行，不实际执行
    -h, --help              显示帮助信息

示例:
    # 基本用法
    $0 --id tr-20260401-104530-a3f9

    # 指定提交信息
    $0 --id tr-20260401-104530-a3f9 --message "feat: 完成用户认证功能"

    # 强制完成（忽略未完成的子任务）
    $0 --id tr-20260401-104530-a3f9 --force
EOF
}

# 解析参数
parse_args() {
    TASK_ID=""
    COMMIT_MSG=""
    PUSH=""
    FORCE=false
    DRY_RUN=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            -i|--id)
                TASK_ID="$2"
                shift 2
                ;;
            -m|--message)
                COMMIT_MSG="$2"
                shift 2
                ;;
            -p|--push)
                PUSH="true"
                shift
                ;;
            --no-push)
                PUSH="false"
                shift
                ;;
            -f|--force)
                FORCE=true
                shift
                ;;
            -d|--dry-run)
                DRY_RUN=true
                shift
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
        exit 1
    fi

    if ! command -v git &> /dev/null; then
        echo -e "${RED}错误: 未找到 git${NC}"
        exit 1
    fi

    if ! gh auth status &> /dev/null; then
        echo -e "${RED}错误: gh CLI 未登录${NC}"
        exit 1
    fi
}

# 从 Markdown 提取 YAML frontmatter
extract_frontmatter() {
    local file="$1"
    sed -n '/^---$/,/^---$/p' "$file" | sed '1d;$d'
}

# 提取字段值
get_field() {
    local frontmatter="$1"
    local field="$2"
    echo "$frontmatter" | grep -E "^${field}:" | cut -d: -f2- | sed 's/^[ 	]*//' | tr -d '"'
}

# 检查子任务完成情况
check_subtasks() {
    local task_file="$1"

    local total completed
    total=$(grep -cE "^- \[[ x]\]" "$task_file" 2>/dev/null || echo 0)
    completed=$(grep -cE "^- \[x\]" "$task_file" 2>/dev/null || echo 0)

    if [[ "$total" -eq 0 ]]; then
        echo -e "${YELLOW}警告: 任务没有子任务${NC}"
        return 0
    fi

    if [[ "$completed" -lt "$total" ]]; then
        echo -e "${YELLOW}警告: 还有 $((total - completed)) 个子任务未完成${NC}"
        return 1
    fi

    echo -e "${GREEN}✓ 所有 ${total} 个子任务已完成${NC}"
    return 0
}

# 更新任务状态
update_task_status() {
    local task_file="$1"
    local current_time
    current_time=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    # 更新状态字段
    sed -i.bak "s/^status:.*$/status: completed/" "$task_file"
    sed -i.bak "s/^updatedAt:.*$/updatedAt: \"${current_time}\"/" "$task_file"

    # 添加或更新 completedAt
    if grep -q "^completedAt:" "$task_file"; then
        sed -i.bak "s/^completedAt:.*$/completedAt: \"${current_time}\"/" "$task_file"
    else
        sed -i.bak "/^updatedAt:/a\\completedAt: \"${current_time}\"/" "$task_file"
    fi

    # 更新 GitHub Issue 状态
    sed -i.bak "s/^  state:.*$/  state: closed/" "$task_file"

    rm -f "${task_file}.bak"

    echo -e "${GREEN}✓ 任务文件已更新${NC}"
}

# 执行 git 操作
execute_git_operations() {
    local branch="$1"
    local message="$2"
    local should_push="$3"

    echo -e "${BLUE}📦 准备提交代码...${NC}"

    # 检查当前分支
    local current_branch
    current_branch=$(git rev-parse --abbrev-ref HEAD)

    if [[ "$current_branch" != "$branch" ]]; then
        echo -e "${YELLOW}切换到任务分支: ${branch}${NC}"
        if [[ "$DRY_RUN" == false ]]; then
            git checkout "$branch"
        fi
    fi

    # 检查是否有变更
    if [[ -z $(git status --porcelain) ]]; then
        echo -e "${YELLOW}⚠ 没有要提交的变更${NC}"
        return 0
    fi

    # 显示变更摘要
    echo -e "${CYAN}变更文件:${NC}"
    git status --short
    echo ""

    if [[ "$DRY_RUN" == true ]]; then
        echo -e "${YELLOW}[试运行] 将要执行:${NC}"
        echo "  git add ."
        echo "  git commit -m \"${message}\""
        if [[ "$should_push" == "true" ]]; then
            echo "  git push origin ${branch}"
        fi
        return 0
    fi

    # 添加变更
    echo -e "${BLUE}添加变更...${NC}"
    git add .

    # 提交
    echo -e "${BLUE}提交代码...${NC}"
    git commit -m "$message"

    echo -e "${GREEN}✓ 代码已提交${NC}"

    # 推送
    if [[ "$should_push" == "true" ]]; then
        echo -e "${BLUE}推送到远程...${NC}"
        git push origin "$branch"
        echo -e "${GREEN}✓ 已推送到远程${NC}"
    else
        echo -e "${YELLOW}提示: 使用 --push 自动推送到远程${NC}"
    fi
}

# 关闭 GitHub Issue
close_github_issue() {
    local issue_number="$1"

    echo -e "${BLUE}🔒 关闭 GitHub Issue #${issue_number}...${NC}"

    if [[ "$DRY_RUN" == true ]]; then
        echo -e "${YELLOW}[试运行] 将要关闭 Issue #${issue_number}${NC}"
        return 0
    fi

    # 添加完成评论
    gh issue comment "$issue_number" --body "✅ 任务已完成，代码已提交。" || true

    # 关闭 Issue
    gh issue close "$issue_number" || {
        echo -e "${YELLOW}警告: 关闭 Issue 失败，可能已被关闭${NC}"
        return 0
    }

    echo -e "${GREEN}✓ Issue #${issue_number} 已关闭${NC}"
}

# 归档任务
archive_task() {
    local task_id="$1"
    local task_file="${ACTIVE_DIR}/${task_id}.md"
    local meta_file="${ACTIVE_DIR}/${task_id}.json"

    echo -e "${BLUE}📁 归档任务...${NC}"

    mkdir -p "$ARCHIVE_DIR"

    if [[ "$DRY_RUN" == false ]]; then
        # 移动文件
        [[ -f "$task_file" ]] && mv "$task_file" "$ARCHIVE_DIR/"
        [[ -f "$meta_file" ]] && mv "$meta_file" "$ARCHIVE_DIR/"

        echo -e "${GREEN}✓ 任务已归档到: ${ARCHIVE_DIR}/${NC}"
    else
        echo -e "${YELLOW}[试运行] 将要移动到: ${ARCHIVE_DIR}/${NC}"
    fi
}

# 主函数
main() {
    parse_args "$@"

    # 验证必需参数
    if [[ -z "$TASK_ID" ]]; then
        echo -e "${RED}错误: 请提供 --id${NC}"
        show_help
        exit 1
    fi

    echo -e "${BLUE}🏁 AI Task Runner - 完成任务${NC}"
    echo ""

    check_dependencies

    # 检查任务文件
    local task_file="${ACTIVE_DIR}/${TASK_ID}.md"
    if [[ ! -f "$task_file" ]]; then
        echo -e "${RED}错误: 任务文件不存在: ${task_file}${NC}"
        exit 1
    fi

    # 提取任务信息
    local frontmatter
    frontmatter=$(extract_frontmatter "$task_file")

    local title issue_number branch base_branch status
    title=$(get_field "$frontmatter" "title")
    issue_number=$(echo "$frontmatter" | grep "^  number:" | awk '{print $2}')
    branch=$(get_field "$frontmatter" "branch")
    base_branch=$(get_field "$frontmatter" "baseBranch")
    status=$(get_field "$frontmatter" "status")

    echo -e "📋 ${BLUE}任务:${NC} ${title}"
    echo -e "🆔 ${BLUE}ID:${NC} ${TASK_ID}"
    echo -e "🐙 ${BLUE}Issue:${NC} #${issue_number}"
    echo -e "🌿 ${BLUE}分支:${NC} ${branch}"
    echo ""

    # 检查状态
    if [[ "$status" == "completed" ]]; then
        echo -e "${YELLOW}警告: 任务已经是完成状态${NC}"
        read -p "是否继续? (y/N) " -n 1 -r
        echo
        [[ ! $REPLY =~ ^[Yy]$ ]] && exit 0
    fi

    # 检查子任务
    if [[ "$FORCE" == false ]]; then
        if ! check_subtasks "$task_file"; then
            echo ""
            echo -e "${YELLOW}使用 --force 强制完成${NC}"
            exit 1
        fi
    fi

    # 确定提交信息
    if [[ -z "$COMMIT_MSG" ]]; then
        COMMIT_MSG="feat: [${TASK_ID}] ${title}"
    fi

    # 确定是否推送
    local should_push="${PUSH:-$AUTO_PUSH}"

    echo -e "${CYAN}提交信息:${NC} ${COMMIT_MSG}"
    echo ""

    if [[ "$DRY_RUN" == false ]]; then
        read -p "确认完成此任务? (y/N) " -n 1 -r
        echo
        [[ ! $REPLY =~ ^[Yy]$ ]] && exit 0
    fi

    # 执行操作
    update_task_status "$task_file"
    execute_git_operations "$branch" "$COMMIT_MSG" "$should_push"

    if [[ -n "$issue_number" && "$issue_number" != "null" ]]; then
        close_github_issue "$issue_number"
    fi

    archive_task "$TASK_ID"

    # 输出摘要
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║         任务完成                       ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "📋 ${BLUE}任务:${NC} ${title}"
    echo -e "🐙 ${BLUE}Issue:${NC} #${issue_number} 已关闭"
    echo -e "💾 ${BLUE}提交:${NC} ${COMMIT_MSG}"

    if [[ "$should_push" != "true" ]]; then
        echo ""
        echo -e "${YELLOW}提示: 记得手动推送代码${NC}"
        echo -e "  ${CYAN}git push origin ${branch}${NC}"
    fi

    echo ""
    echo -e "${GREEN}任务已归档到: ${ARCHIVE_DIR}/${NC}"
}

# 运行主函数
main "$@"
