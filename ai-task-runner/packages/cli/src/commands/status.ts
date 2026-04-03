/**
 * task status - 查看任务状态
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { LocalStorage } from '@innate/ai-task-core';
import { loadConfig } from '../config/loader';

export function createStatusCommand(): Command {
  const command = new Command('status');

  command
    .description('查看任务状态')
    .argument('<task-id>', '任务ID')
    .action(async (taskId: string) => {
      try {
        const config = await loadConfig();
        const storage = new LocalStorage({ basePath: config.storage.basePath });

        const task = await storage.load(taskId);

        if (!task) {
          console.error(chalk.red('错误:'), `任务不存在: ${taskId}`);
          process.exit(1);
        }

        console.log('');
        console.log(chalk.bold.blue('任务详情'));
        console.log('');

        // 基本信息
        console.log(chalk.bold('基本信息:'));
        console.log(`  ID: ${chalk.cyan(task.id)}`);
        console.log(`  标题: ${task.meta.title}`);
        if (task.meta.description) {
          console.log(`  描述: ${task.meta.description}`);
        }
        console.log(`  优先级: ${task.meta.priority}`);
        if (task.meta.labels.length > 0) {
          console.log(`  标签: ${task.meta.labels.join(', ')}`);
        }
        console.log('');

        // 状态
        console.log(chalk.bold('状态:'));
        let statusColor = chalk.gray;
        switch (task.status) {
          case 'completed': statusColor = chalk.green; break;
          case 'in_progress': statusColor = chalk.blue; break;
          case 'failed': statusColor = chalk.red; break;
          case 'draft': statusColor = chalk.gray; break;
        }
        console.log(`  状态: ${statusColor(task.status)}`);
        console.log(`  创建时间: ${task.createdAt}`);
        console.log(`  更新时间: ${task.updatedAt}`);
        if (task.completedAt) {
          console.log(`  完成时间: ${task.completedAt}`);
        }
        console.log('');

        // GitHub
        if (task.github) {
          console.log(chalk.bold('GitHub:'));
          console.log(`  Issue: #${task.github.number}`);
          console.log(`  URL: ${chalk.cyan(task.github.url)}`);
          console.log(`  状态: ${task.github.state}`);
          console.log('');
        }

        // Git
        if (task.git) {
          console.log(chalk.bold('Git:'));
          console.log(`  分支: ${chalk.cyan(task.git.branch)}`);
          console.log(`  基础分支: ${task.git.baseBranch}`);
          console.log('');
        }

        // 子任务
        if (task.subTasks.length > 0) {
          console.log(chalk.bold('子任务:'));
          const done = task.subTasks.filter(s => s.status === 'done').length;
          const total = task.subTasks.length;
          const percent = Math.round((done / total) * 100);
          
          console.log(`  进度: ${done}/${total} (${percent}%)`);
          console.log('');

          for (const subTask of task.subTasks) {
            let icon = '○';
            let color = chalk.gray;
            
            switch (subTask.status) {
              case 'done':
                icon = '✓';
                color = chalk.green;
                break;
              case 'in_progress':
                icon = '▶';
                color = chalk.blue;
                break;
              case 'blocked':
                icon = '✗';
                color = chalk.red;
                break;
            }

            console.log(`  ${color(icon)} ${subTask.stepId}. ${subTask.title}`);
          }
          console.log('');
        }

        // 分析
        if (task.analysis) {
          console.log(chalk.bold('分析:'));
          console.log(`  复杂度: ${task.analysis.complexity}`);
          if (task.analysis.estimatedHours) {
            console.log(`  预估工时: ${task.analysis.estimatedHours} 小时`);
          }
          if (task.analysis.scope.files.length > 0) {
            console.log(`  影响文件: ${task.analysis.scope.files.length} 个`);
          }
          console.log('');
        }

      } catch (error) {
        console.error(chalk.red('错误:'), (error as Error).message);
        process.exit(1);
      }
    });

  return command;
}
