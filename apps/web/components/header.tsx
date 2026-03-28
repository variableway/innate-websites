"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@allone/utils"
import { InnateLogo } from "./innate-logo"

const navItems = [
  { label: "Learning Library", href: "/learning-library" },
  { label: "AI Coding Basics", href: "/ai-coding" },
  { label: "Events", href: "/events" },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-6">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <InnateLogo size={32} />
          <span className="text-sm font-semibold leading-tight">Innate</span>
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
    </header>
  )
}
