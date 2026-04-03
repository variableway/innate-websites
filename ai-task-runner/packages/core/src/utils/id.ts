/**
 * ID 生成工具
 */

import { randomBytes } from 'crypto';

/**
 * 生成任务 ID
 * 格式: tr-{YYYYMMDD}-{HHMMSS}-{4位随机hash}
 * 示例: tr-20260401-104530-a3f9
 */
export function generateTaskId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const random = randomBytes(2).toString('hex').slice(0, 4);
  
  return `tr-${date}-${time}-${random}`;
}

/**
 * 生成子任务 ID
 * 格式: st-{taskId}-{序号}
 */
export function generateSubTaskId(taskId: string, index: number): string {
  return `st-${taskId}-${String(index + 1).padStart(3, '0')}`;
}

/**
 * 验证任务 ID 格式
 */
export function isValidTaskId(id: string): boolean {
  const pattern = /^tr-\d{8}-\d{6}-[a-z0-9]{4}$/;
  return pattern.test(id);
}
