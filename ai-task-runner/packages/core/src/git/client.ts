/**
 * Git 操作客户端
 */

import { execSync, spawn } from 'child_process';
import type { Task } from '../types';

export interface GitClientOptions {
  baseBranch?: string;
  branchPrefix?: string;
}

export class GitClient {
  private baseBranch: string;
  private branchPrefix: string;

  constructor(options: GitClientOptions = {}) {
    this.baseBranch = options.baseBranch || 'main';
    this.branchPrefix = options.branchPrefix || 'ai-task/';
  }

  /**
   * 检查是否在 Git 仓库中
   */
  isRepo(): boolean {
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 获取当前分支
   */
  getCurrentBranch(): string {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  }

  /**
   * 获取远程 URL
   */
  getRemoteUrl(): string | null {
    try {
      return execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    } catch {
      return null;
    }
  }

  /**
   * 检查分支是否存在
   */
  branchExists(branch: string): boolean {
    try {
      execSync(`git show-ref --verify --quiet refs/heads/${branch}`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 创建分支
   */
  createBranch(taskId: string, baseBranch?: string): string {
    const branch = `${this.branchPrefix}${taskId}`;
    const base = baseBranch || this.baseBranch;

    // 确保在基础分支上
    execSync(`git checkout ${base}`, { stdio: 'ignore' });

    // 拉取最新代码
    try {
      execSync('git pull origin ' + base, { stdio: 'ignore' });
    } catch {
      // 可能没有上游分支，忽略
    }

    // 创建新分支
    if (this.branchExists(branch)) {
      execSync(`git checkout ${branch}`);
    } else {
      execSync(`git checkout -b ${branch}`);
    }

    return branch;
  }

  /**
   * 切换分支
   */
  checkoutBranch(branch: string): void {
    execSync(`git checkout ${branch}`, { stdio: 'ignore' });
  }

  /**
   * 添加文件
   */
  add(files: string | string[] = '.'): void {
    const fileList = Array.isArray(files) ? files.join(' ') : files;
    execSync(`git add ${fileList}`, { stdio: 'ignore' });
  }

  /**
   * 提交
   */
  commit(message: string): void {
    execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
  }

  /**
   * 推送
   */
  push(branch?: string): void {
    const targetBranch = branch || this.getCurrentBranch();
    execSync(`git push origin ${targetBranch}`, { stdio: 'ignore' });
  }

  /**
   * 获取状态
   */
  getStatus(): {
    branch: string;
    clean: boolean;
    modified: string[];
    staged: string[];
    untracked: string[];
  } {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    const branch = this.getCurrentBranch();

    const modified: string[] = [];
    const staged: string[] = [];
    const untracked: string[] = [];

    status.split('\n').forEach(line => {
      if (!line) return;
      const statusCode = line.slice(0, 2);
      const file = line.slice(3).trim();

      if (statusCode[0] !== ' ' && statusCode[0] !== '?') {
        staged.push(file);
      }
      if (statusCode[1] !== ' ') {
        modified.push(file);
      }
      if (statusCode === '??') {
        untracked.push(file);
      }
    });

    return {
      branch,
      clean: status.trim() === '',
      modified,
      staged,
      untracked,
    };
  }

  /**
   * 生成提交信息
   */
  generateCommitMessage(task: Task): string {
    const type = this.getCommitType(task);
    const scope = this.getCommitScope(task);
    const description = task.meta.title;

    if (scope) {
      return `${type}(${scope}): [${task.id}] ${description}`;
    }
    return `${type}: [${task.id}] ${description}`;
  }

  private getCommitType(task: Task): string {
    const labels = task.meta.labels.map(l => l.toLowerCase());

    if (labels.includes('bug') || labels.includes('fix')) return 'fix';
    if (labels.includes('docs') || labels.includes('documentation')) return 'docs';
    if (labels.includes('test')) return 'test';
    if (labels.includes('refactor')) return 'refactor';
    if (labels.includes('chore')) return 'chore';
    if (labels.includes('style')) return 'style';

    return 'feat';
  }

  private getCommitScope(task: Task): string | null {
    // 从分析结果推断 scope
    if (task.analysis?.scope.modules.length) {
      return task.analysis.scope.modules[0].toLowerCase().replace(/\s+/g, '-');
    }

    // 从标签推断
    const scopeLabels = ['auth', 'api', 'ui', 'db', 'core', 'utils'];
    for (const label of task.meta.labels) {
      const lower = label.toLowerCase();
      if (scopeLabels.includes(lower)) {
        return lower;
      }
    }

    return null;
  }
}
