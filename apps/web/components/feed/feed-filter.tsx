"use client"

import { cn } from "@allone/utils"
import { FeedFilter as FeedFilterType } from "@/lib/types"
import { Newspaper, FileText, Bookmark, Star, LayoutGrid } from "lucide-react"

interface FeedFilterProps {
  currentFilter: FeedFilterType
  onFilterChange: (filter: FeedFilterType) => void
}

const filters: { id: FeedFilterType; label: string; icon: React.ReactNode }[] = [
  {
    id: "all",
    label: "All",
    icon: <LayoutGrid className="h-4 w-4" />,
  },
  {
    id: "article",
    label: "Articles",
    icon: <Newspaper className="h-4 w-4" />,
  },
  {
    id: "log",
    label: "Logs",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "news",
    label: "News",
    icon: <Bookmark className="h-4 w-4" />,
  },
  {
    id: "editors-pick",
    label: "Editor's Pick",
    icon: <Star className="h-4 w-4" />,
  },
]

export function FeedFilter({ currentFilter, onFilterChange }: FeedFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            currentFilter === filter.id
              ? "bg-[#8FA68E] text-white shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {filter.icon}
          {filter.label}
        </button>
      ))}
    </div>
  )
}
