"use client"

import Link from "next/link"
import { Clock, Wrench, BookOpen, ChevronRight } from "lucide-react"
import { Tutorial, getDifficultyLabel, getDifficultyColor } from "@/lib/tutorials"
import { cn } from "@allone/utils"

interface TutorialCardProps {
  tutorial: Tutorial
  variant?: "default" | "compact"
}

export function TutorialCard({ tutorial, variant = "default" }: TutorialCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/tutorials/${tutorial.slug}`}
        className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors"
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {tutorial.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {tutorial.description}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </Link>
    )
  }

  return (
    <Link
      href={`/tutorials/${tutorial.slug}`}
      className="group block p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-medium",
            getDifficultyColor(tutorial.difficulty)
          )}>
            {getDifficultyLabel(tutorial.difficulty)}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {tutorial.time}
          </span>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <ChevronRight className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
        {tutorial.title}
      </h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {tutorial.description}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {tutorial.tool && (
          <span className="flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5" />
            {tutorial.tool}
          </span>
        )}
        {tutorial.prerequisites.length > 0 && (
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {tutorial.prerequisites.length} 项前置
          </span>
        )}
      </div>
    </Link>
  )
}

interface TutorialListProps {
  tutorials: Tutorial[]
  groupBy?: 'difficulty' | 'tool' | 'none'
}

export function TutorialList({ tutorials, groupBy = 'difficulty' }: TutorialListProps) {
  if (groupBy === 'none') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tutorials.map((tutorial) => (
          <TutorialCard key={tutorial.slug} tutorial={tutorial} />
        ))}
      </div>
    )
  }

  const groups = tutorials.reduce((acc, tutorial) => {
    const key = groupBy === 'difficulty' ? tutorial.difficulty : tutorial.tool
    if (!acc[key]) acc[key] = []
    acc[key].push(tutorial)
    return acc
  }, {} as Record<string, Tutorial[]>)

  const groupOrder = ['beginner', 'intermediate', 'advanced']
  const sortedKeys = groupBy === 'difficulty' 
    ? groupOrder.filter(k => groups[k])
    : Object.keys(groups).sort()

  return (
    <div className="space-y-8">
      {sortedKeys.map((key) => (
        <section key={key}>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            {groupBy === 'difficulty' ? getDifficultyLabel(key) : key}
            <span className="text-sm font-normal text-muted-foreground">
              ({groups[key].length})
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups[key].map((tutorial) => (
              <TutorialCard key={tutorial.slug} tutorial={tutorial} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
