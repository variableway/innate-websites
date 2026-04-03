"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navigationSections } from "@/lib/data"
import {
  GraduationCap,
  Lock,
  BookOpen,
  Newspaper,
  PenSquare,
  MessageCircle,
  Megaphone,
  Radio,
  MoreHorizontal,
  Plus,
  Home,
} from "lucide-react"

const iconMap: Record<string, React.ReactNode> = {
  graduation: <GraduationCap className="h-4 w-4" />,
  lock: <Lock className="h-4 w-4" />,
  book: <BookOpen className="h-4 w-4" />,
  news: <Newspaper className="h-4 w-4" />,
  edit: <PenSquare className="h-4 w-4" />,
  message: <MessageCircle className="h-4 w-4" />,
  megaphone: <Megaphone className="h-4 w-4" />,
  live: <Radio className="h-4 w-4" />,
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-full overflow-hidden">
      <div className="p-4">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === "/" ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50"
          )}
        >
          <Home className="h-4 w-4" />
          Feed
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {navigationSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-muted-foreground px-3">{section.title}</h3>
              {sectionIndex === 0 && (
                <button className="p-1 hover:bg-secondary rounded">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <nav className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  <span className={cn(item.isLocked ? "text-muted-foreground" : "text-foreground")}>
                    {iconMap[item.icon]}
                  </span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  )
}

export function LeftBar() {
  const pathname = usePathname()

  return (
    <div className="w-16 border-r border-border bg-card flex flex-col items-center py-4 gap-4">
      <Link
        href="/"
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
          pathname === "/" ? "bg-secondary" : "hover:bg-secondary/50"
        )}
      >
        <div className="w-6 h-6 border-2 border-foreground rounded flex items-center justify-center">
          <div className="w-3 h-1.5 border border-foreground rounded-sm" />
        </div>
      </Link>
      <Link
        href="/discover"
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
          pathname === "/discover"
            ? "bg-primary text-primary-foreground"
            : "bg-primary/90 text-primary-foreground hover:bg-primary"
        )}
      >
        <Plus className="h-5 w-5" />
      </Link>
      <button className="w-10 h-10 rounded-lg hover:bg-secondary flex items-center justify-center">
        <Plus className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  )
}
