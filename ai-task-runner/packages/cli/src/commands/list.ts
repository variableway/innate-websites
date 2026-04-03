/**
 * task list - 列出任务
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { LocalStorage } from '@innate/ai-task-core';
import { loadConfig } from '../config/loader';

export function createListCommand(): Command {
  const command = new Command('list');

  command
    .description('列出所有任务')
    .option('-s, --status <status>', '按状态过滤: draft, planned, in_progress, completed')
    .option('-p, --priority <priority>', '按优先级过滤: low, medium, high, critical')
    .option('-l, --label <label>', '按标签过滤')
    .option('--all', '显示所有任务（包括归档）')
    .option('--json', '以 JSON 格式输出')
    .action(async (options?: {
      status?: string;
      priority?: string;
      label?: string;
      all?: boolean;
      json?: boolean;
    }) => {
      try {
        const config = await loadConfig();
        const storage = new LocalStorage({ basePath: config.storage.basePath });

        const filters: any = {};
        if (options?.status) {
          filters.status = options.status.split(',') as any;
        }
        if (options?.priority) {
          filters.priority = options.priority;
        }
        if (options?.label) {
          filters.labels = [options.label];
        }

        const tasks = await storage.list(filters);

        if (options?.json) {
          console.log(JSON.stringify(tasks, null, 2));
          return;
        }

        if (tasks.length === 0) {
          console.log(chalk.yellow('没有找到任务'));
          return;
        }

        console.log('');
        console.log(chalk.bold.blue('任务列表'));
        console.log('');

        // 表头
        console.log(
          chalk.gray(
            `${'ID'.padEnd(25)} ${'状态'.padEnd(12)} ${'优先级'.padEnd(8)} ${'Issue'.padEnd(8)} ${'标题'}`
          )
        );
        console.log(chalk.gray('─'.repeat(100)));

        // 任务行
        for (const task of tasks) {
          const id = task.id.slice(0, 22).padEnd(25);
          
          let statusColor = chalk.gray;
          switch (task.status) {
            case 'completed':
              statusColor = chalk.green;
              break;
            case 'in_progress':
              statusColor = chalk.blue;
              break;
            case 'failed':
              statusColor = chalk.red;
              break;
            case 'draft':
              statusColor = chalk.gray;
              break;
            default:
              statusColor = chalk.yellow;
          }
          const status = statusColor(task.status.padEnd(12));

          let priorityColor = chalk.gray;
          switch (task.meta.priority) {
            case 'critical':
              priorityColor = chalk.bgRed.white;
              break;
            case 'high':
              priorityColor = chalk.red;
              break;
            case 'medium':
              priorityColor = chalk.yellow;
              break;
            case 'low':
              priorityColor = chalk.gray;
              break;
          }
          const priority = priorityColor(task.meta.priority.padEnd(8));

          const issueNum = task.github ? `#${task.github.number}`.padEnd(8) : '-'.padEnd(8);
          const title = task.meta.title.slice(0, 40);

          console.log(`${id} ${status} ${priority} ${issueNum} ${title}`);
        }

        console.log('');
        console.log(chalk.gray(`共 ${tasks.length} 个任务`));

      } catch (error) {
        console.error(chalk.red('错误:'), (error as Error).message);
        process.exit(1);
      }
    });

  return command;
}
