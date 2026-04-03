"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Search, Bell, MessageSquare, Bookmark, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Learning Library", href: "/learning-library" },
  { label: "Overview & Freebies", href: "/overview" },
  { label: "AI Coding Basics", href: "/ai-coding" },
  { label: "Events", href: "/events" },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-background rounded" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">Superlinear</span>
              <span className="text-sm font-semibold leading-tight">Academy</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                pathname === item.href
                  ? "bg-secondary text-foreground border border-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm text-muted-foreground hover:bg-secondary/80">
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>

        <button className="relative p-2 hover:bg-secondary rounded-lg">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
            1
          </span>
        </button>

        <button className="p-2 hover:bg-secondary rounded-lg">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
        </button>

        <button className="p-2 hover:bg-secondary rounded-lg">
          <Bookmark className="h-5 w-5 text-muted-foreground" />
        </button>

        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatars/user.jpg" />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">D</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
