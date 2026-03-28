"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@allone/ui"
import { BookOpen, Code, FileText } from "lucide-react"

const features = [
  {
    id: "courses",
    title: "Learning Library",
    description: "Explore courses and tutorials to level up your skills",
    icon: BookOpen,
    href: "/learning-library",
    color: "text-[#8FA68E]",
    bgColor: "bg-[#8FA68E]/10",
    borderColor: "hover:border-[#8FA68E]/30",
  },
  {
    id: "ai-coding",
    title: "AI Coding Basics",
    description: "Learn the fundamentals of AI-assisted programming",
    icon: Code,
    href: "/ai-coding",
    color: "text-[#D4845E]",
    bgColor: "bg-[#D4845E]/10",
    borderColor: "hover:border-[#D4845E]/30",
  },
  {
    id: "log",
    title: "Log",
    description: "Daily thoughts, learnings and personal notes",
    icon: FileText,
    href: "/log",
    color: "text-[#8B7355]",
    bgColor: "bg-[#8B7355]/10",
    borderColor: "hover:border-[#8B7355]/30",
  },
]

export function FeaturedSection() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">
          Explore
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link key={feature.id} href={feature.href}>
                <Card className={`h-full hover:shadow-lg transition-all duration-300 border-[#F5F0E6] ${feature.borderColor} group`}>
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg group-hover:text-[#D4845E] transition-colors">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
