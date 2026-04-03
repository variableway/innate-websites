/**
 * task run - 运行任务
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { TaskRunner, LocalStorage, GitClient, type SubTask } from '@innate/ai-task-core';
import { loadConfig } from '../config/loader';

export function createRunCommand(): Command {
  const command = new Command('run');

  command
    .description('运行任务')
    .argument('<task-id-or-file>', '任务ID或任务文件路径')
    .option('-a, --auto', '自动执行所有子任务', false)
    .option('-d, --dry-run', '试运行模式', false)
    .option('--skip-issue', '跳过 GitHub Issue 操作')
    .option('--skip-branch', '跳过 Git 分支操作')
    .action(async (taskIdOrFile: string, options?: {
      auto?: boolean;
      dryRun?: boolean;
      skipIssue?: boolean;
      skipBranch?: boolean;
    }) => {
      const spinner = ora();

      try {
        const config = await loadConfig();
        const storage = new LocalStorage({ basePath: config.storage.basePath });

        // 加载任务
        spinner.start('加载任务...');
        let task: ReturnType<typeof TaskRunner.create> | null = null;

        // 判断是 ID 还是文件路径
        if (taskIdOrFile.startsWith('tr-')) {
          // 是任务 ID
          task = await storage.load(taskIdOrFile);
        } else {
          // 是文件路径，解析文件
          const { readFileSync } = await import('fs');
          const { parseTaskFile } = await import('@innate/ai-task-core');
          const content = readFileSync(taskIdOrFile, 'utf-8');
          const parsed = parseTaskFile(content);
          // 构建完整任务对象...
          task = await storage.load(parsed.frontmatter.id as string);
        }

        if (!task) {
          spinner.fail('任务不存在');
          process.exit(1);
        }

        spinner.succeed(`任务加载成功: ${chalk.cyan(task.meta.title)}`);

        // 显示任务信息
        console.log('');
        console.log(chalk.blue('任务信息:'));
        console.log(`  ID: ${task.id}`);
        console.log(`  标题: ${task.meta.title}`);
        console.log(`  状态: ${chalk.yellow(task.status)}`);
        console.log(`  子任务: ${task.subTasks.filter(s => s.status === 'done').length}/${task.subTasks.length} 完成`);
        console.log('');

        // 检查是否需要切换到任务分支
        if (task.git && !options?.skipBranch) {
          const git = new GitClient();
          const currentBranch = git.getCurrentBranch();
          
          if (currentBranch !== task.git.branch) {
            console.log(chalk.yellow(`切换到任务分支: ${task.git.branch}`));
            git.checkoutBranch(task.git.branch);
          }
        }

        // 如果有未完成的子任务，执行它们
        const pendingSubTasks = task.subTasks.filter(s => s.status === 'pending');
        
        if (pendingSubTasks.length === 0) {
          console.log(chalk.green('所有子任务已完成！'));
          console.log(`运行 ${chalk.cyan(`task complete ${task.id}`)} 来提交任务`);
          return;
        }

        console.log(chalk.blue('待执行子任务:'));
        pendingSubTasks.forEach((st, i) => {
          console.log(`  ${i + 1}. ${st.title}`);
        });
        console.log('');

        if (options?.dryRun) {
          console.log(chalk.yellow('[试运行模式] 不会实际执行操作'));
          return;
        }

        if (!options?.auto) {
          const { default: inquirer } = await import('inquirer');
          const { confirm } = await inquirer.prompt([{
            type: 'confirm',
            name: 'confirm',
            message: '开始执行子任务?',
            default: true,
          }]);

          if (!confirm) {
            console.log('已取消');
            return;
          }
        }

        // 执行任务
        const runner = new TaskRunner({ storage });

        // 模拟执行器（实际使用需要 AI 服务）
        const mockExecutor = async (subTask: SubTask) => {
          console.log(chalk.blue(`\n▶ 执行: ${subTask.title}`));
          
          if (!options?.auto) {
            const { default: inquirer } = await import('inquirer');
            const { action } = await inquirer.prompt([{
              type: 'list',
              name: 'action',
              message: '选择操作:',
              choices: [
                { name: '✅ 标记为完成', value: 'done' },
                { name: '⏭️  跳过', value: 'skip' },
                { name: '❌ 标记为失败', value: 'fail' },
                { name: '📝 添加笔记后继续', value: 'note' },
              ],
            }]);

            if (action === 'note') {
              const { note } = await inquirer.prompt([{
                type: 'input',
                name: 'note',
                message: '笔记:',
              }]);
              subTask.notes = subTask.notes || [];
              subTask.notes.push(note);
              return { success: true, subTaskId: subTask.id, duration: 0 };
            }

            if (action === 'skip') {
              return { success: true, subTaskId: subTask.id, duration: 0 };
            }

            if (action === 'fail') {
              return { success: false, subTaskId: subTask.id, error: '用户标记为失败', duration: 0 };
            }
          }

          // 模拟执行时间
          await new Promise(r => setTimeout(r, 500));
          console.log(chalk.green(`  ✓ 完成: ${subTask.title}`));
          
          return { success: true, subTaskId: subTask.id, duration: 500 };
        };

        await runner.execute(task, mockExecutor, {
          stopOnError: true,
          beforeEach: async (subTask) => {
            // 可以在这里添加前置检查
            return true;
          },
          afterEach: async (subTask, result) => {
            // 保存进度
            await storage.save(task);
          },
        });

        console.log('');
        console.log(chalk.green('✓ 任务执行完成'));

        // 检查是否全部完成
        const allDone = task.subTasks.every(s => s.status === 'done');
        if (allDone) {
          console.log('');
          console.log(chalk.green('🎉 所有子任务已完成！'));
          console.log(`运行 ${chalk.cyan(`task complete ${task.id}`)} 来提交任务`);
        }

      } catch (error) {
        spinner.fail('执行失败');
        console.error(chalk.red('错误:'), (error as Error).message);
        process.exit(1);
      }
    });

  return command;
}
