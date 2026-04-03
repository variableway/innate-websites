// Simple file-based storage for blog posts
import type { BlogPost } from "./types"
import { markdownLoader } from "./markdown-loader"

// In-memory storage (in production, this would be a real database)
const posts: BlogPost[] = [
  {
    id: 1,
    title: "Building Scalable React Applications with TypeScript",
    slug: "building-scalable-react-applications-typescript",
    excerpt:
      "Learn how to structure large React applications using TypeScript, focusing on maintainability, type safety, and developer experience.",
    date: "2024-01-15",
    formattedDate: "Jan 15, 2024",
    readTime: "8 min read",
    tags: ["React", "TypeScript", "Architecture"],
    content: `# Building Scalable React Applications with TypeScript

When building large-scale React applications, the combination of React and TypeScript provides a powerful foundation for maintainable, scalable code...`,
  },
  {
    id: 2,
    title: "The Art of Code Reviews: A Developer's Guide",
    slug: "art-of-code-reviews-developers-guide",
    excerpt:
      "Code reviews are more than just catching bugs. Discover how to give constructive feedback and improve team collaboration.",
    date: "2024-01-08",
    formattedDate: "Jan 8, 2024",
    readTime: "6 min read",
    tags: ["Development", "Team", "Best Practices"],
    content: `# The Art of Code Reviews: A Developer's Guide

Code reviews are one of the most important practices in software development...`,
  },
]

let nextId = posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1

export const postsStorage = {
  getAllPosts: (): BlogPost[] => {
    const dynamicPosts = posts
    const staticPosts = markdownLoader.loadMarkdownPosts()
    const allPosts = [...dynamicPosts, ...staticPosts]
    return allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },

  // Get post by ID
  getPostById: (id: number): BlogPost | undefined => {
    return posts.find((post) => post.id === id)
  },

  getPostBySlug: (slug: string): BlogPost | undefined => {
    const dynamicPost = posts.find((post) => post.slug === slug)
    if (dynamicPost) return dynamicPost

    const staticPosts = markdownLoader.loadMarkdownPosts()
    return staticPosts.find((post) => post.slug === slug)
  },

  // Create new post
  createPost: (postData: Omit<BlogPost, "id">): BlogPost => {
    const newPost: BlogPost = {
      ...postData,
      id: nextId++,
    }
    posts.push(newPost)
    return newPost
  },

  // Update post
  updatePost: (id: number, postData: Partial<BlogPost>): BlogPost | null => {
    const index = posts.findIndex((post) => post.id === id)
    if (index === -1) return null

    posts[index] = {
      ...posts[index],
      ...postData,
      id: posts[index].id, // Ensure ID doesn't change
    }
    return posts[index]
  },

  // Delete post
  deletePost: (id: number): boolean => {
    const index = posts.findIndex((post) => post.id === id)
    if (index === -1) return false

    posts.splice(index, 1)
    return true
  },
}

export const getAllPosts = postsStorage.getAllPosts
