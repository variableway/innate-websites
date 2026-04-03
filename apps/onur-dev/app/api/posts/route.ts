import { type NextRequest, NextResponse } from "next/server"
import { postsStorage } from "@/lib/posts-storage"
import type { ApiResponse, BlogPost } from "@/lib/types"

// GET all posts
export async function GET() {
  try {
    const posts = postsStorage.getAllPosts()
    const response: ApiResponse<BlogPost[]> = {
      success: true,
      data: posts,
    }
    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<BlogPost[]> = {
      success: false,
      error: "Failed to fetch posts",
    }
    return NextResponse.json(response, { status: 500 })
  }
}

// POST create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.content || !body.excerpt) {
      const response: ApiResponse<BlogPost> = {
        success: false,
        error: "Missing required fields: title, content, excerpt",
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Generate slug from title if not provided
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    // Format date
    const date = body.date || new Date().toISOString().split("T")[0]
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

    // Estimate read time (simple calculation: ~200 words per minute)
    const wordCount = body.content.split(/\s+/).length
    const readTime = `${Math.ceil(wordCount / 200)} min read`

    const newPost = postsStorage.createPost({
      title: body.title,
      slug,
      excerpt: body.excerpt,
      date,
      formattedDate,
      readTime,
      tags: body.tags || [],
      content: body.content,
    })

    const response: ApiResponse<BlogPost> = {
      success: true,
      data: newPost,
    }
    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const response: ApiResponse<BlogPost> = {
      success: false,
      error: "Failed to create post",
    }
    return NextResponse.json(response, { status: 500 })
  }
}
