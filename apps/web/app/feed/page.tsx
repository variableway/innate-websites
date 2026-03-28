import { Metadata } from 'next'
import { FeedList } from "@/components/feed/feed-list"
import { getPostsMeta } from "@/lib/content"
import { Home } from "lucide-react"

export const metadata: Metadata = {
  title: 'Feed | Innate',
  description: 'Discover stories, thinking, and expertise from writers on any topic.',
}

/**
 * ISR 配置
 * 仅在服务端模式下生效（非静态导出）
 * 60 秒重新验证
 */
export const revalidate = 60

/**
 * 动态模式配置
 * - auto: 自动选择（开发时为动态，静态导出时为静态）
 * - force-dynamic: 强制动态渲染
 * - force-static: 强制静态渲染
 */
export const dynamic = 'auto'

export default async function FeedPage() {
  // 从文件系统加载文章元数据
  const postsMeta = await getPostsMeta({ status: 'published' })

  // 转换为 FeedList 需要的格式
  const posts = postsMeta.map((meta) => ({
    slug: meta.slug,
    title: meta.title,
    summary: meta.excerpt || '',
    date: new Date(meta.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    author: {
      name: meta.author,
      avatar: '',
      role: '',
    },
    category: meta.category,
    tags: meta.tags,
    readTime: meta.readingTime,
    likes: 0,
    comments: 0,
    isEditorsPick: meta.editorsPick || false,
  }))

  return (
    <div className="max-w-3xl mx-auto py-6 px-6">
      {/* 页面头部 */}
      <div className="flex items-center gap-3 mb-8">
        <Home className="h-6 w-6 text-[#8FA68E]" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Feed</h1>
          <p className="text-sm text-muted-foreground">Discover stories, thinking, and expertise from writers on any topic.</p>
        </div>
      </div>

      {/* Feed 列表 */}
      <FeedList posts={posts} />
    </div>
  )
}
