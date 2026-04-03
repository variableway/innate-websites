import { NextResponse } from "next/server"
import { TUTORIALS_DATA } from "@/lib/content-layer"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: TUTORIALS_DATA,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch tutorials",
      },
      { status: 500 }
    )
  }
}
