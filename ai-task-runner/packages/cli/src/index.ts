#!/usr/bin/env node
/**
 * AI Task Runner - CLI
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { createInitCommand } from './commands/init';
import { createRunCommand } from './commands/run';
import { createListCommand } from './commands/list';
import { createStatusCommand } from './commands/status';
import { createSyncCommand } from './commands/sync';
import { createCompleteCommand } from './commands/complete';
import { loadConfig } from './config/loader';

const program = new Command();

program
  .name('task')
  .description('AI Task Runner - 自动化任务管理工具')
  .version('1.0.0');

// 全局选项
program
  .option('-c, --config <path>', '配置文件路径')
  .option('-v, --verbose', '详细输出')
  .option('--dry-run', '试运行模式');

// 添加命令
program.addCommand(createInitCommand());
program.addCommand(createRunCommand());
program.addCommand(createListCommand());
program.addCommand(createStatusCommand());
program.addCommand(createSyncCommand());
program.addCommand(createCompleteCommand());

// 错误处理
program.exitOverride();

try {
  program.parse();
} catch (error) {
  if (error instanceof Error && 'exitCode' in error) {
    process.exit((error as { exitCode: number }).exitCode);
  }
  console.error(chalk.red('错误:'), (error as Error).message);
  process.exit(1);
}
