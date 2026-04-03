/**
 * 配置加载器
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { TaskConfig } from '@innate/ai-task-core';

const DEFAULT_CONFIG: TaskConfig = {
  version: '1.0.0',
  ai: {
    provider: 'openai',
    model: 'gpt-4-turbo',
    temperature: 0.2,
    autoAnalyze: true,
    autoExecute: false,
    requireApprovalFor: ['delete', 'install-deps'],
  },
  github: {
    owner: '',
    repo: '',
    autoCreateIssue: true,
    autoCloseIssue: true,
    issueLabels: ['ai-task'],
  },
  git: {
    baseBranch: 'main',
    branchPrefix: 'ai-task/',
    autoCreateBranch: true,
    autoCommit: true,
    commitMessageTemplate: 'feat: [{id}] {title}',
    autoPush: false,
    autoMerge: false,
  },
  storage: {
    type: 'local',
    basePath: './tasks',
    archiveCompleted: true,
  },
};

export async function loadConfig(configPath?: string): Promise<TaskConfig> {
  let config: TaskConfig = { ...DEFAULT_CONFIG };

  // 尝试加载配置文件
  const paths = configPath 
    ? [configPath]
    : [
        './task.config.json',
        './.taskrc.json',
        './.config/task.json',
      ];

  for (const path of paths) {
    if (existsSync(path)) {
      try {
        const content = readFileSync(path, 'utf-8');
        const userConfig = JSON.parse(content);
        config = mergeConfig(config, userConfig);
        break;
      } catch (error) {
        console.warn(`Warning: Failed to load config from ${path}`);
      }
    }
  }

  // 环境变量覆盖
  if (process.env.GITHUB_TOKEN) {
    config.github.token = process.env.GITHUB_TOKEN;
  }

  return config;
}

function mergeConfig(base: TaskConfig, override: Partial<TaskConfig>): TaskConfig {
  return {
    ...base,
    ...override,
    ai: { ...base.ai, ...override.ai },
    github: { ...base.github, ...override.github },
    git: { ...base.git, ...override.git },
    storage: { ...base.storage, ...override.storage },
  };
}
