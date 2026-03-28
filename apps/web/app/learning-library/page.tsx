"use client"

import { CourseCard } from "@/components/course-card"
import { courses } from "@/lib/data"

export default function LearningLibraryPage() {
  return (
    <div className="max-w-7xl mx-auto py-6 px-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-foreground mb-6">Learning Library</h1>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}
