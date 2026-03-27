"use client"

import { useState } from "react"
import { Search, ChevronRight } from "lucide-react"
import { CommunityCard } from "@/components/community-card"
import { communities, categories } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@allone/ui"
import { LeftBar } from "@/components/sidebar"

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("Explore")
  const [searchQuery, setSearchQuery] = useState("")

  const trending = communities.slice(0, 5)
  const popular = communities.slice(5, 10)

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Icon Bar */}
      <LeftBar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Minimal Header */}
        <header className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">
                Discover<span className="text-blue-500">+</span>
              </span>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-secondary text-muted-foreground text-sm">D</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Whatever it is, there&apos;s a Circle for that
            </h1>
            <p className="text-muted-foreground mb-8">
              Find communities, creators, and products that transform your life
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full border whitespace-nowrap transition-colors",
                  activeCategory === category
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card border-border text-foreground hover:bg-secondary"
                )}
              >
                {category}
              </button>
            ))}
            <button className="p-2 hover:bg-secondary rounded-full">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Trending Section */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-foreground mb-6">Trending</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trending.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          </section>

          {/* Popular Section */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-6">Popular</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {popular.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
