"use client"

import Image from "next/image"
import Link from "next/link"
import { Lock, GraduationCap } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { Course } from "@/lib/types"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      href={`/course/${course.id}`}
      className="block bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-44 bg-gradient-to-br from-gray-800 to-gray-900">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/30 text-4xl">📚</div>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <GraduationCap className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
            {course.title}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">{course.organization}</p>

        {course.progress !== undefined && (
          <div className="mb-3">
            <Progress value={course.progress} className="h-1" />
            <p className="text-xs text-muted-foreground mt-1">{course.progress}% Complete</p>
          </div>
        )}

        {course.isPrivate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Private space</span>
          </div>
        )}
      </div>
    </Link>
  )
}
