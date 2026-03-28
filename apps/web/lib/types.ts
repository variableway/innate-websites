export interface NavItem {
  id: string
  label: string
  icon: string
  href: string
  badge?: number
  isLocked?: boolean
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export interface Post {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  date: string
  author: {
    name: string
    avatar: string
    role: string
    memberSince: string
  }
  likes: number
  comments: number
  likedBy: string[]
  tags?: string[]
  isFeatured?: boolean
  isEditorsPick?: boolean
  readTime?: number
  category?: "article" | "log" | "news"
}

export interface Course {
  id: string
  title: string
  description: string
  image: string
  organization: string
  isPrivate: boolean
  progress?: number
  level?: string
}

export interface Lesson {
  id: string
  title: string
  duration: string
  completed: boolean
}

export interface CourseSection {
  id: string
  title: string
  lessons: Lesson[]
  totalDuration: string
}

export interface Community {
  id: string
  title: string
  description: string
  image: string
  price: string
  priceType: string
  organization: string
}

export type FeedFilter = "all" | "article" | "log" | "news" | "editors-pick"

export interface Tag {
  id: string
  name: string
  slug: string
  color: string
}
