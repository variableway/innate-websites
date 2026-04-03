import { type NextRequest, NextResponse } from "next/server"
import { postsStorage } from "@/lib/posts-storage"
import type { ApiResponse, BlogPost } from "@/lib/types"

// GET single post by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      const response: ApiResponse<BlogPost> = {
        success: false,
        error: "Invalid post ID",
      }
      return NextResponse.json(response, { status: 400 })
    }

    const post = postsStorage.getPostById(id)
    if (!post) {
      const response: ApiResponse<BlogPost> = {
        success: false,
        error: "Post not found",
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<BlogPost> = {
      success: true,
      data: post,
    }
    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<BlogPost> = {
      success: false,
      error: "Failed to fetch post",
    }
    return NextResponse.json(response, { status: 500 })
  }
}

// PUT update post
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      const response: ApiResponse<BlogPost> = {
        success: false,
        error: "Invalid post ID",
      }
      return NextResponse.json(response, { status: 400 })
    }

    const body = await request.json()

    // Update slug if title changed
    if (body.title && !body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    }

    // Update formatted date if date changed
    if (body.date) {
      body.formattedDate = new Date(body.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }

    // Update read time if content changed
    if (body.content) {
      const wordCount = body.content.split(/\s+/).length
      body.readTime = `${Math.ceil(wordCount / 200)} min read`
    }

    const updatedPost = postsStorage.updatePost(id, body)
    if (!updatedPost) {
      const response: ApiResponse<BlogPost> = {
        success: false,
        error: "Post not found",
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<BlogPost> = {
      success: true,
      data: updatedPost,
    }
    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<BlogPost> = {
      success: false,
      error: "Failed to update post",
    }
    return NextResponse.json(response, { status: 500 })
  }
}

// DELETE post
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Invalid post ID",
      }
      return NextResponse.json(response, { status: 400 })
    }

    const deleted = postsStorage.deletePost(id)
    if (!deleted) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Post not found",
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<null> = {
      success: true,
    }
    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to delete post",
    }
    return NextResponse.json(response, { status: 500 })
  }
}
