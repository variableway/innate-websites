"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@allone/ui"
import { ArrowRight } from "lucide-react"

// 动态渐变背景
function AnimatedGradientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 渐变网格 */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, #8FA68E1a 1px, transparent 1px),
            linear-gradient(to bottom, #8FA68E1a 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
        }}
      />
      
      {/* 浮动渐变圆 */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-[#8FA68E]/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#7A9CAE]/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-[#D4845E]/10 rounded-full blur-2xl animate-pulse-slow delay-500" />
      <div className="absolute top-10 right-1/3 w-32 h-32 bg-[#F5E6C8]/30 rounded-full blur-2xl animate-pulse-slow delay-700" />
      
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
    </div>
  )
}

// 统计数据
const stats = [
  { value: "1.2K+", label: "Members" },
  { value: "50+", label: "Courses" },
  { value: "100+", label: "Articles" },
]

function StatsSection() {
  return (
    <div className="flex gap-8 mt-12 justify-center md:justify-start">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-3xl font-bold text-[#8FA68E]">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

export function HeroVariantA() {
  return (
    <section className="relative min-h-[600px] py-16 px-6 overflow-hidden">
      <AnimatedGradientBackground />
      
      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Logo */}
          <div className="relative flex justify-center">
            <div className="relative w-64 h-64 animate-float">
              <Image
                src="/innate-logo.png"
                alt="Innate"
                fill
                className="object-contain"
                priority
              />
              {/* 发光效果 */}
              <div className="absolute inset-0 bg-[#F5E6C8]/30 rounded-full blur-2xl animate-pulse" />
            </div>
          </div>
          
          {/* 文案 */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Innate
            </h1>
            <p className="text-xl md:text-2xl text-[#D4845E] font-medium mb-4">
              What drives you, and what you makes, make you.
            </p>
            <p className="text-muted-foreground mb-8 max-w-md text-lg">
              A community for creators, builders, and lifelong learners. 
              Explore courses, share insights, and grow together.
            </p>
            
            {/* 双 CTA */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link href="/learning-library">
                <Button size="lg" className="bg-[#8FA68E] hover:bg-[#8FA68E]/90 text-white">
                  Explore Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/feed">
                <Button size="lg" variant="outline" className="border-[#7A9CAE] text-[#7A9CAE]">
                  View Feed
                </Button>
              </Link>
            </div>
            
            {/* 统计数据 */}
            <StatsSection />
          </div>
        </div>
      </div>
    </section>
  )
}
