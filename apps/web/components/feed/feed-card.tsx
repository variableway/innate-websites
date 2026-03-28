"use client"

import Link from "next/link"
import { Card, CardContent } from "@allone/ui"
import { Heart, MessageCircle, Bookmark, Clock } from "lucide-react"
import { cn } from "@allone/utils"
import type { Post } from "@/lib/types"
import { tags } from "@/lib/data"

interface FeedCardProps {
  post: Post
  variant?: "default" | "compact" | "featured"
}

export function FeedCard({ post, variant = "default" }: FeedCardProps) {
  // 获取标签颜色
  const getTagColor = (tagName: string) => {
    const tag = tags.find((t) => t.slug === tagName)
    return tag?.color || "#8FA68E"
  }

  if (variant === "compact") {
    return (
      <Link href={`/feed/${post.slug}`}>
        <Card className="hover:shadow-md transition-shadow border-border/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* 作者头像 */}
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-medium flex-shrink-0">
                {post.author.name[0]}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground line-clamp-1 mb-1">
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{post.author.name}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}min
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/feed/${post.slug}`}>
      <Card 
        className={cn(
          "group hover:shadow-lg transition-all duration-300 border-border/50",
          post.isEditorsPick && "border-[#D4845E]/30 ring-1 ring-[#D4845E]/10"
        )}
      >
        <CardContent className="p-6">
          {/* 头部：编辑精选标记 + 日期 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {post.isEditorsPick && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#D4845E]/10 text-[#D4845E]">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Editor&apos;s Pick
                </span>
              )}
              {post.category && (
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  post.category === "article" && "bg-[#8FA68E]/10 text-[#8FA68E]",
                  post.category === "log" && "bg-[#7A9CAE]/10 text-[#7A9CAE]",
                  post.category === "news" && "bg-[#D4845E]/10 text-[#D4845E]",
                )}>
                  {post.category === "article" && "Article"}
                  {post.category === "log" && "Log"}
                  {post.category === "news" && "News"}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{post.date}</span>
          </div>

          {/* 标题 */}
          <h3 className="text-xl font-semibold mb-3 group-hover:text-[#8FA68E] transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* 摘要 */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
            {post.summary}
          </p>

          {/* 标签 */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-md"
                  style={{ 
                    backgroundColor: `${getTagColor(tag)}20`,
                    color: getTagColor(tag)
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 底部：作者信息 + 元数据 */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                {post.author.name[0]}
              </div>
              <div className="text-sm">
                <span className="font-medium">{post.author.name}</span>
                <span className="text-muted-foreground"> · </span>
                <span className="text-muted-foreground">
                  {post.readTime} min read
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              <button className="flex items-center gap-1 text-sm hover:text-[#D4845E] transition-colors">
                <Heart className="h-4 w-4" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-1 text-sm hover:text-[#8FA68E] transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments}</span>
              </button>
              <button className="hover:text-[#7A9CAE] transition-colors">
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
