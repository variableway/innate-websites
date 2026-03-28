"use client"

import { FileText } from "lucide-react"

export default function LogPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-5 w-5 text-[#8B7355]" />
        <h1 className="text-xl font-semibold text-foreground">Log</h1>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#8B7355]/10 flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-[#8B7355]" />
        </div>
        <h2 className="text-lg font-medium text-foreground mb-2">
          Daily Log
        </h2>
        <p className="text-muted-foreground max-w-sm">
          Record your daily thoughts, learnings and personal notes.
        </p>
      </div>
    </div>
  )
}
