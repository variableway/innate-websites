"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Circle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { CourseSection } from "@/lib/types"

interface CourseContentProps {
  sections: CourseSection[]
  userName?: string
  completedLessons?: number
  totalLessons?: number
}

export function CourseContent({
  sections,
  userName = "DamnPat",
  completedLessons = 0,
  totalLessons = 17,
}: CourseContentProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(sections.map((s) => s.id))

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    )
  }

  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
  const totalSections = sections.length
  const totalTime = sections.reduce((acc, section) => {
    return (
      acc +
      section.lessons.reduce((lessonAcc, lesson) => {
        const parts = lesson.duration.split(":")
        if (parts.length === 3) {
          return lessonAcc + parseInt(parts[0]) * 60 + parseInt(parts[1])
        }
        return lessonAcc + parseInt(parts[0])
      }, 0)
    )
  }, 0)

  const hours = Math.floor(totalTime / 60)
  const minutes = totalTime % 60

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome, {userName}.</h1>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Start</Button>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Progress</h2>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">
              Completed {completedLessons} of {totalLessons} lessons
            </span>
            <span className="text-sm font-medium text-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Content</h2>
            <p className="text-sm text-muted-foreground">
              {totalSections} sections • {totalLessons} lessons • {hours} hr {minutes} min
            </p>
          </div>
          <button
            onClick={() =>
              setExpandedSections(expandedSections.length === sections.length ? [] : sections.map((s) => s.id))
            }
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {expandedSections.length === sections.length ? "Collapse all sections" : "Expand all sections"}
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {sections.map((section) => (
            <div key={section.id} className="border-b border-border last:border-b-0">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {expandedSections.includes(section.id) ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="font-medium text-foreground">{section.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {section.lessons.length} lessons • {section.totalDuration}
                </span>
              </button>

              {expandedSections.includes(section.id) && (
                <div className="bg-secondary/20">
                  {section.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between px-4 py-3 pl-12 hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{lesson.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
