/**
 * task init - 初始化任务
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { TaskRunner, GitClient, GitHubClient, LocalStorage } from '@innate/ai-task-core';
import { loadConfig } from '../config/loader';
import { ensureTasksDirectory } from '../utils/paths';

export function createInitCommand(): Command {
  const command = new Command('init');

  command
    .description('初始化新任务')
    .argument('[title]', '任务标题')
    .option('-d, --description <desc>', '任务描述')
    .option('-p, --priority <level>', '优先级: low, medium, high, critical', 'medium')
    .option('-l, --labels <labels>', '标签，逗号分隔', 'ai-task')
    .option('--skip-issue', '跳过创建 GitHub Issue')
    .option('--skip-branch', '跳过创建 Git 分支')
    .action(async (title?: string, options?: {
      description?: string;
      priority?: string;
      labels?: string;
      skipIssue?: boolean;
      skipBranch?: boolean;
    }) => {
      const spinner = ora();

      try {
        // 如果没有提供标题，交互式询问
        if (!title) {
          const { default: inquirer } = await import('inquirer');
          const answers = await inquirer.prompt([
            {
              type: 'input',
              name: 'title',
              message: '任务标题:',
              validate: (input: string) => input.length > 0 || '标题不能为空',
            },
            {
              type: 'input',
              name: 'description',
              message: '任务描述 (可选):',
            },
            {
              type: 'list',
              name: 'priority',
              message: '优先级:',
              choices: [
                { name: 'Low', value: 'low' },
                { name: 'Medium', value: 'medium' },
                { name: 'High', value: 'high' },
                { name: 'Critical', value: 'critical' },
              ],
              default: 'medium',
            },
          ]);

          title = answers.title;
          options = {
            ...options,
            description: answers.description,
            priority: answers.priority,
          };
        }

        spinner.start('加载配置...');
        const config = await loadConfig();
        spinner.succeed('配置加载完成');

        // 创建任务
        spinner.start('创建任务...');
        const task = TaskRunner.create({
          title: title!,
          description: options?.description,
          priority: options?.priority as any,
          labels: options?.labels?.split(',').map(l => l.trim()),
        });
        spinner.succeed(`任务创建成功: ${chalk.cyan(task.id)}`);

        // 初始化存储
        const storage = new LocalStorage({ basePath: config.storage.basePath });
        await storage.initialize();

        // 创建 GitHub Issue
        if (!options?.skipIssue && config.github.autoCreateIssue) {
          spinner.start('创建 GitHub Issue...');
          const github = new GitHubClient();

          if (!github.isAvailable()) {
            spinner.warn('gh CLI 不可用，跳过创建 Issue');
          } else if (!github.isAuthenticated()) {
            spinner.warn('gh CLI 未登录，跳过创建 Issue');
          } else {
            const issue = github.createIssue(task, {
              labels: config.github.issueLabels,
            });
            task.github = issue;
            spinner.succeed(`GitHub Issue 创建成功: ${chalk.cyan(`#${issue.number}`)}`);
          }
        }

        // 创建 Git 分支
        if (!options?.skipBranch && config.git.autoCreateBranch) {
          spinner.start('创建 Git 分支...');
          const git = new GitClient({
            baseBranch: config.git.baseBranch,
            branchPrefix: config.git.branchPrefix,
          });

          if (!git.isRepo()) {
            spinner.warn('当前目录不是 Git 仓库，跳过创建分支');
          } else {
            const branch = git.createBranch(task.id, config.git.baseBranch);
            task.git = {
              branch,
              baseBranch: config.git.baseBranch,
            };
            spinner.succeed(`Git 分支创建成功: ${chalk.cyan(branch)}`);
          }
        }

        // 保存任务
        spinner.start('保存任务文件...');
        await storage.save(task);
        spinner.succeed('任务文件保存成功');

        // 输出摘要
        console.log('');
        console.log(chalk.green('╔════════════════════════════════════════╗'));
        console.log(chalk.green('║         任务初始化完成                 ║'));
        console.log(chalk.green('╚════════════════════════════════════════╝'));
        console.log('');
        console.log(`${chalk.blue('任务 ID:')} ${task.id}`);
        console.log(`${chalk.blue('标题:')} ${task.meta.title}`);
        if (task.github) {
          console.log(`${chalk.blue('GitHub Issue:')} #${task.github.number} ${task.github.url}`);
        }
        if (task.git) {
          console.log(`${chalk.blue('Git 分支:')} ${task.git.branch}`);
        }
        console.log(`${chalk.blue('任务文件:')} ${config.storage.basePath}/active/${task.id}.md`);
        console.log('');
        console.log(chalk.yellow('下一步:'));
        console.log('  1. 完善任务文件中的分析和计划');
        console.log(`  2. 运行 ${chalk.cyan(`task run ${task.id}`)} 开始执行`);

      } catch (error) {
        spinner.fail('初始化失败');
        console.error(chalk.red('错误:'), (error as Error).message);
        process.exit(1);
      }
    });

  return command;
}
