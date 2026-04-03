"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
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
  ArrowRight,
  FileJson,
  Database,
  Rss,
  BookOpen,
} from "lucide-react"
import type { BlogPost } from "@/lib/types"

interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  link: string
  featured: boolean
}

export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/content")
        const result = await response.json()
        if (result.success && result.data) {
          setPosts(result.data.slice(0, 6)) // First 6 posts
        }
        if (result.projects) {
          setProjects(result.projects)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const navigationItems = [
    { icon: Home, label: "Home", number: "01", active: true, href: "/" },
    { icon: FileText, label: "Writing", number: "02", href: "/writing" },
    { icon: Briefcase, label: "Projects", number: "03", href: "#projects" },
    { icon: Rss, label: "Feeds", number: "05", href: "/feeds" },
    { icon: BookOpen, label: "Tutorials", number: "06", href: "/tutorials" },
    { icon: Mail, label: "Contact", number: "04", href: "#contact" },
  ]

  const socialLinks = [
    { icon: Github, label: "Github", href: "#", number: "07" },
    { icon: Twitter, label: "Twitter", href: "#", number: "07" },
    { icon: Linkedin, label: "LinkedIn", href: "#", number: "07" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-12 px-8">
          {/* Hero Section */}
          <section className="mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {"Hi, I'm Onur"}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              A software engineer passionate about building beautiful, functional web applications. 
              I write about programming, AI tools, and web development.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href="/writing"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Read my writing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="#projects"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View projects
              </Link>
            </div>
          </section>

          {/* Recent Writing Section */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Writing</h2>
              <Link
                href="/writing"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
              >
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid gap-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/writing?post=${post.slug}`}
                  className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                        <Calendar className="w-3 h-3" />
                        <time dateTime={post.date}>{post.formattedDate}</time>
                        <span className="text-gray-300">|</span>
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                        {post.isMarkdown ? (
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
                      <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={project.link}
                  className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    {project.featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="mb-16">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in touch</h2>
              <p className="text-gray-600 mb-6">
                {"I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision."}
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="mailto:hello@example.com"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send an email
                </a>
                <div className="flex items-center space-x-2">
                  <a href="#" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
