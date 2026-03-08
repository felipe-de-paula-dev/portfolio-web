'use client'
import React from 'react'
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="grid lg:grid-cols-2 gap-12 items-center mb-24">
      <div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
          Engenharia de <span className="text-zinc-500">Sistemas Escaláveis.</span>
        </h1>
        <p className="text-lg text-zinc-400 mb-8 leading-relaxed max-w-md">
          Desenvolvedor Java Junior focado em arquitetura robusta, Java/Spring e entusiasta Linux (Arch/Fedora).
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <a href="#projetos">Ver Projetos <ArrowRight size={16} className="ml-2" /></a>
          </Button>
          <Button variant="outline" className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-white">
            Github
          </Button>
        </div>
      </div>

      <div className="flex justify-center items-center h-[300px] [perspective:1000px]">
        <div className="relative w-32 h-32 [transform-style:preserve-3d] animate-slow-spin hover:[animation-play-state:paused]">
          <div className="absolute inset-0 border border-indigo-500/40 bg-indigo-500/5 backdrop-blur-[2px] [transform:translateZ(64px)]" />
          <div className="absolute inset-0 border border-indigo-500/40 bg-indigo-500/5 backdrop-blur-[2px] [transform:rotateY(180deg)_translateZ(64px)]" />
          <div className="absolute inset-0 border border-indigo-500/40 bg-indigo-500/5 backdrop-blur-[2px] [transform:rotateY(90deg)_translateZ(64px)]" />
          <div className="absolute inset-0 border border-indigo-500/40 bg-indigo-500/5 backdrop-blur-[2px] [transform:rotateY(-90deg)_translateZ(64px)]" />
          <div className="absolute inset-0 border border-indigo-500/40 bg-indigo-500/5 backdrop-blur-[2px] [transform:rotateX(90deg)_translateZ(64px)]" />
          <div className="absolute inset-0 border border-indigo-500/40 bg-indigo-500/5 backdrop-blur-[2px] [transform:rotateX(-90deg)_translateZ(64px)]" />
          <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full [transform:translateZ(0)]" />
        </div>
      </div>
    </section>
  )
}