"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@allone/utils"
import { Home, BookOpen, Newspaper, Code, FileText } from "lucide-react"
import { InnateLogoIcon } from "./innate-logo"

const mobileNavItems = [
  {
    id: "innate",
    icon: InnateLogoIcon,
    label: "Home",
    href: "/",
  },
  {
    id: "feed",
    icon: Home,
    label: "Feed",
    href: "/feed",
  },
  {
    id: "learn",
    icon: BookOpen,
    label: "Learn",
    href: "/learning-library",
  },
  {
    id: "news",
    icon: Newspaper,
    label: "News",
    href: "/deep-news",
  },
  {
    id: "log",
    icon: FileText,
    label: "Log",
    href: "/log",
  },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full",
                isActive ? "bg-primary/10" : ""
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
