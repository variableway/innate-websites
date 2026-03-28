---
title: "Example Post: Markdown CMS Demo"
slug: example-post
date: 2024-03-27T10:00:00.000Z
author: Innate Team
category: article
tags: [markdown, cms, nextjs]
readingTime: 5
featured: true
editorsPick: true
status: published
excerpt: A demonstration of the Markdown CMS system with syntax highlighting, tables, and rich content support.
---

## Introduction

This is an example post demonstrating the **Markdown CMS** capabilities. The system supports:

- GitHub Flavored Markdown
- Code syntax highlighting
- Tables and lists
- Rich text formatting

## Code Examples

Here's a TypeScript example:

```typescript
interface Post {
  title: string
  slug: string
  content: string
}

function getPost(slug: string): Post {
  // Implementation here
  return { title: 'Example', slug, content: '' }
}
```

## Features Table

| Feature | Status | Notes |
|---------|--------|-------|
| Static Export | ✅ Ready | Full SSG support |
| ISR | ✅ Ready | Server mode with caching |
| Syntax Highlight | ✅ Ready | Using rehype-highlight |
| GitHub Flavored | ✅ Ready | Tables, task lists, etc |

## Lists

### Unordered List

- First item
- Second item with **bold**
- Third item with [link](#)

### Ordered List

1. First step
2. Second step
3. Third step

## Blockquote

> "The best way to predict the future is to invent it."
> — Alan Kay

## Conclusion

This Markdown CMS provides a flexible content management solution that works with both **Static Site Generation (SSG)** and **Server-Side Rendering (SSR)** with **Incremental Static Regeneration (ISR)**.
