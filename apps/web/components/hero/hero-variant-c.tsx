"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@allone/ui"
import { ChevronDown } from "lucide-react"

// 视差背景
function ParallaxBackground() {
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 多层视差背景 */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#F5E6C8]/30 via-[#8FA68E]/10 to-[#7A9CAE]/20"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      />
      
      {/* 浮动的大型几何形状 */}
      <div 
        className="absolute top-20 right-10 w-[500px] h-[500px] bg-[#8FA68E]/10 rounded-full blur-3xl"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      <div 
        className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-[#D4845E]/10 rounded-full blur-3xl"
        style={{ transform: `translateY(${scrollY * 0.4}px)` }}
      />
      <div 
        className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#7A9CAE]/10 rounded-full blur-2xl"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />
      
      {/* 星空点效果 */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#8FA68E] rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// 滚动指示器
function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
      <span className="text-sm text-muted-foreground">Scroll to explore</span>
      <ChevronDown className="h-5 w-5 text-muted-foreground" />
    </div>
  )
}

export function HeroVariantC() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <ParallaxBackground />
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <Image
            src="/innate-logo.png"
            alt="Innate"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        {/* 大标题 - 字母间距 */}
        <h1 className="text-6xl md:text-8xl font-bold tracking-[0.3em] mb-8">
          INNATE
        </h1>
        
        {/* 副标题 */}
        <p className="text-xl md:text-3xl text-[#D4845E] font-medium mb-6 max-w-2xl mx-auto">
          What drives you, and what you makes, make you.
        </p>
        
        {/* 描述 */}
        <p className="text-muted-foreground mb-12 max-w-md mx-auto text-lg">
          A community for creators, builders, and lifelong learners.
        </p>
        
        {/* CTA */}
        <Link href="/learning-library">
          <Button 
            size="lg" 
            className="bg-[#8FA68E] hover:bg-[#8FA68E]/90 text-white px-12 py-6 text-lg rounded-full"
          >
            Start Your Journey
          </Button>
        </Link>
        
        {/* 次要链接 */}
        <div className="mt-6 flex gap-6 justify-center text-sm text-muted-foreground">
          <Link href="/feed" className="hover:text-foreground transition-colors">
            View Feed
          </Link>
          <span>|</span>
          <Link href="/log" className="hover:text-foreground transition-colors">
            Read Logs
          </Link>
        </div>
      </div>
      
      <ScrollIndicator />
    </section>
  )
}
