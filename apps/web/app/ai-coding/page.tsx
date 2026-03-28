"use client"

import { Code } from "lucide-react"

export default function AICodingPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <Code className="h-5 w-5 text-[#D4845E]" />
        <h1 className="text-xl font-semibold text-foreground">AI Coding Basics</h1>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#D4845E]/10 flex items-center justify-center mb-4">
          <Code className="h-8 w-8 text-[#D4845E]" />
        </div>
        <h2 className="text-lg font-medium text-foreground mb-2">
          AI Coding Basics
        </h2>
        <p className="text-muted-foreground max-w-sm">
          Learn the fundamentals of AI-assisted programming.
        </p>
      </div>
    </div>
  )
}
