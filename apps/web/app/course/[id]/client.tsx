"use client"

import { CourseContent } from "@/components/course-content"
import { courseSections } from "@/lib/data"
import { GraduationCap } from "lucide-react"

export function CoursePageClient() {
  return (
    <>
      {/* Course Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <GraduationCap className="h-5 w-5 text-amber-500" />
          <h1 className="text-lg font-semibold text-foreground">公开课与行业交流</h1>
        </div>
      </div>

      {/* Course Content */}
      <CourseContent
        sections={courseSections}
        userName="DamnPat"
        completedLessons={0}
        totalLessons={17}
      />
    </>
  )
}
