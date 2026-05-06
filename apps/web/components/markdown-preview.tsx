"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"

interface MarkdownPreviewProps {
  source: string
  className?: string
  style?: React.CSSProperties
}

export function MarkdownPreview({ source, className, style }: MarkdownPreviewProps) {
  return (
    <div className={`markdown-content !bg-transparent !p-0 ${className || ""}`} style={style}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug, rehypeHighlight]}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}
