/**
 * 路径工具
 */

import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export function ensureTasksDirectory(basePath: string = './tasks'): string {
  const activeDir = join(basePath, 'active');
  const archiveDir = join(basePath, 'archive');

  if (!existsSync(activeDir)) {
    mkdirSync(activeDir, { recursive: true });
  }

  if (!existsSync(archiveDir)) {
    mkdirSync(archiveDir, { recursive: true });
  }

  return basePath;
}
