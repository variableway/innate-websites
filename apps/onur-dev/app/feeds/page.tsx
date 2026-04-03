'use client'

import React from "react"

import { useState, useEffect } from 'react'
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
  FileJson,
  Database,
  Rss,
  BookOpen,
  Code,
  Lightbulb,
  Zap,
} from 'lucide-react'

interface FeedItem {
  id: string
  title: string
  description: string
  category: string
  date: string
  readTime: string
  tags: string[]
  source: string
  isMarkdown?: boolean
}

interface FeedCategory {
  id: string
  label: string
  icon: React.ComponentType<{ className: string }>
  count: number
}

export default function FeedsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [posts, setPosts] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/content')
        const result = await response.json()
        if (result.success && result.data) {
          const feedItems: FeedItem[] = result.data.map((post: any) => ({
            id: post.id,
            title: post.title,
            description: post.excerpt,
            category: post.tags?.[0] || 'general',
            date: post.date,
            readTime: post.readTime,
            tags: post.tags || [],
            source: post.isMarkdown ? 'markdown' : 'database',
            isMarkdown: post.isMarkdown,
          }))
          setPosts(feedItems)
        }
      } catch (error) {
        console.error('[v0] Failed to fetch posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const categories: FeedCategory[] = [
    {
      id: 'all',
      label: 'All Feeds',
      icon: Rss,
      count: posts.length,
    },
    {
      id: 'programming',
      label: 'Programming',
      icon: Code,
      count: posts.filter((p) => p.tags.some((t) => t.toLowerCase().includes('programming'))).length,
    },
    {
      id: 'ai',
      label: 'AI & Tools',
      icon: Lightbulb,
      count: posts.filter((p) => p.tags.some((t) => t.toLowerCase().includes('ai'))).length,
    },
    {
      id: 'tutorial',
      label: 'Tutorials',
      icon: BookOpen,
      count: posts.filter((p) => p.tags.some((t) => t.toLowerCase().includes('tutorial') || t.toLowerCase().includes('教程'))).length,
    },
    {
      id: 'tips',
      label: 'Tips & Tricks',
      icon: Zap,
      count: posts.filter((p) => p.tags.some((t) => t.toLowerCase().includes('tips') || t.toLowerCase().includes('技巧'))).length,
    },
  ]

  const filteredPosts =
    selectedCategory === 'all'
      ? posts
      : posts.filter((post) => {
          const categoryLower = selectedCategory.toLowerCase()
          return post.tags.some(
            (tag) =>
              tag.toLowerCase().includes(categoryLower) ||
              post.category.toLowerCase().includes(categoryLower)
          )
        })

  const navigationItems = [
    { icon: Home, label: 'Home', number: '01', href: '/' },
    { icon: FileText, label: 'Writing', number: '02', href: '/writing' },
    { icon: Rss, label: 'Feeds', number: '05', href: '/feeds', active: true },
    { icon: Briefcase, label: 'Projects', number: '03', href: '/#projects' },
    { icon: Mail, label: 'Contact', number: '04', href: '/#contact' },
  ]

  const socialLinks = [
    { icon: Github, label: 'Github', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-600">Loading feeds...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
        {/* Profile Section */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
              OS
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Onur Suyalcinkaya</h2>
              <p className="text-sm text-gray-500">Software Engineer</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                  item.active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <span className="text-xs text-gray-400">{item.number}</span>
              </Link>
            ))}
            <Link
              href="/admin"
              className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </div>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </Link>
          </div>

          {/* Online Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Online
            </h3>
            <div className="space-y-1">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <link.icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content - Two Column Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Column - Categories */}
        <div className="w-56 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <category.icon className="w-4 h-4" />
                    <span>{category.label}</span>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Feed Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Header with View Toggle */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between z-10">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {categories.find((c) => c.id === selectedCategory)?.label || 'All Feeds'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'card'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Card view"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Feed Items */}
          <div className="flex-1 px-8 py-6">
            {filteredPosts.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <Rss className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">No feeds found</p>
                  <p className="text-sm mt-1">Try selecting a different category</p>
                </div>
              </div>
            ) : viewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {filteredPosts.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <time>{item.date}</time>
                        <span className="text-gray-300">|</span>
                        <Clock className="w-3 h-3" />
                        <span>{item.readTime}</span>
                      </div>
                      {item.isMarkdown ? (
                        <span className="flex items-center text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-xs">
                          <FileJson className="w-3 h-3 mr-1" />
                          MD
                        </span>
                      ) : (
                        <span className="flex items-center text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded text-xs">
                          <Database className="w-3 h-3 mr-1" />
                          DB
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPosts.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          {item.isMarkdown ? (
                            <span className="flex items-center text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-xs">
                              <FileJson className="w-3 h-3 mr-1" />
                              MD
                            </span>
                          ) : (
                            <span className="flex items-center text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded text-xs">
                              <Database className="w-3 h-3 mr-1" />
                              DB
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{item.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{item.readTime}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {item.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
