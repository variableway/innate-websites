/**
 * task sync - 同步任务状态
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { LocalStorage, GitHubClient } from '@innate/ai-task-core';
import { loadConfig } from '../config/loader';

export function createSyncCommand(): Command {
  const command = new Command('sync');

  command
    .description('同步任务与 GitHub Issue 状态')
    .argument('[task-id]', '任务ID（可选，默认同步所有）')
    .option('-a, --all', '同步所有任务')
    .option('--from-github', '从 GitHub 同步到本地（默认双向）')
    .option('--to-github', '从本地同步到 GitHub')
    .action(async (taskId?: string, options?: {
      all?: boolean;
      fromGithub?: boolean;
      toGithub?: boolean;
    }) => {
      const spinner = ora();

      try {
        const config = await loadConfig();
        const storage = new LocalStorage({ basePath: config.storage.basePath });
        const github = new GitHubClient();

        if (!github.isAvailable() || !github.isAuthenticated()) {
          console.error(chalk.red('错误:'), 'GitHub CLI 不可用或未登录');
          process.exit(1);
        }

        if (options?.all || !taskId) {
          // 同步所有任务
          spinner.start('获取所有任务...');
          const tasks = await storage.list();
          spinner.succeed(`找到 ${tasks.length} 个任务`);

          let updated = 0;
          let failed = 0;

          for (const task of tasks) {
            if (!task.github) continue;

            spinner.start(`同步: ${task.id}`);

            try {
              const remoteState = github.getIssueState(task.github.number);
              
              if (remoteState !== task.github.state) {
                task.github.state = remoteState;
                
                if (remoteState === 'closed' && task.status !== 'completed') {
                  task.status = 'completed';
                  task.completedAt = new Date().toISOString();
                }

                await storage.save(task);
                updated++;
              }

              spinner.succeed(`${task.id}: ${remoteState}`);
            } catch (error) {
              failed++;
              spinner.fail(`${task.id}: ${(error as Error).message}`);
            }
          }

          console.log('');
          console.log(chalk.green(`同步完成: ${updated} 更新, ${failed} 失败`));

        } else {
          // 同步单个任务
          spinner.start(`加载任务: ${taskId}`);
          const task = await storage.load(taskId);
          
          if (!task) {
            spinner.fail('任务不存在');
            process.exit(1);
          }

          if (!task.github) {
            spinner.fail('任务未关联 GitHub Issue');
            process.exit(1);
          }

          spinner.succeed('任务加载成功');

          spinner.start('获取远程状态...');
          const remoteState = github.getIssueState(task.github.number);
          spinner.succeed(`远程状态: ${remoteState}`);

          if (remoteState !== task.github.state) {
            spinner.start('更新本地状态...');
            task.github.state = remoteState;
            
            if (remoteState === 'closed') {
              task.status = 'completed';
              task.completedAt = new Date().toISOString();
            }

            await storage.save(task);
            spinner.succeed('本地状态已更新');
          } else {
            console.log(chalk.gray('状态已同步，无需更新'));
          }
        }

      } catch (error) {
        spinner.fail('同步失败');
        console.error(chalk.red('错误:'), (error as Error).message);
        process.exit(1);
      }
    });

  return command;
}
