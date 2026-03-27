"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar, LeftBar } from "@/components/sidebar"
import { CourseCard } from "@/components/course-card"
import { courses, courseLevels } from "@/lib/data"
import { cn } from "@/lib/utils"

export default function LearningLibraryPage() {
  const [activeTab, setActiveTab] = useState<"all" | "my">("all")
  const [activeLevel, setActiveLevel] = useState("All")

  const filteredCourses =
    activeLevel === "All"
      ? courses
      : courses.filter((course) => course.level === activeLevel)

  return (
    <div className="min-h-screen bg-background flex">
      <LeftBar />
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-6">
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-foreground mb-6">Learning Library</h1>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-8">
              <button
                onClick={() => setActiveTab("all")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full border transition-colors",
                  activeTab === "all"
                    ? "bg-card border-border text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                All courses
              </button>
              <button
                onClick={() => setActiveTab("my")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full border transition-colors",
                  activeTab === "my"
                    ? "bg-card border-border text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                My courses
              </button>
            </div>

            {/* Level Filters */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {courseLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-full border transition-colors",
                    activeLevel === level
                      ? "bg-card border-border text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
