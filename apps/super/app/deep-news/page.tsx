"use client"

import { Header } from "@/components/header"
import { Sidebar, LeftBar } from "@/components/sidebar"
import { PostCard } from "@/components/post-card"
import { posts } from "@/lib/data"
import { Newspaper, ChevronDown, ThumbsUp, MoreHorizontal } from "lucide-react"

export default function DeepNewsPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <LeftBar />
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto py-6 px-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Newspaper className="h-5 w-5 text-rose-500" />
                <h1 className="text-xl font-semibold text-foreground">Deep News</h1>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary rounded-lg">
                  Latest
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-secondary rounded-lg">
                  <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                </button>
                <div className="flex items-center gap-1 text-sm">
                  <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                    0
                  </span>
                  <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                    1
                  </span>
                  <span className="text-muted-foreground ml-1">+5,491</span>
                </div>
                <button className="p-2 hover:bg-secondary rounded-lg">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Posts */}
            <div className="flex flex-col gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
