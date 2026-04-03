import React from "react"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeHighlight from "rehype-highlight"
import rehypeStringify from "rehype-stringify"
import { cn } from "@innate/ui"

interface ServerMarkdownProps {
  content: string
  className?: string
}

// Server-side markdown to HTML conversion
async function markdownToHtml(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content)
  
  return String(result)
}

// Main markdown renderer - full featured
export async function ServerMarkdown({ content, className }: ServerMarkdownProps) {
  const html = await markdownToHtml(content)
  
  return (
    <div
      className={cn(
        "markdown-content max-w-none",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

// Simple version for inline content
export async function ServerMarkdownSimple({ content, className }: ServerMarkdownProps) {
  const html = await markdownToHtml(content)
  
  return (
    <div
      className={cn(
        "markdown-content-simple max-w-none",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
