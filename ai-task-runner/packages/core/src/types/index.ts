/**
 * AI Task Runner - Core Types
 * 
 * 定义任务系统的所有类型接口
 */

import { z } from 'zod';

// ============================================================================
// 基础类型定义
// ============================================================================

export const TaskStatusSchema = z.enum([
  'draft',
  'analyzing',
  'planned',
  'in_progress',
  'review_needed',
  'completed',
  'failed',
  'cancelled',
]);

export const PrioritySchema = z.enum(['low', 'medium', 'high', 'critical']);

export const ComplexitySchema = z.enum([
  'trivial',
  'low',
  'medium',
  'high',
  'complex',
]);

export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type Priority = z.infer<typeof PrioritySchema>;
export type Complexity = z.infer<typeof ComplexitySchema>;

// ============================================================================
// 任务元数据
// ============================================================================

export const TaskMetaSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  author: z.string().optional(),
  labels: z.array(z.string()).default([]),
  priority: PrioritySchema.default('medium'),
});

export type TaskMeta = z.infer<typeof TaskMetaSchema>;

// ============================================================================
// 任务请求
// ============================================================================

export const TaskRequestSchema = z.object({
  original: z.string(),
  sourceFile: z.string().optional(),
});

export type TaskRequest = z.infer<typeof TaskRequestSchema>;

// ============================================================================
// AI 分析结果
// ============================================================================

export const RiskSchema = z.object({
  level: z.enum(['low', 'medium', 'high']),
  description: z.string(),
  mitigation: z.string().optional(),
});

export const TaskScopeSchema = z.object({
  files: z.array(z.string()),
  modules: z.array(z.string()),
  apis: z.array(z.string()).optional(),
});

export const TaskAnalysisSchema = z.object({
  complexity: ComplexitySchema,
  estimatedHours: z.number().optional(),
  scope: TaskScopeSchema,
  risks: z.array(RiskSchema).default([]),
  decisions: z
    .array(
      z.object({
        question: z.string(),
        options: z.array(z.string()),
        recommended: z.string().optional(),
      })
    )
    .optional(),
});

export type Risk = z.infer<typeof RiskSchema>;
export type TaskScope = z.infer<typeof TaskScopeSchema>;
export type TaskAnalysis = z.infer<typeof TaskAnalysisSchema>;

// ============================================================================
// 执行计划
// ============================================================================

export const PlanningStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  order: z.number().int().min(0),
  estimatedMinutes: z.number().int().optional(),
  dependencies: z.array(z.string()).optional(),
});

export const TaskPlanningSchema = z.object({
  approach: z.string(),
  alternatives: z.array(z.string()).optional(),
  steps: z.array(PlanningStepSchema),
  testing: z.string().optional(),
  rollback: z.string().optional(),
});

export type PlanningStep = z.infer<typeof PlanningStepSchema>;
export type TaskPlanning = z.infer<typeof TaskPlanningSchema>;

// ============================================================================
// 子任务
// ============================================================================

export const SubTaskStatusSchema = z.enum([
  'pending',
  'in_progress',
  'blocked',
  'done',
  'skipped',
]);

export const SubTaskSchema = z.object({
  id: z.string(),
  stepId: z.string(),
  title: z.string(),
  status: SubTaskStatusSchema,
  files: z.array(z.string()).optional(),
  notes: z.array(z.string()).optional(),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
});

export type SubTaskStatus = z.infer<typeof SubTaskStatusSchema>;
export type SubTask = z.infer<typeof SubTaskSchema>;

// ============================================================================
// GitHub 集成
// ============================================================================

export const GitHubIssueRefSchema = z.object({
  number: z.number().int().positive(),
  url: z.string().url(),
  state: z.enum(['open', 'closed']),
  title: z.string(),
});

export type GitHubIssueRef = z.infer<typeof GitHubIssueRefSchema>;

export const GitRefSchema = z.object({
  branch: z.string(),
  baseBranch: z.string(),
  commits: z.array(z.string()).optional(),
  pr: z
    .object({
      number: z.number().int().positive(),
      url: z.string().url(),
    })
    .optional(),
});

export type GitRef = z.infer<typeof GitRefSchema>;

// ============================================================================
// 主任务类型
// ============================================================================

export const TaskSchema = z.object({
  // 唯一标识
  id: z.string().regex(/^tr-\d{8}-\d{6}-[a-z0-9]{4}$/),

  // 元数据
  meta: TaskMetaSchema,

  // 原始需求
  request: TaskRequestSchema,

  // AI 分析结果
  analysis: TaskAnalysisSchema.optional(),

  // 执行计划
  planning: TaskPlanningSchema.optional(),

  // 子任务列表
  subTasks: z.array(SubTaskSchema).default([]),

  // 执行状态
  status: TaskStatusSchema,

  // 关联的 GitHub Issue
  github: GitHubIssueRefSchema.optional(),

  // 关联的 Git 分支
  git: GitRefSchema.optional(),

  // 时间戳
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});

export type Task = z.infer<typeof TaskSchema>;

// ============================================================================
// 任务历史记录
// ============================================================================

export const TaskHistoryEntrySchema = z.object({
  action: z.enum([
    'created',
    'updated',
    'started',
    'completed',
    'failed',
    'cancelled',
    'synced',
  ]),
  timestamp: z.string().datetime(),
  details: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type TaskHistoryEntry = z.infer<typeof TaskHistoryEntrySchema>;

// ============================================================================
// 配置类型
// ============================================================================

export const GitHubConfigSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  token: z.string().optional(),
  autoCreateIssue: z.boolean().default(true),
  autoCloseIssue: z.boolean().default(true),
  issueLabels: z.array(z.string()).default(['ai-task']),
  issueTemplate: z.string().optional(),
});

export const GitConfigSchema = z.object({
  baseBranch: z.string().default('main'),
  branchPrefix: z.string().default('ai-task/'),
  autoCreateBranch: z.boolean().default(true),
  autoCommit: z.boolean().default(true),
  commitMessageTemplate: z.string().default('feat: [{id}] {title}'),
  autoPush: z.boolean().default(false),
  autoMerge: z.boolean().default(false),
});

export const AIConfigSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'custom']).default('openai'),
  model: z.string().default('gpt-4-turbo'),
  temperature: z.number().min(0).max(2).default(0.2),
  autoAnalyze: z.boolean().default(true),
  autoExecute: z.boolean().default(false),
  requireApprovalFor: z
    .array(
      z.enum([
        'delete',
        'install-deps',
        'database-migration',
        'auth-change',
        'high-complexity',
        'git-push',
      ])
    )
    .default(['delete', 'install-deps']),
});

export const StorageConfigSchema = z.object({
  type: z.enum(['local', 'remote']).default('local'),
  basePath: z.string().default('./tasks'),
  archiveCompleted: z.boolean().default(true),
});

export const TaskConfigSchema = z.object({
  version: z.string().default('1.0.0'),
  project: z
    .object({
      name: z.string(),
      type: z.enum(['simple', 'monorepo', 'microservice']).default('simple'),
      root: z.string().default('.'),
    })
    .optional(),
  ai: AIConfigSchema.default({}),
  github: GitHubConfigSchema,
  git: GitConfigSchema.default({}),
  storage: StorageConfigSchema.default({}),
});

export type GitHubConfig = z.infer<typeof GitHubConfigSchema>;
export type GitConfig = z.infer<typeof GitConfigSchema>;
export type AIConfig = z.infer<typeof AIConfigSchema>;
export type StorageConfig = z.infer<typeof StorageConfigSchema>;
export type TaskConfig = z.infer<typeof TaskConfigSchema>;

// ============================================================================
// 执行结果
// ============================================================================

export interface ExecutionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: Error;
  message?: string;
}

export interface SubTaskExecutionResult {
  subTaskId: string;
  success: boolean;
  output?: string;
  error?: string;
  filesModified?: string[];
  duration: number; // milliseconds
}
