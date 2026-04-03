/**
 * GitHub API 客户端
 * 使用 gh CLI 进行 GitHub 操作
 */

import { execSync } from 'child_process';
import type { Task, GitHubIssueRef } from '../types';

export interface GitHubClientOptions {
  owner?: string;
  repo?: string;
}

export class GitHubClient {
  private owner: string | null;
  private repo: string | null;

  constructor(options: GitHubClientOptions = {}) {
    this.owner = options.owner || null;
    this.repo = options.repo || null;
  }

  /**
   * 检查 gh CLI 是否可用
   */
  isAvailable(): boolean {
    try {
      execSync('gh --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 检查是否已认证
   */
  isAuthenticated(): boolean {
    try {
      execSync('gh auth status', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 获取仓库信息
   */
  getRepoInfo(): { owner: string; repo: string } | null {
    try {
      const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
      
      // 支持 HTTPS 和 SSH 格式
      // HTTPS: https://github.com/owner/repo.git
      // SSH: git@github.com:owner/repo.git
      const match = remoteUrl.match(/github\.com[:\/]([^\/]+)\/([^\/.]+)(?:\.git)?$/);
      
      if (match) {
        return {
          owner: match[1],
          repo: match[2],
        };
      }
    } catch {
      // 忽略错误
    }

    if (this.owner && this.repo) {
      return { owner: this.owner, repo: this.repo };
    }

    return null;
  }

  /**
   * 创建 Issue
   */
  createIssue(
    task: Task,
    options: {
      labels?: string[];
      body?: string;
    } = {}
  ): GitHubIssueRef {
    const title = task.meta.title;
    const labels = options.labels || task.meta.labels;
    
    // 构建 Issue 内容
    let body = options.body || '';
    if (!body) {
      body = this.buildIssueBody(task);
    }

    // 构建命令
    let cmd = `gh issue create --title "${title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"')}"`;
    
    if (labels.length > 0) {
      const labelStr = labels.join(',');
      cmd += ` --label "${labelStr}"`;
    }

    // 执行命令
    const output = execSync(cmd, { encoding: 'utf8' }).trim();
    
    // 解析输出获取 Issue 编号
    // 输出格式: https://github.com/owner/repo/issues/42
    const match = output.match(/\/issues\/(\d+)$/);
    if (!match) {
      throw new Error('Failed to create issue: could not parse issue number');
    }

    return {
      number: parseInt(match[1], 10),
      url: output,
      state: 'open',
      title,
    };
  }

  /**
   * 关闭 Issue
   */
  closeIssue(issueNumber: number, comment?: string): void {
    if (comment) {
      execSync(`gh issue comment ${issueNumber} --body "${comment.replace(/"/g, '\\"')}"`, {
        stdio: 'ignore',
      });
    }

    execSync(`gh issue close ${issueNumber}`, { stdio: 'ignore' });
  }

  /**
   * 更新 Issue
   */
  updateIssue(
    issueNumber: number,
    updates: {
      title?: string;
      body?: string;
      addLabels?: string[];
      removeLabels?: string[];
    }
  ): void {
    let cmd = `gh issue edit ${issueNumber}`;

    if (updates.title) {
      cmd += ` --title "${updates.title.replace(/"/g, '\\"')}"`;
    }

    if (updates.body) {
      cmd += ` --body "${updates.body.replace(/"/g, '\\"')}"`;
    }

    if (updates.addLabels && updates.addLabels.length > 0) {
      cmd += ` --add-label "${updates.addLabels.join(',')}"`;
    }

    if (updates.removeLabels && updates.removeLabels.length > 0) {
      cmd += ` --remove-label "${updates.removeLabels.join(',')}"`;
    }

    execSync(cmd, { stdio: 'ignore' });
  }

  /**
   * 获取 Issue 状态
   */
  getIssueState(issueNumber: number): 'open' | 'closed' {
    try {
      const output = execSync(`gh issue view ${issueNumber} --json state --jq '.state'`, {
        encoding: 'utf8',
      }).trim();
      return output as 'open' | 'closed';
    } catch {
      return 'closed';
    }
  }

  /**
   * 列出 Issue
   */
  listIssues(options: {
    state?: 'open' | 'closed' | 'all';
    label?: string;
    limit?: number;
  } = {}): Array<{ number: number; title: string; state: string; url: string }> {
    let cmd = 'gh issue list --json number,title,state,url';

    if (options.state) {
      cmd += ` --state ${options.state}`;
    }

    if (options.label) {
      cmd += ` --label "${options.label}"`;
    }

    if (options.limit) {
      cmd += ` --limit ${options.limit}`;
    }

    const output = execSync(cmd, { encoding: 'utf8' });
    return JSON.parse(output);
  }

  /**
   * 构建 Issue 正文
   */
  private buildIssueBody(task: Task): string {
    const lines: string[] = [];

    lines.push('## 任务描述');
    lines.push('');
    lines.push(task.meta.description || task.meta.title);
    lines.push('');

    lines.push('## 元数据');
    lines.push('');
    lines.push(`- **任务 ID**: ${task.id}`);
    lines.push(`- **优先级**: ${task.meta.priority}`);
    
    if (task.meta.labels.length > 0) {
      lines.push(`- **标签**: ${task.meta.labels.join(', ')}`);
    }
    
    lines.push(`- **创建时间**: ${task.createdAt}`);
    lines.push('');

    if (task.analysis) {
      lines.push('## 分析');
      lines.push('');
      lines.push(`- **复杂度**: ${task.analysis.complexity}`);
      if (task.analysis.estimatedHours) {
        lines.push(`- **预估工时**: ${task.analysis.estimatedHours} 小时`);
      }
      lines.push('');
    }

    if (task.subTasks.length > 0) {
      lines.push('## 子任务');
      lines.push('');
      task.subTasks.forEach(subTask => {
        const checkbox = subTask.status === 'done' ? '[x]' : '[ ]';
        lines.push(`- ${checkbox} ${subTask.title}`);
      });
      lines.push('');
    }

    lines.push('---');
    lines.push('*此 Issue 由 AI Task Runner 自动创建*');

    return lines.join('\n');
  }
}
