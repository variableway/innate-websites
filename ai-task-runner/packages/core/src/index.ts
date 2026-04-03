/**
 * AI Task Runner - Core
 * 
 * 核心引擎，提供任务管理的基础功能
 */

// 类型导出
export {
  // 枚举
  TaskStatusSchema,
  PrioritySchema,
  ComplexitySchema,
  SubTaskStatusSchema,
  
  // 基础类型
  TaskMetaSchema,
  TaskRequestSchema,
  RiskSchema,
  TaskScopeSchema,
  TaskAnalysisSchema,
  PlanningStepSchema,
  TaskPlanningSchema,
  SubTaskSchema,
  GitHubIssueRefSchema,
  GitRefSchema,
  TaskSchema,
  TaskHistoryEntrySchema,
  
  // 配置类型
  GitHubConfigSchema,
  GitConfigSchema,
  AIConfigSchema,
  StorageConfigSchema,
  TaskConfigSchema,
  
  // TypeScript 类型
  type TaskStatus,
  type Priority,
  type Complexity,
  type TaskMeta,
  type TaskRequest,
  type Risk,
  type TaskScope,
  type TaskAnalysis,
  type PlanningStep,
  type TaskPlanning,
  type SubTaskStatus,
  type SubTask,
  type GitHubIssueRef,
  type GitRef,
  type Task,
  type TaskHistoryEntry,
  type GitHubConfig,
  type GitConfig,
  type AIConfig,
  type StorageConfig,
  type TaskConfig,
  type ExecutionResult,
  type SubTaskExecutionResult,
} from './types';

// 工具函数
export { generateTaskId, generateSubTaskId, isValidTaskId } from './utils/id';

// Markdown 解析器
export {
  parseTaskFile,
  serializeTaskToMarkdown,
  type ParsedTaskFile,
} from './parser/markdown';

// 存储适配器
export {
  LocalStorage,
  type StorageAdapter,
  type ListFilters,
} from './storage/local';

// 执行器
export {
  TaskRunner,
  type ExecuteOptions,
  type TaskRunnerOptions,
} from './executor/runner';

// Git 客户端
export { GitClient, type GitClientOptions } from './git/client';

// GitHub 客户端
export { GitHubClient, type GitHubClientOptions } from './github/client';

// 版本信息
export const VERSION = '1.0.0';
