import { NextResponse } from "next/server"
import { getUnifiedPosts, PROJECTS_DATA } from "@/lib/content-layer"
import type { ApiResponse, BlogPost } from "@/lib/types"

// GET all posts from both DB and markdown files
export async function GET() {
  try {
    const posts = await getUnifiedPosts()

    return NextResponse.json({
      success: true,
      data: posts,
      projects: PROJECTS_DATA,
    })
  } catch (error) {
    console.error("[v0] Failed to fetch unified content:", error)
    const response: ApiResponse<BlogPost[]> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch posts",
    }
    return NextResponse.json(response, { status: 500 })
  }
}
