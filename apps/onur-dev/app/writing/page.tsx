"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"
import {
  Home,
  Briefcase,
  ExternalLink,
  Twitter,
  Github,
  Linkedin,
  FileText,
  Calendar,
  Clock,
  Settings,
  Mail,
  FileJson,
  Database,
} from "lucide-react"
import type { BlogPost } from "@/lib/types"

// Simple markdown to HTML converter
function parseMarkdown(markdown: string): string {
  let html = markdown
    // Remove frontmatter if present
    .replace(/^---[\s\S]*?---/, "")
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 bg-gray-100 text-blue-600 rounded text-sm font-mono">$1</code>')
    // Unordered list items
    .replace(/^- (.*$)/gim, '<li class="ml-4 text-gray-700">$1</li>')
    // Ordered list items
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 text-gray-700 list-decimal">$1</li>')
    // Paragraphs (lines that don't start with special characters)
    .replace(/^(?!<[hlu]|<li|<code|<pre)(.+)$/gim, '<p class="text-gray-700 leading-relaxed mb-4">$1</p>')
    // Line breaks
    .replace(/\n\n/g, '<br />')
    // Clean up empty paragraphs
    .replace(/<p class="[^"]*"><\/p>/g, '')

  // Wrap consecutive list items in ul tags
  html = html.replace(/(<li[^>]*>.*?<\/li>\s*)+/g, (match) => {
    return `<ul class="list-disc space-y-2 my-4 pl-4">${match}</ul>`
  })

  return html
}

export default function WritingPage() {
  const searchParams = useSearchParams()
  const postSlug = searchParams.get("post")

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [selectedPostId, setSelectedPostId] = useState<string | number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/content")
        const result = await response.json()
        if (result.success && result.data) {
          setBlogPosts(result.data)
          // If there's a post slug in URL, select that post
          if (postSlug) {
            const post = result.data.find((p: BlogPost) => p.slug === postSlug)
            if (post) {
              setSelectedPostId(post.id)
            } else if (result.data.length > 0) {
              setSelectedPostId(result.data[0].id)
            }
          } else if (result.data.length > 0) {
            setSelectedPostId(result.data[0].id)
          }
        }
      } catch (error) {
        console.error("[v0] Failed to fetch posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [postSlug])

  const selectedPost = useMemo(() => {
    return blogPosts.find((post) => post.id === selectedPostId)
  }, [blogPosts, selectedPostId])

  const renderedContent = useMemo(() => {
    if (!selectedPost) return ""
    return parseMarkdown(selectedPost.content)
  }, [selectedPost])

  const navigationItems = [
    { icon: Home, label: "Home", number: "01", href: "/" },
    { icon: FileText, label: "Writing", number: "02", active: true, href: "/writing" },
    { icon: Briefcase, label: "Projects", number: "03", href: "/#projects" },
    { icon: Mail, label: "Contact", number: "04", href: "/#contact" },
  ]

  const socialLinks = [
    { icon: Github, label: "Github", href: "#", number: "07" },
    { icon: Twitter, label: "Twitter", href: "#", number: "07" },
    { icon: Linkedin, label: "LinkedIn", href: "#", number: "07" },
  ]

  return (
    <Suspense fallback={<Loading />}>
      {loading ? (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-gray-600">Loading posts...</div>
        </div>
      ) : (
        <div className="flex h-screen bg-gray-50">
          {/* Left Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Profile Section */}
            <div className="p-6 border-b border-gray-200">
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
                      item.active ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
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
                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Online</h3>
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

          {/* Middle Column - Post List */}
          <div className="w-96 bg-gray-50 border-r border-gray-200 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 bg-white">
              <h1 className="text-2xl font-bold text-gray-900">Writing</h1>
              <p className="text-sm text-gray-500 mt-1">{blogPosts.length} posts</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {blogPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <FileText className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-600 font-medium">No posts yet</p>
                  <p className="text-sm text-gray-500 mt-1">Create a post in admin or add a markdown file</p>
                </div>
              ) : (
                blogPosts.map((post) => (
                  <article
                    key={post.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedPostId === post.id
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedPostId(post.id)}
                  >
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3" />
                        <time dateTime={post.date}>{post.formattedDate}</time>
                      </div>
                      {post.isMarkdown ? (
                        <span
                          className="flex items-center text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded"
                          title="Static Markdown File"
                        >
                          <FileJson className="w-3 h-3 mr-1" />
                          MD
                        </span>
                      ) : (
                        <span
                          className="flex items-center text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded"
                          title="Database Content"
                        >
                          <Database className="w-3 h-3 mr-1" />
                          DB
                        </span>
                      )}
                    </div>

                    <h2 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">{post.title}</h2>

                    <p className="text-xs text-gray-600 mb-3 leading-relaxed line-clamp-2">{post.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Selected Post Content */}
          <div className="flex-1 bg-white overflow-y-auto">
            {selectedPost ? (
              <article className="max-w-3xl mx-auto py-12 px-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={selectedPost.date}>{selectedPost.formattedDate}</time>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedPost.readTime}</span>
                    </div>
                  </div>
                  {selectedPost.isMarkdown && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                      Source: Markdown
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedPost.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">{selectedPost.title}</h1>

                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderedContent }}
                />
              </article>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Select a post to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Suspense>
  )
}
