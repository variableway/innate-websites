"use client"

import { useEffect } from "react"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeHighlight from "rehype-highlight"
import rehypeStringify from "rehype-stringify"
import { CopyButton } from "@/components/ui/copy-button"

interface TutorialContentProps {
  content: string
}

export function TutorialContent({ content }: TutorialContentProps) {
  useEffect(() => {
    // Add copy buttons to code blocks
    const codeBlocks = document.querySelectorAll("pre")
    codeBlocks.forEach((pre) => {
      if (pre.querySelector(".copy-button")) return
      
      const code = pre.querySelector("code")
      if (!code) return
      
      const text = code.textContent || ""
      const button = document.createElement("button")
      button.className = "copy-button absolute top-2 right-2 p-1.5 rounded bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
      button.onclick = () => {
        navigator.clipboard.writeText(text)
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
        setTimeout(() => {
          button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
        }, 2000)
      }
      
      pre.style.position = "relative"
      pre.appendChild(button)
    })
  }, [content])

  const processedContent = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .processSync(content)
    .toString()

  return (
    <div 
      className="prose prose-slate dark:prose-invert max-w-none
        prose-headings:font-semibold prose-headings:text-foreground
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-muted-foreground prose-p:leading-relaxed
        prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg
        prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
        prose-pre:prose-code:bg-transparent prose-pre:prose-code:p-0
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground
        prose-ul:my-4 prose-li:text-muted-foreground
        prose-table:border prose-table:border-border
        prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-2
        prose-td:border prose-td:border-border prose-td:p-2
        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r
        prose-details:bg-muted prose-details:p-4 prose-details:rounded-lg
        prose-summary:font-medium prose-summary:cursor-pointer"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  )
}
