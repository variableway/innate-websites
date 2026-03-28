"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@allone/utils"
import {
  Home,
  BookOpen,
  Newspaper,
  Code,
  FileText,
  Plus,
} from "lucide-react"
import { InnateLogoIcon } from "./innate-logo"

interface LeftBarItem {
  id: string
  icon: React.ReactNode
  label: string
  href: string
}

// 重新划分：LeftBar 只保留核心功能和个人相关
const leftBarItems: LeftBarItem[] = [
  {
    id: "innate",
    icon: <InnateLogoIcon />,
    label: "Innate",
    href: "/",
  },
  {
    id: "feed",
    icon: <Home className="h-5 w-5" />,
    label: "Feed",
    href: "/feed",
  },
  {
    id: "learning",
    icon: <BookOpen className="h-5 w-5" />,
    label: "Learning Library",
    href: "/learning-library",
  },
  {
    id: "news",
    icon: <Newspaper className="h-5 w-5" />,
    label: "Deep News",
    href: "/deep-news",
  },
  {
    id: "ai-coding",
    icon: <Code className="h-5 w-5" />,
    label: "AI Coding Basics",
    href: "/ai-coding",
  },
  {
    id: "log",
    icon: <FileText className="h-5 w-5" />,
    label: "Log",
    href: "/log",
  },
]

export function LeftBar() {
  const pathname = usePathname()

  return (
    <div className="w-16 border-r border-border bg-card flex flex-col items-center py-4 gap-2">
      {/* Navigation Items */}
      {leftBarItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors relative",
            pathname === item.href || pathname.startsWith(item.href + "/")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
          title={item.label}
        >
          {item.icon}
        </Link>
      ))}

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col items-center gap-2">
        <div className="w-8 h-px bg-border" />
        <button
          className="w-10 h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-colors"
          title="Create"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
