import { PostCard } from "@/components/post-card"
import { newsPosts } from "@/lib/data"
import { Newspaper } from "lucide-react"

export default function DeepNewsPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <Newspaper className="h-5 w-5 text-innate-terracotta" />
        <h1 className="text-xl font-semibold text-foreground">Deep News</h1>
      </div>

      {/* Posts - 官方深度文章 */}
      <div className="flex flex-col gap-6">
        {newsPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
