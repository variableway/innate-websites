"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@allone/ui"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F5F0E6]/50 to-background py-16 px-6">
      {/* 装饰背景元素 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-[#8FA68E]/20 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-[#7A9CAE]/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-[#D4845E]/10 blur-2xl" />
      </div>
      
      <div className="relative max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
        {/* Logo */}
        <div className="relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0">
          <div className="absolute inset-0 bg-[#F5E6C8]/30 rounded-full blur-2xl" />
          <Image
            src="/innate-logo.png"
            alt="Innate"
            fill
            className="object-contain rounded-full relative z-10"
            priority
          />
        </div>
        
        {/* 文案 */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Innate
          </h1>
          <p className="text-lg text-[#D4845E] font-medium mb-6">
            What drives you, and what you makes, make you.
          </p>
          <Link href="/learning-library">
            <Button className="bg-[#8FA68E] hover:bg-[#8FA68E]/90 text-white">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
