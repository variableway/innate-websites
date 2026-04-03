'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Home,
  FileText,
  Briefcase,
  Mail,
  Settings,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  LayoutGrid,
  List,
  ArrowRight,
  Calendar,
  Clock,
  BookOpen,
  Rss,
  Badge,
  ChevronRight,
} from 'lucide-react'

interface Tutorial {
  id: string
  title: string
  description: string
  topic: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  date: string
  tags: string[]
}

interface TutorialTopic {
  id: string
  label: string
  count: number
}

export default function TutorialsPage() {
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await fetch('/api/tutorials')
        const result = await response.json()
        if (result.success && result.data) {
          setTutorials(result.data)
        }
      } catch (error) {
        console.error('[v0] Failed to fetch tutorials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTutorials()
  }, [])

  // Extract unique topics and count
  const topics: TutorialTopic[] = [
    {
      id: 'all',
      label: 'All Tutorials',
      count: tutorials.length,
    },
  ]

  const uniqueTopics = new Set(tutorials.map((t) => t.topic))
  uniqueTopics.forEach((topic) => {
    topics.push({
      id: topic.toLowerCase().replace(/\s+/g, '-'),
      label: topic,
      count: tutorials.filter((t) => t.topic === topic).length,
    })
  })

  // Filter tutorials based on selected topic
  const filteredTutorials =
    selectedTopic === 'all'
      ? tutorials
      : tutorials.filter((t) => t.topic.toLowerCase().replace(/\s+/g, '-') === selectedTopic)

  // Sort by date (newest first)
  const sortedTutorials = [...filteredTutorials].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-blue-100 text-blue-800'
      case 'advanced':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner':
        return '初级'
      case 'intermediate':
        return '中级'
      case 'advanced':
        return '高级'
      default:
        return level
    }
  }

  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* Left Sidebar - Navigation */}
      <div className="w-64 border-r border-border bg-sidebar p-8">
        <Link href="/" className="mb-12 block">
          <div className="mb-2 text-xl font-bold text-foreground">onur</div>
          <div className="text-sm text-muted-foreground">Product Designer & Engineer</div>
        </Link>

        <nav className="mb-12 space-y-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded px-4 py-2 text-sm text-muted-foreground transition hover:bg-hover hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
            <span className="ml-auto text-xs text-muted-foreground">01</span>
          </Link>
          <Link
            href="/writing"
            className="flex items-center gap-3 rounded px-4 py-2 text-sm text-muted-foreground transition hover:bg-hover hover:text-foreground"
          >
            <FileText className="h-4 w-4" />
            <span>Writing</span>
            <span className="ml-auto text-xs text-muted-foreground">02</span>
          </Link>
          <Link
            href="/feeds"
            className="flex items-center gap-3 rounded px-4 py-2 text-sm text-muted-foreground transition hover:bg-hover hover:text-foreground"
          >
            <Rss className="h-4 w-4" />
            <span>Feeds</span>
            <span className="ml-auto text-xs text-muted-foreground">05</span>
          </Link>
          <div className="flex items-center gap-3 rounded bg-hover px-4 py-2 text-sm text-foreground">
            <BookOpen className="h-4 w-4" />
            <span>Tutorials</span>
            <span className="ml-auto text-xs text-muted-foreground">06</span>
          </div>
        </nav>

        <div className="border-t border-border pt-8">
          <div className="mb-4 text-xs font-semibold uppercase text-muted-foreground">Online</div>
          <div className="space-y-3">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <Twitter className="h-4 w-4" />
              <span>Twitter</span>
              <ExternalLink className="ml-auto h-3 w-3" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <Github className="h-4 w-4" />
              <span>Github</span>
              <ExternalLink className="ml-auto h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Column - Topics */}
        <div className="w-48 border-r border-border bg-sidebar p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Topics</h3>
          <div className="space-y-2">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`w-full text-left rounded-lg px-4 py-3 text-sm transition ${
                  selectedTopic === topic.id
                    ? 'bg-blue-500 text-white'
                    : 'text-muted-foreground hover:bg-hover hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{topic.label}</span>
                  <span className="text-xs opacity-70">{topic.count}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Tutorials Content */}
        <div className="flex-1 bg-background p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Tutorials</h1>
              <p className="mt-2 text-muted-foreground">
                Learn by doing with our comprehensive tutorials
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-sidebar p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`rounded px-3 py-2 transition ${
                  viewMode === 'card'
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded px-3 py-2 transition ${
                  viewMode === 'list'
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading tutorials...</p>
            </div>
          ) : sortedTutorials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No tutorials found in this category.</p>
            </div>
          ) : viewMode === 'card' ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedTutorials.map((tutorial) => (
                <div
                  key={tutorial.id}
                  className="group rounded-lg border border-border bg-card p-6 transition hover:border-blue-500 hover:shadow-lg"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-blue-500 transition">
                        {tutorial.title}
                      </h3>
                      <p className="mb-3 text-sm text-muted-foreground">{tutorial.description}</p>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge className={`text-xs ${getLevelColor(tutorial.level)}`}>
                      {getLevelLabel(tutorial.level)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{tutorial.duration}</span>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-1">
                    {tutorial.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs text-muted-foreground">
                      {new Date(tutorial.date).toLocaleDateString('zh-CN')}
                    </span>
                    <button className="text-blue-500 transition hover:text-blue-600">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {sortedTutorials.map((tutorial) => (
                <div
                  key={tutorial.id}
                  className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition hover:bg-hover"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-blue-500 transition">
                      {tutorial.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{tutorial.topic}</span>
                      <Badge className={`text-xs ${getLevelColor(tutorial.level)}`}>
                        {getLevelLabel(tutorial.level)}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {tutorial.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(tutorial.date).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
