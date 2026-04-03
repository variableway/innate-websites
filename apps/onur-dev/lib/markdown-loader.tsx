// Utility to load and parse markdown files
import type { BlogPost } from "./types"

// Simulate markdown file content (in real app, this would read from file system)
const markdownFiles: Record<string, string> = {}

// Parse frontmatter and content from markdown
function parseMarkdown(markdown: string): {
  frontmatter: Record<string, any>
  content: string
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = markdown.match(frontmatterRegex)

  if (!match) {
    return { frontmatter: {}, content: markdown }
  }

  const frontmatterStr = match[1]
  const content = match[2]

  // Parse YAML-like frontmatter
  const frontmatter: Record<string, any> = {}
  frontmatterStr.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split(":")
    if (key && valueParts.length > 0) {
      const value = valueParts.join(":").trim()
      // Handle arrays (tags)
      if (value.startsWith("[") && value.endsWith("]")) {
        frontmatter[key.trim()] = value
          .slice(1, -1)
          .split(",")
          .map((v) => v.trim().replace(/['"]/g, ""))
      } else {
        frontmatter[key.trim()] = value.replace(/['"]/g, "")
      }
    }
  })

  return { frontmatter, content: content.trim() }
}

// Convert markdown file to BlogPost
function markdownToPost(filename: string, markdown: string, id: number): BlogPost {
  const { frontmatter, content } = parseMarkdown(markdown)

  // Generate slug from filename or frontmatter
  const slug =
    frontmatter.slug ||
    filename
      .replace(".md", "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

  // Format date
  const date = frontmatter.date || new Date().toISOString().split("T")[0]
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // Calculate read time
  const wordCount = content.split(/\s+/).length
  const readTime = frontmatter.readTime || `${Math.ceil(wordCount / 200)} min read`

  return {
    id,
    title: frontmatter.title || filename.replace(".md", ""),
    slug,
    excerpt: frontmatter.excerpt || content.slice(0, 150) + "...",
    date,
    formattedDate,
    readTime,
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    content,
    isStatic: true, // Mark as static content from markdown
  }
}

export const markdownLoader = {
  // Load all markdown files
  loadMarkdownPosts: (): BlogPost[] => {
    const posts: BlogPost[] = []
    let id = 10000 // Start static posts at high ID to avoid conflicts

    Object.entries(markdownFiles).forEach(([filename, content]) => {
      posts.push(markdownToPost(filename, content, id++))
    })

    return posts
  },

  // Add markdown file
  addMarkdownFile: (filename: string, content: string): void => {
    markdownFiles[filename] = content
  },

  // Get markdown file
  getMarkdownFile: (filename: string): string | undefined => {
    return markdownFiles[filename]
  },

  // Delete markdown file
  deleteMarkdownFile: (filename: string): boolean => {
    if (markdownFiles[filename]) {
      delete markdownFiles[filename]
      return true
    }
    return false
  },

  // List all markdown files
  listMarkdownFiles: (): string[] => {
    return Object.keys(markdownFiles)
  },
}

// Add some sample markdown files
markdownLoader.addMarkdownFile(
  "getting-started-nextjs-14.md",
  `---
title: Getting Started with Next.js 14
slug: getting-started-nextjs-14
excerpt: A comprehensive guide to building modern web applications with Next.js 14 and the App Router.
date: 2024-01-20
tags: [Next.js, React, Web Development]
---

# Getting Started with Next.js 14

Next.js 14 introduces powerful features that make building web applications faster and more efficient than ever before.

## What's New in Next.js 14

The latest version brings several exciting improvements:

- **Turbopack**: Up to 5x faster local development
- **Server Actions**: Simplified data mutations
- **Partial Prerendering**: Better performance out of the box

## Setting Up Your First Project

To get started with Next.js 14, run the following command:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

This will set up a new Next.js project with all the latest features enabled.

## Building Your First Page

Create a new page by adding a file to the \`app\` directory:

\`\`\`typescript
export default function Page() {
  return <h1>Hello, Next.js 14!</h1>
}
\`\`\`

## Conclusion

Next.js 14 makes it easier than ever to build high-performance web applications. The new features and improvements provide a solid foundation for modern web development.`,
)

markdownLoader.addMarkdownFile(
  "mastering-typescript-generics.md",
  `---
title: Mastering TypeScript Generics
excerpt: Deep dive into TypeScript generics and how they can make your code more reusable and type-safe.
date: 2024-01-12
tags: [TypeScript, Programming, Advanced]
readTime: 10 min read
---

# Mastering TypeScript Generics

TypeScript generics are one of the most powerful features of the language, enabling you to write flexible, reusable, and type-safe code.

## Understanding Generics

Generics allow you to create components that work with multiple types rather than a single one:

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg
}
\`\`\`

This function works with any type while maintaining type safety.

## Generic Constraints

You can constrain generics to specific types:

\`\`\`typescript
interface Lengthwise {
  length: number
}

function logLength<T extends Lengthwise>(arg: T): void {
  console.log(arg.length)
}
\`\`\`

## Real-World Applications

Generics shine in real-world scenarios like API responses, data structures, and utility functions.

## Best Practices

- Use meaningful type parameter names
- Keep generics simple and focused
- Add constraints when necessary
- Document complex generic types

Mastering generics will significantly improve your TypeScript skills and code quality.`,
)
