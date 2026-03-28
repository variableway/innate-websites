import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleReader } from '@/components/feed/article-reader'
import { getPost, getAllPostSlugObjects, getPostsMeta } from '@/lib/content'
import type { ParsedPost, PostMeta } from '@/lib/content'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

/**
 * 生成元数据
 */
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    return {
      title: 'Article Not Found',
    }
  }
  
  const { meta } = post
  
  return {
    title: meta.title,
    description: meta.excerpt,
    openGraph: meta.cover
      ? {
          images: [{ url: meta.cover }],
        }
      : undefined,
  }
}

/**
 * 生成静态参数（SSG 模式）
 * 在服务端模式下会按需生成
 */
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  // 在生产构建时生成所有文章
  if (process.env.NODE_ENV === 'production') {
    return getAllPostSlugObjects()
  }
  
  // 开发时只生成示例
  return [{ slug: 'example-post' }]
}

/**
 * 动态模式配置
 * - auto: 自动选择
 * - force-static: 强制静态渲染（用于静态导出）
 * - force-dynamic: 强制动态渲染（用于 ISR）
 */
export const dynamic = 'auto'

/**
 * 动态路由参数配置
 * 注意：在静态导出模式下，此配置不生效
 * 需要配合 next.config.mjs 中的 dynamicParams 设置
 */
export const dynamicParams = false

/**
 * ISR 重新验证时间（秒）
 * 仅在服务端模式下生效
 */
export const revalidate = 60

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  // 获取相关文章
  const relatedPosts = await getRelatedPosts(slug, post.meta.tags, 3)

  // 转换 ParsedPost 格式为 ArticleReader 需要的格式
  const articleData = transformPostForReader(post, slug)

  return (
    <div className="py-6 px-6">
      <ArticleReader post={articleData} relatedPosts={relatedPosts} />
    </div>
  )
}

/**
 * 获取相关文章
 */
async function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  limit: number
): Promise<PostMeta[]> {
  if (tags.length === 0) return []
  
  const posts = await getPostsMeta({ status: 'published', limit: 20 })
  
  return posts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({
      ...p,
      score: p.tags.filter((t) => tags.includes(t)).length,
    }))
    .sort((a, b) => (b as PostMeta & { score: number }).score - (a as PostMeta & { score: number }).score)
    .slice(0, limit)
}

/**
 * 转换 ParsedPost 为 ArticleReader 需要的格式
 */
function transformPostForReader(post: ParsedPost, slug: string): {
  slug: string
  title: string
  summary: string
  content: string
  html: string
  date: string
  author: {
    name: string
    avatar?: string
    role?: string
  }
  category: string
  tags: string[]
  readTime: number
  toc: Array<{ id: string; text: string; level: number }>
} {
  const { meta, html, content } = post
  
  // 从内容中提取目录
  const toc = extractTocFromHtml(html)
  
  return {
    slug,
    title: meta.title,
    summary: meta.excerpt || '',
    content,
    html,
    date: meta.date,
    author: {
      name: meta.author,
      avatar: undefined,
      role: undefined,
    },
    category: meta.category,
    tags: meta.tags,
    readTime: meta.readingTime,
    toc,
  }
}

/**
 * 从 HTML 中提取目录
 */
function extractTocFromHtml(html: string): Array<{ id: string; text: string; level: number }> {
  const toc: Array<{ id: string; text: string; level: number }> = []
  const headingRegex = /<h([23])[^>]*>(?:<a[^>]*>)?([^<]+)(?:<\/a>)?<\/h\1>/g
  let match
  
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    
    toc.push({ id, text, level })
  }
  
  return toc
}
