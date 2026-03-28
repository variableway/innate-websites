import { CoursePageClient } from "./client"

/**
 * 生成静态参数（SSG 模式）
 */
export function generateStaticParams() {
  // 课程页面使用通用内容，id 仅用于路由
  // 返回一个默认 ID，实际内容不依赖 id
  return [{ id: 'default' }]
}

export default function CoursePage() {
  return <CoursePageClient />
}
