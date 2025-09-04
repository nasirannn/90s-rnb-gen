"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { AnimatedBackground } from "@/components/ui/animated-background";

export const HeroSection = () => {
  const { theme } = useTheme();
  return (
    <section className="relative w-full min-h-screen pt-20">

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/only-90s-rnb-background.png"
          alt="90s R&B Background"
          fill
          className="object-cover object-center select-none"
          priority
          quality={100}
          sizes="100vw"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Animated Background Effects */}
        <AnimatedBackground>
          <div></div>
        </AnimatedBackground>
        
        {/* Twinkling Stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Star 1 */}
          <div className="absolute top-16 left-16 w-1 h-1 bg-white rounded-full animate-twinkle opacity-60"></div>
          {/* Star 2 */}
          <div className="absolute top-28 right-24 w-1 h-1 bg-white rounded-full animate-twinkle-delay opacity-80"></div>
          {/* Star 3 */}
          <div className="absolute top-40 left-1/3 w-0.5 h-0.5 bg-white rounded-full animate-twinkle-slow opacity-70"></div>
          {/* Star 4 */}
          <div className="absolute top-56 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-twinkle opacity-50"></div>
          {/* Star 5 */}
          <div className="absolute top-72 left-1/2 w-1 h-1 bg-white rounded-full animate-twinkle-delay opacity-90"></div>
          {/* Star 6 */}
          <div className="absolute top-88 right-16 w-0.5 h-0.5 bg-white rounded-full animate-twinkle-slow opacity-60"></div>
          {/* Star 7 */}
          <div className="absolute top-1/3 left-12 w-1 h-1 bg-white rounded-full animate-twinkle opacity-80"></div>
          {/* Star 8 */}
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white rounded-full animate-twinkle-delay opacity-70"></div>
          {/* Star 9 */}
          <div className="absolute top-2/3 left-1/4 w-0.5 h-0.5 bg-white rounded-full animate-twinkle-slow opacity-50"></div>
          {/* Star 10 */}
          <div className="absolute top-5/6 right-1/2 w-1 h-1 bg-white rounded-full animate-twinkle opacity-90"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto">
        <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-16 md:py-24">
          <div className="text-center space-y-8">
            <Badge variant="outline" className="text-sm py-2 bg-transparent border-white/30 text-white">
              <span className="mr-3 text-primary font-semibold">
                <Badge>AI Powered</Badge>
              </span>
              <span className="text-white/90 font-medium"> Free Online Authentic 90s R&B Generator </span>
            </Badge>

            <div className="max-w-screen-lg mx-auto text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                Create Authentic
                <span className="text-transparent px-2 bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text">
                  90s R&B
                </span>
                with AI
              </h1>
            </div>

            <p className="max-w-screen-md mx-auto text-base md:text-xl text-white/90 leading-relaxed mb-8">
              Generate professional-quality 90s R&B music with AI. Choose from New Jack Swing, Hip-Hop Soul, Quiet Storm, and Neo-Soul genres with customizable moods.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
              <Link href="/studio">
                <button className="group relative inline-flex items-center gap-3 px-10 py-2.5 bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden shadow-xl border border-purple-400/20 text-xl">
                  {/* Shine effect overlay */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
                  
                  <svg className="relative z-10 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <span className="relative z-10">Try It On</span>
                </button>
              </Link>
              <Link href="#introduction">
                <button className="group relative inline-flex items-center gap-3 px-12 py-2.5 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105 overflow-hidden shadow-lg hover:shadow-xl border border-white/30 text-xl">
                  <span className="relative z-10">Learn More</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
