'use client'
import React from 'react'
import { Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-zinc-900 bg-zinc-950/80">
      <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-2 font-semibold text-lg tracking-tighter text-white">
          <Terminal size={18} className="text-indigo-500" />
          <span>Felipe De Paula</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          <a href="#projetos" className="hover:text-white transition-colors">Projetos</a>
          <a href="#experiencia" className="hover:text-white transition-colors">Experiência</a>
          <a href="#tech" className="hover:text-white transition-colors">Tech</a>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-white text-black hover:bg-zinc-200">
            Contato
          </Button>
        </div>
      </div>
    </nav>
  )
}