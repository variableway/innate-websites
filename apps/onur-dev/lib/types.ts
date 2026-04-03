export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  date: string
  formattedDate: string
  readTime: string
  tags: string[]
  content: string
  isStatic?: boolean // Mark if post is from markdown file
  filename?: string // Store original markdown filename
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
