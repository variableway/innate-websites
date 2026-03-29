// Shared types and utilities for tutorials (can be used in both server and client)

export interface Tutorial {
  slug: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  time: string
  tool: string
  prerequisites: string[]
  content: string
}

export function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高级',
  }
  return labels[difficulty] || difficulty
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  }
  return colors[difficulty] || ''
}
