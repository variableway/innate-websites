"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@allone/ui"
import { BookOpen, Code, FileText } from "lucide-react"

// 几何网格装饰
function GeometricGrid() {
  const shapes = [
    { type: "circle", x: "5%", y: "15%", size: 40, color: "#8FA68E", delay: 0 },
    { type: "square", x: "90%", y: "10%", size: 30, color: "#D4845E", delay: 1 },
    { type: "diamond", x: "85%", y: "50%", size: 50, color: "#7A9CAE", delay: 2 },
    { type: "circle", x: "8%", y: "60%", size: 35, color: "#F5E6C8", delay: 0.5 },
    { type: "square", x: "3%", y: "85%", size: 25, color: "#8FA68E", delay: 1.5 },
    { type: "diamond", x: "92%", y: "80%", size: 45, color: "#D4845E", delay: 2.5 },
    { type: "circle", x: "50%", y: "5%", size: 20, color: "#7A9CAE", delay: 0.8 },
    { type: "square", x: "70%", y: "90%", size: 35, color: "#F5E6C8", delay: 1.2 },
  ]
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => (
        <div
          key={i}
          className="absolute animate-float-rotate"
          style={{
            left: shape.x,
            top: shape.y,
            width: shape.size,
            height: shape.size,
            animationDelay: `${shape.delay}s`,
          }}
        >
          {shape.type === "circle" && (
            <div 
              className="w-full h-full rounded-full opacity-20"
              style={{ backgroundColor: shape.color }}
            />
          )}
          {shape.type === "square" && (
            <div 
              className="w-full h-full rotate-12 opacity-20"
              style={{ backgroundColor: shape.color }}
            />
          )}
          {shape.type === "diamond" && (
            <div 
              className="w-full h-full rotate-45 opacity-15"
              style={{ backgroundColor: shape.color }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// 功能卡片数据
const features = [
  {
    icon: BookOpen,
    title: "Learn",
    description: "Explore curated courses and tutorials designed to level up your skills.",
    color: "#8FA68E",
    href: "/learning-library",
  },
  {
    icon: Code,
    title: "Practice",
    description: "Hands-on coding exercises with AI assistance to accelerate your learning.",
    color: "#D4845E",
    href: "/ai-coding",
  },
  {
    icon: FileText,
    title: "Log",
    description: "Record your daily thoughts, learnings and personal growth journey.",
    color: "#7A9CAE",
    href: "/log",
  },
]

// 功能卡片组件
function FeatureCard({ feature }: { feature: typeof features[0] }) {
  const Icon = feature.icon
  return (
    <Link href={feature.href}>
      <div className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
          style={{ backgroundColor: `${feature.color}20` }}
        >
          <Icon className="h-7 w-7" style={{ color: feature.color }} />
        </div>
        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
      </div>
    </Link>
  )
}

// 堆叠卡片预览（右侧装饰）
function StackedCards() {
  return (
    <div className="relative w-64 h-64 hidden xl:block">
      <div className="absolute top-0 left-0 w-56 h-36 bg-card border border-border rounded-xl shadow-lg transform -rotate-6 opacity-60" />
      <div className="absolute top-4 left-4 w-56 h-36 bg-card border border-border rounded-xl shadow-lg transform -rotate-3 opacity-80" />
      <div className="absolute top-8 left-8 w-56 h-36 bg-card border border-border rounded-xl shadow-lg transform rotate-0 p-4">
        <div className="text-xs text-muted-foreground mb-2">Latest</div>
        <div className="font-medium text-sm line-clamp-2">Claude Dispatch 深度分析...</div>
        <div className="mt-2 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#8FA68E]" />
          <span className="text-xs text-muted-foreground">Innate Editorial</span>
        </div>
      </div>
    </div>
  )
}

export function HeroVariantD() {
  return (
    <section className="relative py-20 overflow-hidden">
      <GeometricGrid />
      
      {/* 主内容区 */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Logo */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-48 h-48">
              <Image
                src="/innate-logo.png"
                alt="Innate"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          
          {/* 文案 */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Innate
            </h1>
            <p className="text-xl text-[#D4845E] font-medium mb-4">
              What drives you, and what you makes, make you.
            </p>
            <p className="text-muted-foreground mb-8">
              A community for creators, builders, and lifelong learners.
            </p>
            <div className="flex gap-4 justify-center lg:justify-start">
              <Link href="/learning-library">
                <Button className="bg-[#8FA68E] hover:bg-[#8FA68E]/90 text-white">
                  Explore
                </Button>
              </Link>
              <Link href="/feed">
                <Button variant="outline" className="border-[#7A9CAE] text-[#7A9CAE]">
                  View Feed
                </Button>
              </Link>
            </div>
          </div>
          
          {/* 堆叠卡片装饰 */}
          <div className="hidden xl:flex justify-center">
            <StackedCards />
          </div>
        </div>
      </div>
      
      {/* 特色卡片 */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
