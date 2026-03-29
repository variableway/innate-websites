"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@allone/utils"
import { Home, Newspaper, GraduationCap, Code, FileText, BookOpen } from "lucide-react"
import { InnateLogoIcon } from "./innate-logo"

// Sidebar 职责：内容分类导航（与 LeftBar 互补，不重复）
const categories = [
  {
    id: "feed",
    label: "Feed",
    icon: Home,
    href: "/feed",
  },
  {
    id: "news",
    label: "Deep News",
    icon: Newspaper,
    href: "/deep-news",
  },
  {
    id: "courses",
    label: "Courses",
    icon: GraduationCap,
    href: "/learning-library",
  },
  {
    id: "ai-coding",
    label: "AI Coding Basics",
    icon: Code,
    href: "/ai-coding",
  },
 {
    id: "log",
    label: "Log",
    icon: FileText,
    href: "/log",
  },
  {
    id: "tutorials",
    label: "Tutorials",
    icon: BookOpen,
    href: "/tutorials",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-full overflow-hidden">
      {/* Brand */}
      <div className="p-4">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            pathname === "/"
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-secondary"
          )}
        >
          <InnateLogoIcon />
          <span>Innate</span>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-border" />

      {/* Categories */}
      <div className="p-4">
        <h3 className="text-xs font-medium text-muted-foreground px-3 mb-3">
          Categories
        </h3>
        <nav className="flex flex-col gap-1">
          {categories.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
