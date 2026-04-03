"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from '@allone/ui'
import { Input } from '@allone/ui'
import { Textarea } from '@allone/ui'
import { Plus, Edit2, Trash2, Save, X, Upload, FileText } from "lucide-react"
import type { BlogPost } from "@/lib/types"

export default function AdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showMarkdownUpload, setShowMarkdownUpload] = useState(false)
  const [markdownContent, setMarkdownContent] = useState("")
  const [markdownFilename, setMarkdownFilename] = useState("")
  const [loading, setLoading] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    date: new Date().toISOString().split("T")[0],
  })

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/content")
      const result = await response.json()
      if (result.success && result.data) {
        setPosts(result.data)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch posts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Start creating new post
  const startCreating = () => {
    setIsCreating(true)
    setEditingPost(null)
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      tags: "",
      date: new Date().toISOString().split("T")[0],
    })
  }

  // Start editing existing post
  const startEditing = (post: BlogPost) => {
    setEditingPost(post)
    setIsCreating(false)
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags.join(", "),
      date: post.date,
    })
  }

  // Cancel editing/creating
  const cancelEdit = () => {
    setEditingPost(null)
    setIsCreating(false)
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      tags: "",
      date: new Date().toISOString().split("T")[0],
    })
  }

  // Save post (create or update)
  const savePost = async () => {
    try {
      const postData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        date: formData.date,
      }

      let response
      if (editingPost) {
        // Update existing post
        response = await fetch(`/api/posts/${editingPost.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        })
      } else {
        // Create new post
        response = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        })
      }

      const result = await response.json()
      if (result.success) {
        await fetchPosts()
        cancelEdit()
      } else {
        alert("Failed to save post: " + result.error)
      }
    } catch (error) {
      console.error("[v0] Failed to save post:", error)
      alert("Failed to save post")
    }
  }

  const uploadMarkdown = async () => {
    if (!markdownFilename || !markdownContent) {
      alert("Please provide both filename and content")
      return
    }

    try {
      const response = await fetch("/api/markdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: markdownFilename,
          content: markdownContent,
        }),
      })

      const result = await response.json()
      if (result.success) {
        await fetchPosts()
        setShowMarkdownUpload(false)
        setMarkdownContent("")
        setMarkdownFilename("")
      } else {
        alert("Failed to upload markdown: " + result.error)
      }
    } catch (error) {
      console.error("Failed to upload markdown:", error)
      alert("Failed to upload markdown")
    }
  }

  const deletePost = async (post: BlogPost) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      let response
      // @ts-ignore - isMarkdown property exists from content-layer
      if (post.isMarkdown) {
        // Delete markdown file - extract filename from static ID
        const filename = post.id.replace("static-", "") + ".md"
        response = await fetch(`/api/markdown?filename=${encodeURIComponent(filename)}`, {
          method: "DELETE",
        })
      } else {
        // Delete dynamic post
        response = await fetch(`/api/posts/${post.id}`, {
          method: "DELETE",
        })
      }

      const result = await response.json()
      if (result.success) {
        await fetchPosts()
      } else {
        alert("Failed to delete post: " + result.error)
      }
    } catch (error) {
      console.error("Failed to delete post:", error)
      alert("Failed to delete post")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Admin</h1>
            <p className="text-gray-600 mt-1">Manage your blog posts</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowMarkdownUpload(true)}
              disabled={isCreating || editingPost !== null || showMarkdownUpload}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Markdown
            </Button>
            <Button onClick={startCreating} disabled={isCreating || editingPost !== null || showMarkdownUpload}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* Editor Form */}
        {(isCreating || editingPost) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{isCreating ? "Create New Post" : "Edit Post"}</h2>
              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <Textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Brief description of the post"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown supported)</label>
                <Textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your post content in markdown format..."
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                  <Input
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="React, TypeScript, Tutorial"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <Input type="date" name="date" value={formData.date} onChange={handleInputChange} />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
                <Button onClick={savePost} disabled={!formData.title || !formData.content}>
                  <Save className="w-4 h-4 mr-2" />
                  {isCreating ? "Create Post" : "Update Post"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {showMarkdownUpload && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upload Markdown File</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowMarkdownUpload(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filename (will add .md if missing)
                </label>
                <Input
                  value={markdownFilename}
                  onChange={(e) => setMarkdownFilename(e.target.value)}
                  placeholder="my-blog-post.md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Markdown Content (with frontmatter)
                </label>
                <Textarea
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  placeholder={`---
title: My Blog Post
excerpt: A short description
date: 2024-01-20
tags: [React, TypeScript]
---

# My Blog Post

Your content here...`}
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowMarkdownUpload(false)}>
                  Cancel
                </Button>
                <Button onClick={uploadMarkdown} disabled={!markdownFilename || !markdownContent}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Posts ({posts.length})</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {posts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No posts yet. Create your first post!</div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                        {/* @ts-ignore - isMarkdown property exists from content-layer */}
                        {post.isMarkdown && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                            <FileText className="w-3 h-3 mr-1" />
                            Markdown
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{post.formattedDate}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                        <span>•</span>
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {/* @ts-ignore - isMarkdown property exists from content-layer */}
                      {!post.isMarkdown && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(post)}
                          disabled={isCreating || editingPost !== null}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePost(post)}
                        disabled={isCreating || editingPost !== null}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
