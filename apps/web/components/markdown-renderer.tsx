"use client"

import React, { useEffect, useRef } from "react"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeHighlight from "rehype-highlight"
import rehypeStringify from "rehype-stringify"
import { cn } from "@innate/ui"

interface MarkdownRendererProps {
  content: string
  className?: string
}

// Simple markdown to HTML converter using unified
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

// Client-side only component
function useMarkdown(content: string) {
  const [html, setHtml] = React.useState<string>("")
  
  React.useEffect(() => {
    markdownToHtml(content).then(setHtml)
  }, [content])
  
  return html
}

// Strip markdown to plain text for preview
function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*\*?([^*]+)\*\*\*?/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Get preview text from markdown
function getPreviewText(content: string, maxLength: number = 200): string {
  const plain = stripMarkdown(content)
  return plain.length > maxLength ? plain.slice(0, maxLength) + '...' : plain
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const html = useMarkdown(content)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Render mermaid diagrams after HTML is set
  useEffect(() => {
    if (!html || !containerRef.current) return
    
    const renderMermaid = async () => {
      const mermaidBlocks = containerRef.current?.querySelectorAll('code.language-mermaid')
      if (!mermaidBlocks || mermaidBlocks.length === 0) return
      
      const mermaid = (window as any).mermaid
      
      if (!mermaid) {
        mermaidBlocks.forEach((block) => {
          const pre = block.closest('pre')
          if (pre) {
            pre.className = 'bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto my-4'
            const code = block as HTMLElement
            code.className = 'text-sm font-mono text-foreground/80'
          }
        })
        return
      }
      
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'strict',
        })
        
        mermaidBlocks.forEach((block, index) => {
          const code = block.textContent || ''
          const id = `mermaid-${Date.now()}-${index}`
          
          const div = document.createElement('div')
          div.id = id
          div.className = 'mermaid my-4 flex justify-center overflow-x-auto bg-white p-4 rounded-lg border'
          
          const pre = block.closest('pre')
          if (pre) {
            pre.replaceWith(div)
            
            mermaid.render(id, code).then(({ svg }: { svg: string }) => {
              const element = document.getElementById(id)
              if (element) {
                element.innerHTML = svg
              }
            }).catch((err: Error) => {
              console.error('Mermaid render error:', err)
              const element = document.getElementById(id)
              if (element) {
                element.innerHTML = `<pre class="text-red-500 text-sm p-4 bg-red-50 rounded border border-red-200">Diagram error: ${err.message}</pre>`
              }
            })
          }
        })
      } catch (error) {
        console.error('Mermaid error:', error)
      }
    }
    
    const timer = setTimeout(renderMermaid, 100)
    return () => clearTimeout(timer)
  }, [html])
  
  return (
    <div
      ref={containerRef}
      className={cn("markdown-content", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

// Simple version for inline/preview content
export function MarkdownRendererSimple({ content, className }: MarkdownRendererProps) {
  const preview = getPreviewText(content, 200)
  
  return (
    <span className={cn("text-muted-foreground", className)}>
      {preview}
    </span>
  )
}
