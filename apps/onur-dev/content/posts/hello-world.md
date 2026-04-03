---
title: "Hello World from Static Markdown"
date: "2024-05-20"
excerpt: "This is a static markdown file located in the content/posts directory. It demonstrates how to mix file-based content with database content."
tags: ["Static Site", "Markdown", "Next.js"]
slug: "hello-world-static"
---

# Hello World!

This content lives in `content/posts/hello-world.md`. It is not stored in the database but is read directly from the file system at build time or runtime.

## Why is this cool?

1. **Version Control**: You can git commit your best posts.
2. **Speed**: Filesystem reads are fast.
3. **Flexibility**: You can still use the Admin panel for quick updates or dynamic content.

### Code Example

\`\`\`javascript
console.log("I am static!");
\`\`\`

This hybrid approach gives you the best of both worlds.
