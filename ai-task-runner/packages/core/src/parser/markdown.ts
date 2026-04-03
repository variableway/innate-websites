/**
 * Markdown 任务文件解析器
 */

import { parse as parseYaml } from 'yaml';
import type { Task, TaskMeta, SubTask } from '../types';
import { generateSubTaskId } from '../utils/id';

export interface ParsedTaskFile {
  frontmatter: Record<string, unknown>;
  content: string;
  subTasks: SubTask[];
  analysis: {
    complexity?: string;
    estimatedHours?: number;
    scope?: {
      files: string[];
      modules: string[];
      apis?: string[];
    };
    risks?: Array<{
      level: 'low' | 'medium' | 'high';
      description: string;
      mitigation?: string;
    }>;
  };
  planning: {
    approach?: string;
    alternatives?: string[];
    steps?: Array<{
      id: string;
      title: string;
      description?: string;
      order: number;
    }>;
    testing?: string;
    rollback?: string;
  };
}

/**
 * 解析任务文件内容
 */
export function parseTaskFile(content: string): ParsedTaskFile {
  // 提取 frontmatter
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  
  if (!frontmatterMatch) {
    throw new Error('Invalid task file: missing YAML frontmatter');
  }

  const frontmatterRaw = frontmatterMatch[1];
  const markdownContent = content.slice(frontmatterMatch[0].length);

  // 解析 YAML
  let frontmatter: Record<string, unknown>;
  try {
    frontmatter = parseYaml(frontmatterRaw) as Record<string, unknown>;
  } catch (error) {
    throw new Error(`Failed to parse YAML frontmatter: ${(error as Error).message}`);
  }

  // 解析 Markdown 内容
  const subTasks = extractSubTasks(markdownContent, frontmatter.id as string);
  const analysis = extractAnalysis(markdownContent);
  const planning = extractPlanning(markdownContent);

  return {
    frontmatter,
    content: markdownContent,
    subTasks,
    analysis,
    planning,
  };
}

/**
 * 从 Markdown 提取子任务
 */
function extractSubTasks(content: string, taskId: string): SubTask[] {
  const subTasks: SubTask[] = [];
  
  // 匹配子任务列表项
  // 格式: - [ ] 1. 任务标题 或 - [x] 1. 任务标题
  const taskRegex = /^- \[([ x])\]\s*(\d+)\.\s*(.+)$/gm;
  let match;
  let index = 0;

  while ((match = taskRegex.exec(content)) !== null) {
    const isDone = match[1] === 'x';
    const order = parseInt(match[2], 10);
    const title = match[3].trim();

    subTasks.push({
      id: generateSubTaskId(taskId, index),
      stepId: String(order),
      title,
      status: isDone ? 'done' : 'pending',
    });

    index++;
  }

  return subTasks;
}

/**
 * 从 Markdown 提取分析信息
 */
function extractAnalysis(content: string): ParsedTaskFile['analysis'] {
  const analysis: ParsedTaskFile['analysis'] = {
    scope: { files: [], modules: [] },
    risks: [],
  };

  // 提取复杂度
  const complexityMatch = content.match(/###?\s*复杂度.*\n.*?(trivial|low|medium|high|complex)/i);
  if (complexityMatch) {
    analysis.complexity = complexityMatch[1].toLowerCase();
  }

  // 提取预估工时
  const hoursMatch = content.match(/预估工时.*?(\d+(?:-\d+)?)\s*小时?/i);
  if (hoursMatch) {
    const hours = hoursMatch[1];
    if (hours.includes('-')) {
      const [min, max] = hours.split('-').map(Number);
      analysis.estimatedHours = (min + max) / 2;
    } else {
      analysis.estimatedHours = parseInt(hours, 10);
    }
  }

  // 提取影响范围
  const scopeSection = extractSection(content, '影响范围');
  if (scopeSection) {
    // 提取文件
    const filesMatch = scopeSection.match(/[-*]\s*`?([^`\n]+\.(ts|js|tsx|jsx|py|go|rs|java))`?/gi);
    if (filesMatch) {
      analysis.scope!.files = filesMatch.map(f => 
        f.replace(/^[-*]\s*`?/, '').replace(/`?$/, '')
      );
    }

    // 提取模块
    const modulesMatch = scopeSection.match(/[-*]\s*([^-\n]+?模块|module[^-\n]*)/gi);
    if (modulesMatch) {
      analysis.scope!.modules = modulesMatch.map(m => 
        m.replace(/^[-*]\s*/, '').trim()
      );
    }
  }

  // 提取风险
  const risksSection = extractSection(content, '风险评估');
  if (risksSection) {
    const riskPattern = /(\d+)\.\s*\*\*(high|medium|low)\*\*[:\s-]+(.+?)(?=\d+\.\s*\*\*|$)/gis;
    let riskMatch;
    while ((riskMatch = riskPattern.exec(risksSection)) !== null) {
      const level = riskMatch[2].toLowerCase() as 'low' | 'medium' | 'high';
      const description = riskMatch[3].trim();
      
      // 提取缓解措施
      const mitigationMatch = description.match(/缓解措施[:\s-]+(.+)/i);
      const mitigation = mitigationMatch ? mitigationMatch[1].trim() : undefined;
      const cleanDescription = description.replace(/缓解措施[:\s-]+.+/i, '').trim();

      analysis.risks!.push({
        level,
        description: cleanDescription,
        mitigation,
      });
    }
  }

  return analysis;
}

/**
 * 从 Markdown 提取计划信息
 */
function extractPlanning(content: string): ParsedTaskFile['planning'] {
  const planning: ParsedTaskFile['planning'] = {};

  // 提取方案概述
  const approachSection = extractSection(content, '方案概述|执行计划');
  if (approachSection) {
    planning.approach = approachSection.slice(0, 500).trim();
  }

  // 提取备选方案
  const alternativesSection = extractSection(content, '备选方案');
  if (alternativesSection) {
    planning.alternatives = alternativesSection
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.replace(/^[-*]\s*/, '').trim());
  }

  // 提取实施步骤
  const stepsSection = extractSection(content, '实施步骤');
  if (stepsSection) {
    planning.steps = [];
    const stepPattern = /(\d+)\.\s*\*?\*?(.+?)\*?\*?(?:\s*\((\d+)min\))?/gi;
    let stepMatch;
    while ((stepMatch = stepPattern.exec(stepsSection)) !== null) {
      planning.steps.push({
        id: `step-${stepMatch[1]}`,
        title: stepMatch[2].trim(),
        order: parseInt(stepMatch[1], 10),
      });
    }
  }

  // 提取测试策略
  const testingMatch = content.match(/##?\s*测试策略\n([\s\S]*?)(?=##|\n##|$)/);
  if (testingMatch) {
    planning.testing = testingMatch[1].trim();
  }

  return planning;
}

/**
 * 提取 Markdown 章节内容
 */
function extractSection(content: string, sectionNames: string): string | null {
  const patterns = sectionNames.split('|').map(name => {
    // 匹配 ## 或 ### 开头的章节
    return `##?\\s*${name}\\n([\\s\\S]*?)(?=##?\\s|$)`;
  });

  for (const pattern of patterns) {
    const match = content.match(new RegExp(pattern, 'i'));
    if (match) {
      return match[1].trim();
    }
  }

  return null;
}

/**
 * 将 Task 对象序列化为 Markdown
 */
export function serializeTaskToMarkdown(task: Task): string {
  const lines: string[] = [];

  // YAML frontmatter
  lines.push('---');
  lines.push(`id: "${task.id}"`);
  lines.push('meta:');
  lines.push(`  title: "${escapeYaml(task.meta.title)}"`);
  if (task.meta.description) {
    lines.push(`  description: "${escapeYaml(task.meta.description)}"`);
  }
  if (task.meta.author) {
    lines.push(`  author: "${task.meta.author}"`);
  }
  if (task.meta.labels.length > 0) {
    lines.push(`  labels: [${task.meta.labels.map(l => `"${l}"`).join(', ')}]`);
  }
  lines.push(`  priority: ${task.meta.priority}`);
  
  lines.push(`status: ${task.status}`);
  lines.push(`createdAt: "${task.createdAt}"`);
  lines.push(`updatedAt: "${task.updatedAt}"`);
  if (task.completedAt) {
    lines.push(`completedAt: "${task.completedAt}"`);
  }

  if (task.github) {
    lines.push('github:');
    lines.push(`  number: ${task.github.number}`);
    lines.push(`  url: "${task.github.url}"`);
    lines.push(`  state: ${task.github.state}`);
  }

  if (task.git) {
    lines.push('git:');
    lines.push(`  branch: "${task.git.branch}"`);
    lines.push(`  baseBranch: "${task.git.baseBranch}"`);
  }

  lines.push('---');
  lines.push('');

  // 内容部分
  if (task.request.original) {
    lines.push('## 原始需求');
    lines.push('');
    lines.push(task.request.original);
    lines.push('');
  }

  // AI 分析
  if (task.analysis) {
    lines.push('## AI 分析');
    lines.push('');
    lines.push(`### 复杂度评估`);
    lines.push(`**等级**: ${task.analysis.complexity}`);
    if (task.analysis.estimatedHours) {
      lines.push(`**预估工时**: ${task.analysis.estimatedHours} 小时`);
    }
    lines.push('');

    if (task.analysis.scope.files.length > 0 || task.analysis.scope.modules.length > 0) {
      lines.push('### 影响范围');
      lines.push('');
      if (task.analysis.scope.files.length > 0) {
        lines.push('**文件**:');
        task.analysis.scope.files.forEach(f => lines.push(`- \`${f}\``));
        lines.push('');
      }
      if (task.analysis.scope.modules.length > 0) {
        lines.push('**模块**:');
        task.analysis.scope.modules.forEach(m => lines.push(`- ${m}`));
        lines.push('');
      }
      lines.push('');
    }

    if (task.analysis.risks.length > 0) {
      lines.push('### 风险评估');
      lines.push('');
      task.analysis.risks.forEach((risk, i) => {
        lines.push(`${i + 1}. **${risk.level}**: ${risk.description}`);
        if (risk.mitigation) {
          lines.push(`   - **缓解措施**: ${risk.mitigation}`);
        }
      });
      lines.push('');
    }
  }

  // 执行计划
  if (task.planning) {
    lines.push('## 执行计划');
    lines.push('');
    
    if (task.planning.approach) {
      lines.push('### 方案概述');
      lines.push('');
      lines.push(task.planning.approach);
      lines.push('');
    }

    if (task.planning.alternatives && task.planning.alternatives.length > 0) {
      lines.push('### 备选方案');
      lines.push('');
      task.planning.alternatives.forEach(alt => lines.push(`- ${alt}`));
      lines.push('');
    }

    if (task.planning.steps.length > 0) {
      lines.push('### 实施步骤');
      lines.push('');
      task.planning.steps
        .sort((a, b) => a.order - b.order)
        .forEach(step => {
          lines.push(`${step.order}. ${step.title}`);
          if (step.description) {
            lines.push(`   ${step.description}`);
          }
        });
      lines.push('');
    }

    if (task.planning.testing) {
      lines.push('### 测试策略');
      lines.push('');
      lines.push(task.planning.testing);
      lines.push('');
    }
  }

  // 子任务
  if (task.subTasks.length > 0) {
    lines.push('## 子任务');
    lines.push('');
    task.subTasks
      .sort((a, b) => parseInt(a.stepId, 10) - parseInt(b.stepId, 10))
      .forEach(subTask => {
        const checkbox = subTask.status === 'done' ? '[x]' : '[ ]';
        lines.push(`- ${checkbox} ${subTask.stepId}. ${subTask.title}`);
      });
    lines.push('');
  }

  // 执行笔记区域
  lines.push('## 执行笔记');
  lines.push('');
  lines.push('<!-- 执行过程中记录笔记 -->');
  lines.push('');

  return lines.join('\n');
}

/**
 * 转义 YAML 字符串中的特殊字符
 */
function escapeYaml(str: string): string {
  return str.replace(/"/g, '\\"').replace(/\n/g, '\\n');
}
