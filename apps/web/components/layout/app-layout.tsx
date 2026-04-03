"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { getLayoutConfig } from "./layout-config"
import { LeftBar } from "@/components/leftbar"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const config = getLayoutConfig(pathname)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Mobile layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Mobile Header */}
        {config.showHeader && <Header />}
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-16">{children}</main>
        
        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    )
  }

  // Desktop layout: Simple layout (no Sidebar)
  if (config.layout === "simple") {
    return (
      <div className="min-h-screen bg-background flex">
        {config.showLeftBar && <LeftBar />}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    )
  }

  // Desktop layout: Complex layout (LeftBar + Sidebar + Header)
  return (
    <div className="min-h-screen bg-background flex">
      {config.showLeftBar && (
        <div className="border-r border-border">
          <LeftBar />
        </div>
      )}
      {config.showSidebar && (
        <div className="border-r border-border">
          <Sidebar />
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        {config.showHeader && config.headerVariant === "full" && <Header />}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
