/**
 * 本地文件系统存储实现
 */

import { readFile, writeFile, mkdir, readdir, access } from 'fs/promises';
import { join, dirname } from 'path';
import type { Task, TaskConfig } from '../types';
import { TaskSchema } from '../types';
import { parseTaskFile, serializeTaskToMarkdown } from '../parser/markdown';

export interface StorageAdapter {
  save(task: Task): Promise<void>;
  load(taskId: string): Promise<Task | null>;
  list(filters?: ListFilters): Promise<Task[]>;
  delete(taskId: string): Promise<void>;
  archive(taskId: string): Promise<void>;
}

export interface ListFilters {
  status?: Task['status'] | Task['status'][];
  priority?: Task['meta']['priority'];
  labels?: string[];
  createdAfter?: Date;
  createdBefore?: Date;
}

export class LocalStorage implements StorageAdapter {
  private basePath: string;
  private activeDir: string;
  private archiveDir: string;

  constructor(config: { basePath?: string } = {}) {
    this.basePath = config.basePath || './tasks';
    this.activeDir = join(this.basePath, 'active');
    this.archiveDir = join(this.basePath, 'archive');
  }

  /**
   * 初始化存储目录
   */
  async initialize(): Promise<void> {
    await mkdir(this.activeDir, { recursive: true });
    await mkdir(this.archiveDir, { recursive: true });
  }

  /**
   * 保存任务
   */
  async save(task: Task): Promise<void> {
    await this.initialize();

    const taskFile = join(this.activeDir, `${task.id}.md`);
    const metaFile = join(this.activeDir, `${task.id}.json`);

    // 序列化为 Markdown
    const markdown = serializeTaskToMarkdown(task);

    // 保存 Markdown 文件
    await writeFile(taskFile, markdown, 'utf-8');

    // 保存 JSON 元数据（便于程序读取）
    const metadata = {
      id: task.id,
      title: task.meta.title,
      status: task.status,
      priority: task.meta.priority,
      labels: task.meta.labels,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      completedAt: task.completedAt,
      github: task.github,
      git: task.git,
      subTaskCount: task.subTasks.length,
      completedSubTaskCount: task.subTasks.filter(s => s.status === 'done').length,
    };

    await writeFile(metaFile, JSON.stringify(metadata, null, 2), 'utf-8');
  }

  /**
   * 加载任务
   */
  async load(taskId: string): Promise<Task | null> {
    const taskFile = join(this.activeDir, `${taskId}.md`);
    const archiveFile = join(this.archiveDir, `${taskId}.md`);

    // 先尝试在活动目录查找
    let filePath = taskFile;
    try {
      await access(taskFile);
    } catch {
      // 尝试在归档目录查找
      try {
        await access(archiveFile);
        filePath = archiveFile;
      } catch {
        return null;
      }
    }

    try {
      const content = await readFile(filePath, 'utf-8');
      const parsed = parseTaskFile(content);

      // 构建完整的 Task 对象
      const task: Task = {
        id: parsed.frontmatter.id as string,
        meta: {
          title: (parsed.frontmatter.meta as Task['meta'])?.title || 'Untitled',
          description: (parsed.frontmatter.meta as Task['meta'])?.description,
          author: (parsed.frontmatter.meta as Task['meta'])?.author,
          labels: (parsed.frontmatter.meta as Task['meta'])?.labels || [],
          priority: (parsed.frontmatter.meta as Task['meta'])?.priority || 'medium',
        },
        request: {
          original: parsed.content.match(/## 原始需求\n+([\s\S]*?)(?=\n##|$)/)?.[1]?.trim() || '',
        },
        analysis: parsed.frontmatter.analysis as Task['analysis'] || {
          complexity: 'medium',
          scope: { files: [], modules: [] },
          risks: [],
        },
        planning: parsed.frontmatter.planning as Task['planning'],
        subTasks: parsed.subTasks,
        status: (parsed.frontmatter.status as Task['status']) || 'draft',
        github: parsed.frontmatter.github as Task['github'],
        git: parsed.frontmatter.git as Task['git'],
        createdAt: (parsed.frontmatter.createdAt as string) || new Date().toISOString(),
        updatedAt: (parsed.frontmatter.updatedAt as string) || new Date().toISOString(),
        completedAt: parsed.frontmatter.completedAt as string | undefined,
      };

      // 验证任务对象
      const result = TaskSchema.safeParse(task);
      if (!result.success) {
        console.warn(`Task validation warning for ${taskId}:`, result.error);
      }

      return task;
    } catch (error) {
      console.error(`Failed to load task ${taskId}:`, error);
      return null;
    }
  }

  /**
   * 列出任务
   */
  async list(filters: ListFilters = {}): Promise<Task[]> {
    await this.initialize();

    const tasks: Task[] = [];
    
    // 读取活动目录
    const files = await readdir(this.activeDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    for (const file of mdFiles) {
      const taskId = file.replace('.md', '');
      const task = await this.load(taskId);
      
      if (task && this.matchesFilters(task, filters)) {
        tasks.push(task);
      }
    }

    // 按创建时间倒序排序
    return tasks.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * 删除任务
   */
  async delete(taskId: string): Promise<void> {
    const taskFile = join(this.activeDir, `${taskId}.md`);
    const metaFile = join(this.activeDir, `${taskId}.json`);

    try {
      await access(taskFile);
      await writeFile(taskFile, '', 'utf-8');
      await writeFile(metaFile, '', 'utf-8');
    } catch {
      // 文件不存在，忽略
    }
  }

  /**
   * 归档任务
   */
  async archive(taskId: string): Promise<void> {
    const taskFile = join(this.activeDir, `${taskId}.md`);
    const metaFile = join(this.activeDir, `${taskId}.json`);
    const archiveTaskFile = join(this.archiveDir, `${taskId}.md`);
    const archiveMetaFile = join(this.archiveDir, `${taskId}.json`);

    try {
      // 移动 Markdown 文件
      const content = await readFile(taskFile, 'utf-8');
      await writeFile(archiveTaskFile, content, 'utf-8');
      await writeFile(taskFile, '', 'utf-8');

      // 移动 JSON 文件
      try {
        const meta = await readFile(metaFile, 'utf-8');
        await writeFile(archiveMetaFile, meta, 'utf-8');
        await writeFile(metaFile, '', 'utf-8');
      } catch {
        // JSON 文件可能不存在
      }
    } catch {
      throw new Error(`Task not found: ${taskId}`);
    }
  }

  /**
   * 检查任务是否匹配过滤器
   */
  private matchesFilters(task: Task, filters: ListFilters): boolean {
    // 状态过滤
    if (filters.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      if (!statuses.includes(task.status)) {
        return false;
      }
    }

    // 优先级过滤
    if (filters.priority && task.meta.priority !== filters.priority) {
      return false;
    }

    // 标签过滤
    if (filters.labels && filters.labels.length > 0) {
      const hasLabel = filters.labels.some(label => task.meta.labels.includes(label));
      if (!hasLabel) {
        return false;
      }
    }

    // 创建时间过滤
    if (filters.createdAfter) {
      if (new Date(task.createdAt) < filters.createdAfter) {
        return false;
      }
    }

    if (filters.createdBefore) {
      if (new Date(task.createdAt) > filters.createdBefore) {
        return false;
      }
    }

    return true;
  }
}
