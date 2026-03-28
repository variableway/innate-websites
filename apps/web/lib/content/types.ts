export interface PostMeta {
  title: string
  slug: string
  date: string
  updated?: string
  author: string
  category: 'article' | 'log' | 'news'
  tags: string[]
  excerpt?: string
  cover?: string
  featured?: boolean
  editorsPick?: boolean
  readingTime?: number
  status: 'published' | 'draft' | 'archived'
}

export interface ParsedPost {
  meta: PostMeta
  content: string        // Markdown 原文
  html: string          // 转换后的 HTML
}

export interface Author {
  name: string
  avatar: string
  bio?: string
  social?: {
    twitter?: string
    github?: string
  }
}

export interface ContentConfig {
  postsPerPage: number
  defaultAuthor: string
}
