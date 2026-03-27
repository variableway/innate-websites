"use client"

import { Avatar, AvatarFallback, AvatarImage, Badge } from "@allone/ui"
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react"
import type { Post } from "@/lib/types"
import { useState } from "react"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground leading-tight pr-4 text-balance">
          {post.title}
        </h2>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="p-1.5 hover:bg-secondary rounded-lg">
            <Bookmark className="h-5 w-5 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-secondary rounded-lg">
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.author.avatar} />
          <AvatarFallback className="bg-primary text-primary-foreground">SA</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{post.author.name}</span>
            <Badge variant="secondary" className="text-xs bg-primary text-primary-foreground">
              {post.author.role}
            </Badge>
            <span className="text-xs text-muted-foreground">{post.date}</span>
          </div>
          <p className="text-xs text-muted-foreground">Member since {post.author.memberSince}</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground mb-3">{post.title}</h3>
        <div className="text-sm text-muted-foreground leading-relaxed">
          <p className={expanded ? "" : "line-clamp-4"}>{post.content}</p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-foreground hover:underline mt-2"
        >
          {expanded ? "Show less" : "See more"}
        </button>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <Heart className="h-5 w-5" />
          </button>
          <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <MessageCircle className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {post.likedBy.slice(0, 3).map((avatar, index) => (
              <Avatar key={index} className="h-6 w-6 border-2 border-card">
                <AvatarImage src={avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">U</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {post.likes} likes · {post.comments} comments
          </span>
        </div>
      </div>
    </article>
  )
}
