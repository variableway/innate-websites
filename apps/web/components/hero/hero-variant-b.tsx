"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@allone/ui"
import { feedPosts } from "@/lib/data"
import { ArrowRight } from "lucide-react"

// 浮动装饰
function FloatingDecoration() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* 浮动的小圆点 */}
      <div className="absolute top-10 left-10 w-3 h-3 bg-[#8FA68E] rounded-full animate-float-slow" />
      <div className="absolute top-32 right-20 w-2 h-2 bg-[#D4845E] rounded-full animate-float-medium" />
      <div className="absolute bottom-20 left-20 w-4 h-4 bg-[#7A9CAE] rounded-full animate-float-fast" />
      <div className="absolute top-40 left-1/4 w-2 h-2 bg-[#F5E6C8] rounded-full animate-float-slow delay-300" />
      
      {/* 几何形状 */}
      <div className="absolute top-20 right-10 w-6 h-6 border-2 border-[#8FA68E]/30 rotate-45 animate-spin-slow" />
      <div className="absolute bottom-32 right-32 w-8 h-8 border-2 border-[#D4845E]/20 rounded-full animate-pulse" />
      <div className="absolute top-1/2 left-10 w-4 h-4 border-2 border-[#7A9CAE]/25 rotate-12 animate-float-medium" />
    </div>
  )
}

// 最新帖子卡片
function LatestPostCard({ post }: { post: typeof feedPosts[0] }) {
  return (
    <div className="w-48 flex-shrink-0 bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="text-xs text-muted-foreground mb-2">{post.date}</div>
      <h4 className="font-medium text-sm line-clamp-2 mb-3 group-hover:text-[#8FA68E] transition-colors">
        {post.title}
      </h4>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px]">
          {post.author.name[0]}
        </div>
        <span className="text-xs text-muted-foreground truncate">{post.author.name}</span>
      </div>
    </div>
  )
}

export function HeroVariantB() {
  const latestPosts = feedPosts.slice(0, 3)
  
  return (
    <section className="relative min-h-[600px] py-16 px-6 overflow-hidden">
      <FloatingDecoration />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* 左侧 - 品牌区 */}
        <div className="relative flex justify-center lg:justify-end order-2 lg:order-1">
          <div className="relative">
            {/* Logo */}
            <div className="relative w-72 h-72 animate-float">
              <Image
                src="/innate-logo.png"
                alt="Innate"
                fill
                className="object-contain"
                priority
              />
              {/* 发光效果 */}
              <div className="absolute inset-0 bg-[#F5E6C8]/20 rounded-full blur-3xl" />
            </div>
            
            {/* 环绕的装饰文字 */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
              <span className="text-5xl font-bold text-[#8FA68E]/10 tracking-widest">INNATE</span>
            </div>
          </div>
        </div>
        
        {/* 右侧 - 文案区 */}
        <div className="text-center lg:text-left order-1 lg:order-2">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            What drives you,
            <br />
            <span className="text-[#D4845E]">and what you makes,</span>
            <br />
            make you.
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            A community for creators, builders, and lifelong learners. 
            Explore courses, share insights, and grow together.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-12">
            <Link href="/learning-library">
              <Button size="lg" className="bg-[#8FA68E] hover:bg-[#8FA68E]/90 text-white">
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/feed">
              <Button size="lg" variant="outline" className="border-[#7A9CAE] text-[#7A9CAE]">
                View Community
              </Button>
            </Link>
          </div>
          
          {/* 最新内容预览 */}
          <div>
            <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#8FA68E] rounded-full animate-pulse" />
              Latest from community
            </p>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {latestPosts.map((post) => (
                <LatestPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
