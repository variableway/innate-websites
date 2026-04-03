#!/bin/bash
#
# AI Task Runner - 任务状态同步脚本
# 同步任务文件与 GitHub Issue 的状态
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

# 打印帮助信息
show_help() {
    cat << EOF
AI Task Runner - 任务状态同步脚本

用法:
    $0 [任务ID] [选项]
    $0 --all [选项]

参数:
    任务ID                  要同步的任务 ID（可选，默认同步所有）

选项:
    -a, --all               同步所有任务
    -s, --status STATUS     过滤状态: open, closed, all
    -f, --force             强制更新，即使本地较新
    -v, --verbose           显示详细信息
    -h, --help              显示帮助信息

示例:
    # 同步单个任务
    $0 tr-20260401-104530-a3f9

    # 同步所有任务
    $0 --all

    # 同步所有已关闭的 Issue
    $0 --all --status closed
EOF
}

# 解析参数
parse_args() {
    SYNC_ALL=false
    FILTER_STATUS="all"
    FORCE=false
    VERBOSE=false
    TASK_ID=""

    while [[ $# -gt 0 ]]; do
        case $1 in
            -a|--all)
                SYNC_ALL=true
                shift
                ;;
            -s|--status)
                FILTER_STATUS="$2"
                shift 2
                ;;
            -f|--force)
                FORCE=true
                shift
                ;;
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            -*)
                echo -e "${RED}错误: 未知参数 $1${NC}"
                show_help
                exit 1
                ;;
            *)
                if [[ -z "$TASK_ID" ]]; then
                    TASK_ID="$1"
                else
                    echo -e "${RED}错误: 多余的参数 $1${NC}"
                    exit 1
                fi
                shift
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

    if ! gh auth status &> /dev/null; then
        echo -e "${RED}错误: gh CLI 未登录${NC}"
        exit 1
    fi

    if ! command -v yq &> /dev/null && ! command -v python3 &> /dev/null; then
        echo -e "${YELLOW}警告: 建议安装 yq 或 python3 以获得更好的 YAML 解析${NC}"
    fi
}

# 从 Markdown 提取 YAML frontmatter
extract_frontmatter() {
    local file="$1"
    sed -n '/^---$/,/^---$/p' "$file" | sed '1d;$d'
}

# 更新 Markdown 文件中的字段
update_markdown_field() {
    local file="$1"
    local field="$2"
    local value="$3"

    # 使用 sed 替换字段值
    # 注意：这是一个简单的实现，复杂的 YAML 可能需要 yq
    if [[ -f "$file" ]]; then
        # 尝试更新 frontmatter 中的字段
        sed -i.bak "s/^${field}:.*$/${field}: ${value}/" "$file" 2>/dev/null || true
        rm -f "${file}.bak"
    fi
}

# 获取 Issue 状态
get_issue_state() {
    local issue_number="$1"
    gh issue view "$issue_number" --json state --jq '.state' 2>/dev/null || echo "unknown"
}

# 同步单个任务
sync_task() {
    local task_id="$1"
    local task_file="${ACTIVE_DIR}/${task_id}.md"
    local meta_file="${ACTIVE_DIR}/${task_id}.json"

    if [[ ! -f "$task_file" ]]; then
        echo -e "${RED}✗ ${task_id}: 任务文件不存在${NC}"
        return 1
    fi

    [[ "$VERBOSE" == true ]] && echo -e "${BLUE}同步任务: ${task_id}${NC}"

    # 从 frontmatter 提取信息
    local frontmatter
    frontmatter=$(extract_frontmatter "$task_file")

    # 提取 Issue 编号
    local issue_number
    issue_number=$(echo "$frontmatter" | grep -E "^  number:" | awk '{print $2}' || echo "")

    if [[ -z "$issue_number" || "$issue_number" == "null" ]]; then
        echo -e "${YELLOW}⚠ ${task_id}: 未关联 GitHub Issue${NC}"
        return 0
    fi

    # 获取远程 Issue 状态
    local remote_state
    remote_state=$(get_issue_state "$issue_number")

    if [[ "$remote_state" == "unknown" ]]; then
        echo -e "${RED}✗ ${task_id}: 无法获取 Issue #${issue_number} 状态${NC}"
        return 1
    fi

    # 提取本地状态
    local local_state
    local_state=$(echo "$frontmatter" | grep -E "^  state:" | awk '{print $2}' || echo "open")

    # 确定任务文件状态
    local task_status
    if [[ "$remote_state" == "closed" ]]; then
        task_status="completed"
    else
        # 检查子任务完成情况
        local total_tasks completed_tasks
        total_tasks=$(grep -cE "^- \[[ x]\]" "$task_file" 2>/dev/null || echo 0)
        completed_tasks=$(grep -cE "^- \[x\]" "$task_file" 2>/dev/null || echo 0)

        if [[ "$total_tasks" -gt 0 && "$completed_tasks" -eq "$total_tasks" ]]; then
            task_status="review_needed"
        elif [[ "$completed_tasks" -gt 0 ]]; then
            task_status="in_progress"
        else
            task_status="draft"
        fi
    fi

    # 检查是否需要更新
    local needs_update=false
    if [[ "$local_state" != "$remote_state" ]]; then
        needs_update=true
        [[ "$VERBOSE" == true ]] && echo -e "  ${YELLOW}Issue 状态变化: ${local_state} → ${remote_state}${NC}"
    fi

    # 过滤状态
    if [[ "$FILTER_STATUS" != "all" && "$remote_state" != "$FILTER_STATUS" ]]; then
        [[ "$VERBOSE" == true ]] && echo -e "  ${CYAN}跳过（状态过滤）${NC}"
        return 0
    fi

    # 更新任务文件
    if [[ "$needs_update" == true || "$FORCE" == true ]]; then
        local current_time
        current_time=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

        # 更新 Markdown 文件
        update_markdown_field "$task_file" "  state" "$remote_state"

        # 如果 Issue 已关闭，更新任务状态
        if [[ "$remote_state" == "closed" ]]; then
            update_markdown_field "$task_file" "status" "completed"
            # 添加 completedAt
            if ! grep -q "completedAt:" "$task_file"; then
                sed -i.bak "/^updatedAt:/a\\completedAt: \"${current_time}\"" "$task_file"
                rm -f "${task_file}.bak"
            fi
        fi

        # 更新 JSON 文件
        if [[ -f "$meta_file" ]]; then
            local temp_file=$(mktemp)
            jq --arg state "$remote_state" \
               --arg task_status "$task_status" \
               --arg time "$current_time" \
               '.github.state = $state | .status = $task_status | .updatedAt = $time' \
               "$meta_file" > "$temp_file" && mv "$temp_file" "$meta_file"
        fi

        echo -e "${GREEN}✓ ${task_id}: 已同步${NC}"
        [[ "$VERBOSE" == true ]] && echo -e "  ${CYAN}状态: ${task_status}${NC}"
    else
        [[ "$VERBOSE" == true ]] && echo -e "  ${GREEN}已是最新${NC}"
    fi

    return 0
}

# 同步所有任务
sync_all_tasks() {
    local count=0
    local success=0
    local failed=0

    if [[ ! -d "$ACTIVE_DIR" ]]; then
        echo -e "${YELLOW}没有活动任务目录${NC}"
        return 0
    fi

    echo -e "${BLUE}同步所有任务...${NC}"
    echo ""

    for task_file in "$ACTIVE_DIR"/*.md; do
        [[ -f "$task_file" ]] || continue

        local task_id
        task_id=$(basename "$task_file" .md)

        if sync_task "$task_id"; then
            ((success++))
        else
            ((failed++))
        fi
        ((count++))
    done

    echo ""
    echo -e "${GREEN}同步完成: ${success}/${count} 成功${NC}"
    [[ $failed -gt 0 ]] && echo -e "${RED}失败: ${failed}${NC}"
}

# 显示任务列表
list_tasks() {
    echo -e "${BLUE}任务列表:${NC}"
    echo ""

    printf "%-30s %-12s %-10s %-10s\n" "任务 ID" "状态" "Issue" "分支"
    printf "%-30s %-12s %-10s %-10s\n" "$(printf '%0.s-' {1..30})" "$(printf '%0.s-' {1..12})" "$(printf '%0.s-' {1..10})" "$(printf '%0.s-' {1..10})"

    for task_file in "$ACTIVE_DIR"/*.md; do
        [[ -f "$task_file" ]] || continue

        local task_id frontmatter status issue_num branch
        task_id=$(basename "$task_file" .md)
        frontmatter=$(extract_frontmatter "$task_file")

        status=$(echo "$frontmatter" | grep "^status:" | awk '{print $2}' || echo "unknown")
        issue_num=$(echo "$frontmatter" | grep "^  number:" | awk '{print $2}' || echo "-")
        branch=$(echo "$frontmatter" | grep "^  branch:" | awk '{print $2}' | tr -d '"' || echo "-")

        local color="$NC"
        case "$status" in
            completed) color="$GREEN" ;;
            in_progress) color="$BLUE" ;;
            draft) color="$YELLOW" ;;
        esac

        printf "%-30s ${color}%-12s${NC} %-10s %-10s\n" "$task_id" "$status" "$issue_num" "$branch"
    done
}

# 主函数
main() {
    parse_args "$@"

    echo -e "${BLUE}🔄 AI Task Runner - 同步任务状态${NC}"
    echo ""

    check_dependencies

    # 确保目录存在
    mkdir -p "$ACTIVE_DIR" "$ARCHIVE_DIR"

    # 如果没有指定任务 ID 且不是 --all，显示列表
    if [[ -z "$TASK_ID" && "$SYNC_ALL" == false ]]; then
        list_tasks
        echo ""
        echo "提示: 使用 --all 同步所有任务，或指定任务 ID"
        exit 0
    fi

    # 执行同步
    if [[ "$SYNC_ALL" == true ]]; then
        sync_all_tasks
    else
        if sync_task "$TASK_ID"; then
            echo ""
            echo -e "${GREEN}✓ 同步成功${NC}"
        else
            echo ""
            echo -e "${RED}✗ 同步失败${NC}"
            exit 1
        fi
    fi
}

# 运行主函数
main "$@"
