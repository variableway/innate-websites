"use client"

import { useEffect, useState } from "react"
import { List, ChevronRight } from "lucide-react"
import { cn } from "@allone/utils"

interface TutorialSidebarProps {
  content: string
}

interface TocItem {
  id: string
  text: string
  level: number
}

export function TutorialSidebar({ content }: TutorialSidebarProps) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Extract headings from markdown content
    const headings = content.match(/^#{2,3}\s+.+$/gm) || []
    const items = headings.map((h) => {
      const level = h.startsWith("###") ? 3 : 2
      const text = h.replace(/^#{2,3}\s+/, "")
      const id = text.toLowerCase().replace(/[^\w]+/g, "-")
      return { id, text, level }
    })
    setToc(items)
  }, [content])

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll("h2, h3")
      let current = ""
      
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect()
        if (rect.top < 100) {
          current = heading.id
        }
      })
      
      setActiveId(current)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (toc.length === 0) return null

  return (
    <aside className="hidden xl:block w-64 border-l border-border bg-muted/30 overflow-y-auto sticky top-0 h-[calc(100vh-4rem)]">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground">
          <List className="w-4 h-4" />
          目录
        </div>
        
        <nav className="space-y-1">
          {toc.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={cn(
                "w-full text-left text-sm py-1.5 pr-2 rounded transition-colors flex items-start gap-2",
                item.level === 3 && "pl-4",
                activeId === item.id
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <ChevronRight 
                className={cn(
                  "w-3.5 h-3.5 mt-0.5 flex-shrink-0 transition-transform",
                  activeId === item.id && "rotate-90"
                )} 
              />
              <span className="line-clamp-2">{item.text}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}
