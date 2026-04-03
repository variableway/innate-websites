#!/usr/bin/env node
/**
 * AI Task Runner - MCP Server
 * 
 * 实现 Model Context Protocol，让 AI 工具可以通过标准接口操作任务
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { 
  TaskRunner, 
  LocalStorage, 
  parseTaskFile,
  serializeTaskToMarkdown,
  generateTaskId,
  type Task,
} from '@innate/ai-task-core';

// 配置
const STORAGE_PATH = process.env.TASK_STORAGE_PATH || './tasks';
const storage = new LocalStorage({ basePath: STORAGE_PATH });

// 创建 MCP Server
const server = new Server(
  {
    name: 'ai-task-runner',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// ============================================================================
// Tools
// ============================================================================

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'create_task',
        description: '从标题和描述创建新任务',
        inputSchema: {
          type: 'object',
          properties: {
            title: { 
              type: 'string', 
              description: '任务标题' 
            },
            description: { 
              type: 'string', 
              description: '任务描述' 
            },
            priority: { 
              type: 'string', 
              enum: ['low', 'medium', 'high', 'critical'],
              description: '优先级' 
            },
            labels: {
              type: 'array',
              items: { type: 'string' },
              description: '标签列表'
            },
          },
          required: ['title'],
        },
      },
      {
        name: 'get_task',
        description: '获取任务详情',
        inputSchema: {
          type: 'object',
          properties: {
            taskId: { 
              type: 'string', 
              description: '任务ID' 
            },
          },
          required: ['taskId'],
        },
      },
      {
        name: 'list_tasks',
        description: '列出任务',
        inputSchema: {
          type: 'object',
          properties: {
            status: { 
              type: 'string', 
              enum: ['draft', 'planned', 'in_progress', 'completed', 'all'],
              description: '状态过滤' 
            },
            limit: {
              type: 'number',
              description: '返回数量限制'
            },
          },
        },
      },
      {
        name: 'update_task_status',
        description: '更新任务状态',
        inputSchema: {
          type: 'object',
          properties: {
            taskId: { type: 'string' },
            status: { 
              type: 'string', 
              enum: ['draft', 'planned', 'in_progress', 'completed', 'cancelled'] 
            },
          },
          required: ['taskId', 'status'],
        },
      },
      {
        name: 'update_subtask_status',
        description: '更新子任务状态',
        inputSchema: {
          type: 'object',
          properties: {
            taskId: { type: 'string' },
            subTaskId: { type: 'string' },
            status: { 
              type: 'string', 
              enum: ['pending', 'in_progress', 'done', 'blocked', 'skipped'] 
            },
            note: {
              type: 'string',
              description: '执行笔记'
            },
          },
          required: ['taskId', 'subTaskId', 'status'],
        },
      },
      {
        name: 'add_subtask_note',
        description: '添加子任务笔记',
        inputSchema: {
          type: 'object',
          properties: {
            taskId: { type: 'string' },
            subTaskId: { type: 'string' },
            note: { type: 'string' },
          },
          required: ['taskId', 'subTaskId', 'note'],
        },
      },
      {
        name: 'complete_task',
        description: '完成任务并归档',
        inputSchema: {
          type: 'object',
          properties: {
            taskId: { type: 'string' },
            skipCommit: { type: 'boolean' },
            skipClose: { type: 'boolean' },
          },
          required: ['taskId'],
        },
      },
      {
        name: 'delete_task',
        description: '删除任务',
        inputSchema: {
          type: 'object',
          properties: {
            taskId: { type: 'string' },
          },
          required: ['taskId'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'create_task': {
        const task = TaskRunner.create({
          title: args.title as string,
          description: args.description as string | undefined,
          priority: (args.priority as Task['meta']['priority']) || 'medium',
          labels: (args.labels as string[]) || [],
        });

        await storage.save(task);

        return {
          content: [
            {
              type: 'text',
              text: `任务创建成功:\nID: ${task.id}\n标题: ${task.meta.title}\n文件: ${STORAGE_PATH}/active/${task.id}.md`,
            },
          ],
        };
      }

      case 'get_task': {
        const task = await storage.load(args.taskId as string);
        
        if (!task) {
          return {
            content: [{ type: 'text', text: `任务不存在: ${args.taskId}` }],
            isError: true,
          };
        }

        const subTasksText = task.subTasks
          .map(s => `  ${s.status === 'done' ? '✓' : '○'} ${s.stepId}. ${s.title}`)
          .join('\n');

        return {
          content: [
            {
              type: 'text',
              text: `任务详情:\n\nID: ${task.id}\n标题: ${task.meta.title}\n状态: ${task.status}\n优先级: ${task.meta.priority}\n\n子任务:\n${subTasksText || '  无子任务'}`,
            },
          ],
        };
      }

      case 'list_tasks': {
        const filters: any = {};
        if (args.status && args.status !== 'all') {
          filters.status = args.status as string;
        }

        const tasks = await storage.list(filters);
        const limited = args.limit ? tasks.slice(0, args.limit as number) : tasks;

        const tasksText = limited
          .map(t => `${t.id} | ${t.status.padEnd(12)} | ${t.meta.title}`)
          .join('\n');

        return {
          content: [
            {
              type: 'text',
              text: `任务列表 (${limited.length}/${tasks.length}):\n\nID | 状态 | 标题\n${tasksText}`,
            },
          ],
        };
      }

      case 'update_task_status': {
        const task = await storage.load(args.taskId as string);
        
        if (!task) {
          return {
            content: [{ type: 'text', text: `任务不存在: ${args.taskId}` }],
            isError: true,
          };
        }

        task.status = args.status as Task['status'];
        task.updatedAt = new Date().toISOString();
        
        if (args.status === 'completed') {
          task.completedAt = new Date().toISOString();
        }

        await storage.save(task);

        return {
          content: [
            { type: 'text', text: `任务状态已更新: ${task.id} → ${task.status}` },
          ],
        };
      }

      case 'update_subtask_status': {
        const task = await storage.load(args.taskId as string);
        
        if (!task) {
          return {
            content: [{ type: 'text', text: `任务不存在: ${args.taskId}` }],
            isError: true,
          };
        }

        const subTask = task.subTasks.find(s => s.id === args.subTaskId);
        
        if (!subTask) {
          return {
            content: [{ type: 'text', text: `子任务不存在: ${args.subTaskId}` }],
            isError: true,
          };
        }

        subTask.status = args.status as any;
        
        if (args.status === 'done') {
          subTask.completedAt = new Date().toISOString();
        }

        if (args.note) {
          subTask.notes = subTask.notes || [];
          subTask.notes.push(args.note as string);
        }

        task.updatedAt = new Date().toISOString();
        await storage.save(task);

        return {
          content: [
            { type: 'text', text: `子任务状态已更新: ${subTask.title} → ${args.status}` },
          ],
        };
      }

      case 'add_subtask_note': {
        const task = await storage.load(args.taskId as string);
        
        if (!task) {
          return {
            content: [{ type: 'text', text: `任务不存在: ${args.taskId}` }],
            isError: true,
          };
        }

        const subTask = task.subTasks.find(s => s.id === args.subTaskId);
        
        if (!subTask) {
          return {
            content: [{ type: 'text', text: `子任务不存在: ${args.subTaskId}` }],
            isError: true,
          };
        }

        subTask.notes = subTask.notes || [];
        subTask.notes.push(args.note as string);
        
        task.updatedAt = new Date().toISOString();
        await storage.save(task);

        return {
          content: [{ type: 'text', text: '笔记已添加' }],
        };
      }

      case 'complete_task': {
        const task = await storage.load(args.taskId as string);
        
        if (!task) {
          return {
            content: [{ type: 'text', text: `任务不存在: ${args.taskId}` }],
            isError: true,
          };
        }

        task.status = 'completed';
        task.completedAt = new Date().toISOString();
        task.updatedAt = new Date().toISOString();

        await storage.save(task);
        await storage.archive(task.id);

        return {
          content: [
            { type: 'text', text: `任务已完成并归档: ${task.id}` },
          ],
        };
      }

      case 'delete_task': {
        await storage.delete(args.taskId as string);

        return {
          content: [{ type: 'text', text: `任务已删除: ${args.taskId}` }],
        };
      }

      default:
        return {
          content: [{ type: 'text', text: `未知工具: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `错误: ${(error as Error).message}` }],
      isError: true,
    };
  }
});

// ============================================================================
// Resources
// ============================================================================

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const tasks = await storage.list();

  return {
    resources: tasks.map(task => ({
      uri: `task://${task.id}`,
      mimeType: 'application/json',
      name: task.meta.title,
      description: `Task ${task.id} - ${task.status}`,
    })),
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri.startsWith('task://')) {
    const taskId = uri.replace('task://', '');
    const task = await storage.load(taskId);

    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(task, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// ============================================================================
// Start Server
// ============================================================================

async function main() {
  await storage.initialize();

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('AI Task Runner MCP Server started');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
