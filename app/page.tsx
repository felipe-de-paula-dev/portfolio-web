'use client'
import React from 'react'
import { Cpu } from "lucide-react"
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { TechCarousel } from './components/TechCarousel'
import { Projects } from './components/Projects'
import { MetricsGrid } from './components/MetricsGrid'

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-indigo-500/30 font-sans scroll-smooth">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <Navbar />

      <main className="relative z-10 max-w-5xl mx-auto px-6 pb-32">
        <div className="h-56 md:h-48"></div>
        
        <Hero />
        <TechCarousel />
        <Projects />
        <MetricsGrid />

        <footer className="flex flex-col md:flex-row justify-between items-center text-zinc-500 text-xs gap-4 border-t border-zinc-900 pt-8">
          <div className="flex items-center gap-4">
            <span>© 2026 Felipe De Paula</span>
            <span className="h-4 w-[1px] bg-zinc-800" />
            <div className="flex items-center gap-1.5 text-zinc-400">
               <Cpu size={12} className="text-indigo-500" />
               <span>Lab: Docker @ VPS Hostinger</span>
            </div>
          </div>
          <div className="flex gap-6">
            <a href="https://www.linkedin.com/in/felipedepauladev/" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">Currículo</a>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        @keyframes slow-spin {
          from { transform: rotateX(0deg) rotateY(0deg); }
          to { transform: rotateX(360deg) rotateY(360deg); }
        }
        .animate-slow-spin { animation: slow-spin 20s linear infinite; }
        
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          display: flex;
          width: max-content;
          animation: infinite-scroll 40s linear infinite;
        }
      `}</style>
    </div>
  )
}