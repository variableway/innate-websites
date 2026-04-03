/**
 * task complete - 完成任务
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { TaskRunner, LocalStorage, GitClient, GitHubClient } from '@innate/ai-task-core';
import { loadConfig } from '../config/loader';

export function createCompleteCommand(): Command {
  const command = new Command('complete');

  command
    .description('完成任务：提交代码、关闭 Issue、归档')
    .argument('<task-id>', '任务ID')
    .option('-m, --message <msg>', '提交信息')
    .option('-p, --push', '推送到远程')
    .option('--no-push', '不推送到远程')
    .option('-f, --force', '强制完成（忽略未完成的子任务）')
    .option('--skip-commit', '跳过提交')
    .option('--skip-close', '跳过关闭 Issue')
    .action(async (taskId: string, options?: {
      message?: string;
      push?: boolean;
      force?: boolean;
      skipCommit?: boolean;
      skipClose?: boolean;
    }) => {
      const spinner = ora();

      try {
        const config = await loadConfig();
        const storage = new LocalStorage({ basePath: config.storage.basePath });

        // 加载任务
        spinner.start('加载任务...');
        const task = await storage.load(taskId);

        if (!task) {
          spinner.fail('任务不存在');
          process.exit(1);
        }

        spinner.succeed(`任务: ${chalk.cyan(task.meta.title)}`);

        // 检查子任务完成情况
        const pendingTasks = task.subTasks.filter(s => s.status !== 'done');
        if (pendingTasks.length > 0 && !options?.force) {
          console.log(chalk.yellow(`警告: 还有 ${pendingTasks.length} 个子任务未完成`));
          
          const { default: inquirer } = await import('inquirer');
          const { confirm } = await inquirer.prompt([{
            type: 'confirm',
            name: 'confirm',
            message: '是否强制完成?',
            default: false,
          }]);

          if (!confirm) {
            console.log('已取消');
            return;
          }
        }

        // 提交代码
        if (!options?.skipCommit) {
          spinner.start('检查 Git 状态...');
          
          const git = new GitClient({
            baseBranch: task.git?.baseBranch || config.git.baseBranch,
          });

          if (!git.isRepo()) {
            spinner.fail('当前目录不是 Git 仓库');
            process.exit(1);
          }

          // 切换到任务分支
          if (task.git && git.getCurrentBranch() !== task.git.branch) {
            spinner.text = `切换到分支: ${task.git.branch}`;
            git.checkoutBranch(task.git.branch);
          }

          const status = git.getStatus();
          spinner.succeed(`Git 分支: ${status.branch}`);

          if (!status.clean) {
            spinner.start('提交代码...');
            git.add();

            const message = options?.message || git.generateCommitMessage(task);
            git.commit(message);

            spinner.succeed(`代码已提交: ${message.slice(0, 50)}`);

            // 推送
            const shouldPush = options?.push ?? config.git.autoPush;
            if (shouldPush) {
              spinner.start('推送到远程...');
              git.push(task.git?.branch);
              spinner.succeed('已推送到远程');
            }
          } else {
            console.log(chalk.gray('没有要提交的变更'));
          }
        }

        // 关闭 Issue
        if (!options?.skipClose && task.github) {
          spinner.start(`关闭 Issue #${task.github.number}...`);
          
          const github = new GitHubClient();
          if (github.isAvailable() && github.isAuthenticated()) {
            github.closeIssue(
              task.github.number,
              '✅ 任务已完成，代码已提交。'
            );
            spinner.succeed(`Issue #${task.github.number} 已关闭`);
          } else {
            spinner.warn('GitHub CLI 不可用，跳过关闭 Issue');
          }
        }

        // 完成任务
        spinner.start('归档任务...');
        const runner = new TaskRunner({ storage });
        await runner.complete(task);
        spinner.succeed('任务已归档');

        // 输出摘要
        console.log('');
        console.log(chalk.green('╔════════════════════════════════════════╗'));
        console.log(chalk.green('║         任务完成                       ║'));
        console.log(chalk.green('╚════════════════════════════════════════╝'));
        console.log('');
        console.log(`${chalk.blue('任务:')} ${task.meta.title}`);
        console.log(`${chalk.blue('ID:')} ${task.id}`);
        if (task.github) {
          console.log(`${chalk.blue('Issue:')} #${task.github.number} 已关闭`);
        }
        console.log(`${chalk.blue('状态:')} 已完成并归档`);

      } catch (error) {
        spinner.fail('完成失败');
        console.error(chalk.red('错误:'), (error as Error).message);
        process.exit(1);
      }
    });

  return command;
}
