/**
 * 任务执行器
 */

import type { Task, SubTask, TaskAnalysis, TaskPlanning, ExecutionResult, SubTaskExecutionResult } from '../types';
import type { StorageAdapter } from '../storage/local';

export interface ExecuteOptions {
  dryRun?: boolean;
  stopOnError?: boolean;
  fromSubTask?: string;
  beforeEach?: (subTask: SubTask) => Promise<boolean>;
  afterEach?: (subTask: SubTask, result: SubTaskExecutionResult) => Promise<void>;
}

export interface TaskRunnerOptions {
  storage: StorageAdapter;
}

export class TaskRunner {
  private storage: StorageAdapter;

  constructor(options: TaskRunnerOptions) {
    this.storage = options.storage;
  }

  /**
   * 创建新任务
   */
  static create(params: {
    title: string;
    description?: string;
    priority?: Task['meta']['priority'];
    labels?: string[];
  }): Task {
    const { generateTaskId } = require('../utils/id');
    const now = new Date().toISOString();

    return {
      id: generateTaskId(),
      meta: {
        title: params.title,
        description: params.description,
        labels: params.labels || [],
        priority: params.priority || 'medium',
      },
      request: {
        original: params.description || params.title,
      },
      subTasks: [],
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * 分析任务
   * 注：AI 分析需要外部 AI 服务，这里提供接口
   */
  async analyze(
    task: Task,
    analyzer: (task: Task) => Promise<TaskAnalysis>
  ): Promise<Task> {
    task.status = 'analyzing';
    task.updatedAt = new Date().toISOString();
    await this.storage.save(task);

    try {
      task.analysis = await analyzer(task);
      task.status = 'planned';
    } catch (error) {
      task.status = 'failed';
      throw error;
    }

    task.updatedAt = new Date().toISOString();
    await this.storage.save(task);

    return task;
  }

  /**
   * 生成执行计划
   * 注：计划生成需要外部 AI 服务，这里提供接口
   */
  async plan(
    task: Task,
    planner: (task: Task) => Promise<TaskPlanning>
  ): Promise<Task> {
    if (!task.analysis) {
      throw new Error('Task must be analyzed before planning');
    }

    task.planning = await planner(task);

    // 从计划生成子任务
    if (task.planning.steps) {
      task.subTasks = task.planning.steps.map((step, index) => ({
        id: `st-${task.id}-${String(index + 1).padStart(3, '0')}`,
        stepId: step.id,
        title: step.title,
        status: 'pending',
      }));
    }

    task.status = 'planned';
    task.updatedAt = new Date().toISOString();
    await this.storage.save(task);

    return task;
  }

  /**
   * 执行子任务
   */
  async execute(
    task: Task,
    executor: (subTask: SubTask) => Promise<SubTaskExecutionResult>,
    options: ExecuteOptions = {}
  ): Promise<Task> {
    const { dryRun = false, stopOnError = true, fromSubTask } = options;

    task.status = 'in_progress';
    task.updatedAt = new Date().toISOString();
    await this.storage.save(task);

    let startFromIndex = 0;
    if (fromSubTask) {
      startFromIndex = task.subTasks.findIndex(s => s.id === fromSubTask);
      if (startFromIndex === -1) startFromIndex = 0;
    }

    for (let i = startFromIndex; i < task.subTasks.length; i++) {
      const subTask = task.subTasks[i];

      // 跳过已完成的子任务
      if (subTask.status === 'done') continue;

      // 执行前回调
      if (options.beforeEach) {
        const shouldContinue = await options.beforeEach(subTask);
        if (!shouldContinue) break;
      }

      // 检查依赖
      const depsSatisfied = this.checkDependencies(subTask, task.subTasks);
      if (!depsSatisfied) {
        subTask.status = 'blocked';
        continue;
      }

      subTask.status = 'in_progress';
      subTask.startedAt = new Date().toISOString();
      await this.storage.save(task);

      if (dryRun) {
        console.log(`[DRY RUN] Would execute: ${subTask.title}`);
        subTask.status = 'done';
        subTask.completedAt = new Date().toISOString();
      } else {
        try {
          const result = await executor(subTask);

          if (result.success) {
            subTask.status = 'done';
            subTask.completedAt = new Date().toISOString();
            if (result.filesModified) {
              subTask.files = result.filesModified;
            }
            if (result.output) {
              subTask.notes = subTask.notes || [];
              subTask.notes.push(result.output);
            }
          } else {
            subTask.status = 'blocked';
            if (result.error) {
              subTask.notes = subTask.notes || [];
              subTask.notes.push(`Error: ${result.error}`);
            }

            if (stopOnError) {
              task.status = 'failed';
              await this.storage.save(task);
              throw new Error(`SubTask failed: ${subTask.title} - ${result.error}`);
            }
          }

          // 执行后回调
          if (options.afterEach) {
            await options.afterEach(subTask, result);
          }
        } catch (error) {
          subTask.status = 'failed';
          subTask.notes = subTask.notes || [];
          subTask.notes.push(`Exception: ${(error as Error).message}`);

          if (stopOnError) {
            task.status = 'failed';
            await this.storage.save(task);
            throw error;
          }
        }
      }

      task.updatedAt = new Date().toISOString();
      await this.storage.save(task);
    }

    // 检查是否全部完成
    const allDone = task.subTasks.every(s => s.status === 'done');
    if (allDone) {
      task.status = 'completed';
      task.completedAt = new Date().toISOString();
    } else {
      const hasFailed = task.subTasks.some(s => s.status === 'blocked');
      if (hasFailed) {
        task.status = 'failed';
      } else {
        task.status = 'in_progress';
      }
    }

    await this.storage.save(task);
    return task;
  }

  /**
   * 检查子任务依赖是否满足
   */
  private checkDependencies(subTask: SubTask, allSubTasks: SubTask[]): boolean {
    // 从 planning step 获取依赖信息
    // 简化实现：检查前面的任务是否完成
    const currentIndex = allSubTasks.findIndex(s => s.id === subTask.id);
    
    for (let i = 0; i < currentIndex; i++) {
      if (allSubTasks[i].status !== 'done') {
        return false;
      }
    }

    return true;
  }

  /**
   * 完成任务
   */
  async complete(task: Task): Promise<Task> {
    task.status = 'completed';
    task.completedAt = new Date().toISOString();
    task.updatedAt = new Date().toISOString();
    
    await this.storage.save(task);
    await this.storage.archive(task.id);

    return task;
  }
}
