import { type NextRequest, NextResponse } from "next/server"
import { markdownLoader } from "@/lib/markdown-loader"
import type { ApiResponse } from "@/lib/types"

// GET all markdown files
export async function GET() {
  try {
    const files = markdownLoader.listMarkdownFiles()
    const response: ApiResponse<string[]> = {
      success: true,
      data: files,
    }
    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<string[]> = {
      success: false,
      error: "Failed to fetch markdown files",
    }
    return NextResponse.json(response, { status: 500 })
  }
}

// POST upload markdown file
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.filename || !body.content) {
      const response: ApiResponse<{ filename: string }> = {
        success: false,
        error: "Missing required fields: filename, content",
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Ensure filename ends with .md
    const filename = body.filename.endsWith(".md") ? body.filename : `${body.filename}.md`

    markdownLoader.addMarkdownFile(filename, body.content)

    const response: ApiResponse<{ filename: string }> = {
      success: true,
      data: { filename },
    }
    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const response: ApiResponse<{ filename: string }> = {
      success: false,
      error: "Failed to upload markdown file",
    }
    return NextResponse.json(response, { status: 500 })
  }
}

// DELETE markdown file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")

    if (!filename) {
      const response: ApiResponse<boolean> = {
        success: false,
        error: "Missing filename parameter",
      }
      return NextResponse.json(response, { status: 400 })
    }

    const deleted = markdownLoader.deleteMarkdownFile(filename)

    if (!deleted) {
      const response: ApiResponse<boolean> = {
        success: false,
        error: "File not found",
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<boolean> = {
      success: true,
      data: true,
    }
    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<boolean> = {
      success: false,
      error: "Failed to delete markdown file",
    }
    return NextResponse.json(response, { status: 500 })
  }
}
