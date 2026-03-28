# Markdown CMS

A file-based content management system supporting both Static Export (SSG) and Server + ISR deployment modes.

## Features

- ✅ **GitHub Flavored Markdown** - Tables, task lists, strikethrough, etc.
- ✅ **Code Syntax Highlighting** - Using rehype-highlight
- ✅ **Frontmatter Metadata** - YAML-based metadata for posts
- ✅ **Table of Contents** - Auto-generated from headings
- ✅ **Dual Deployment Modes** - Static export or Server + ISR

## Content Structure

```
content/
├── posts/           # Markdown posts
│   └── example-post.md
└── authors/         # Author data
    └── authors.json
```

## Post Frontmatter

```yaml
---
title: Post Title
slug: post-slug
date: 2024-03-27T10:00:00.000Z
author: Author Name
category: article|log|news
tags: [tag1, tag2]
readingTime: 5
featured: true|false
editorsPick: true|false
status: published|draft|archived
excerpt: Short description
---
```

## Deployment Modes

### Static Export (SSG)

Pre-renders all pages at build time. Best for:
- CDNs (Cloudflare Pages, Netlify, Vercel Static)
- Maximum performance
- No server required

```bash
pnpm build:static
# Output: dist/ directory with static HTML files
```

### Server + ISR

Server-side rendering with Incremental Static Regeneration. Best for:
- Dynamic content updates
- Large sites with many pages
- Real-time preview

```bash
pnpm build:server
# Start: pnpm start
```

## Build Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev` | Development server |
| `build` | `next build` | Default build (depends on env) |
| `build:static` | `STATIC_EXPORT=true next build` | Static export |
| `build:server` | `SERVER_MODE=true next build` | Server mode |
| `start` | `next start` | Start production server |
| `start:static` | `npx serve dist` | Serve static files |

## API

### Get All Posts

```typescript
import { getPostsMeta } from '@/lib/content'

const posts = await getPostsMeta({
  status: 'published',
  category: 'article',
  limit: 10,
})
```

### Get Single Post

```typescript
import { getPost } from '@/lib/content'

const post = await getPost('example-post')
// Returns: { meta, content, html, toc }
```

## Configuration

### next.config.mjs

The build mode is controlled via environment variables:

```javascript
const isStaticExport = process.env.STATIC_EXPORT === 'true'

const nextConfig = {
  ...(isStaticExport && {
    output: 'export',
    distDir: 'dist',
  }),
}
```

### Page Configuration

Pages support both modes with conditional exports:

```typescript
// ISR revalidation (server mode only)
export const revalidate = 60

// Dynamic routing (server mode only)
export const dynamicParams = false

// Static generation for SSG
export async function generateStaticParams() {
  return getAllPostSlugObjects()
}
```

## Dependencies

- `gray-matter` - Frontmatter parsing
- `unified` - Markdown processor
- `remark-parse` - Markdown parser
- `remark-gfm` - GitHub Flavored Markdown
- `remark-rehype` - Convert to HTML
- `rehype-highlight` - Syntax highlighting
- `rehype-stringify` - HTML output
