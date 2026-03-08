'use client'
import React from 'react'
import { Github, Code2, Database, GraduationCap } from "lucide-react"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function MetricsGrid() {
  return (
    <section id="status" className="scroll-mt-20 mb-32">
      <h2 className="text-sm font-mono text-zinc-500 mb-6 tracking-widest uppercase">/ System Metrics & Runtime</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 auto-rows-[140px]">
        
        <Card className="md:col-span-3 md:row-span-2 bg-zinc-900/30 border-zinc-800 p-6 flex flex-col justify-between group hover:border-indigo-500/50 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-500 uppercase">Status: Production_Ready</span>
              </div>
              <CardTitle className="text-white text-2xl font-bold tracking-tight">Junior Java Developer</CardTitle>
              <p className="text-sm text-zinc-400 mt-4 leading-relaxed max-w-md">
                Focado em desenvolvimento e refatoração de ecossistemas legados. 
                Arquitetura de microsserviços com Spring, Hibernate e containerização (Docker/Podman).
              </p>
            </div>
            <div className="hidden md:block opacity-20 group-hover:opacity-40 transition-opacity">
                <Database size={48} className="text-indigo-500" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex flex-col">
                <span className="text-[10px] font-mono text-zinc-600 uppercase">Main_Stack</span>
                <span className="text-xs text-zinc-300 font-medium">Java, Spring Boot, Hibernate</span>
            </div>
            <div className="h-8 w-[1px] bg-zinc-800 mx-2" />
            <div className="flex flex-col">
                <span className="text-[10px] font-mono text-zinc-600 uppercase">Infrastructure</span>
                <span className="text-xs text-zinc-300 font-medium">Debian VPS, Podman, Nginx</span>
            </div>
          </div>
        </Card>

        <Card className="bg-zinc-900/30 border-zinc-800 p-4 flex flex-col justify-between hover:bg-zinc-800/20 transition-all group">
          <div className="flex justify-between items-start">
            <Github size={18} className="text-zinc-600 group-hover:text-white transition-colors" />
            <span className="text-[9px] font-mono text-zinc-600">COMMITS</span>
          </div>
          <div>
            <span className="text-3xl font-bold text-white tracking-tighter">646+</span>
            <p className="text-[10px] text-zinc-500 uppercase mt-1">Total Contributions</p>
          </div>
        </Card>

        <Card className="bg-zinc-900/30 border-zinc-800 p-4 flex flex-col justify-between hover:bg-zinc-800/20 transition-all group">
          <div className="flex justify-between items-start">
            <Code2 size={18} className="text-zinc-600 group-hover:text-indigo-400 transition-colors" />
            <span className="text-[9px] font-mono text-zinc-600">PULL REQUESTS</span>
          </div>
          <div>
            <span className="text-3xl font-bold text-white tracking-tighter">195+</span>
            <p className="text-[10px] text-zinc-500 uppercase mt-1">Merged PRs</p>
          </div>
        </Card>

        <Card className="bg-zinc-900/30 border-zinc-800 p-4 flex flex-col justify-between hover:bg-zinc-800/20 transition-all group">
          <div className="flex justify-between items-start">
            <Code2 size={18} className="text-zinc-600 group-hover:text-indigo-400 transition-colors" />
            <span className="text-[9px] font-mono text-zinc-600">REPOS</span>
          </div>
          <div>
            <span className="text-3xl font-bold text-white tracking-tighter">26</span>
            <p className="text-[10px] text-zinc-500 uppercase mt-1">Active Projects</p>
          </div>
        </Card>

        <Card className="bg-zinc-900/30 border-zinc-800 p-4 flex flex-col justify-between items-center text-center group overflow-hidden relative">
            <div className="absolute inset-0 bg-indigo-500/5 translate-y-full group-hover:translate-y-0 transition-transform" />
            <span className="text-[9px] font-mono text-zinc-600 uppercase z-10">Reliability</span>
            <span className="text-5xl font-black text-indigo-500/80 group-hover:text-indigo-400 transition-colors z-10">B+</span>
        </Card>

        <Card className="md:col-span-2 bg-zinc-950/40 border-zinc-800 p-6 flex flex-col justify-between hover:border-indigo-900/50 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-indigo-500/10 rounded border border-indigo-500/20">
                <GraduationCap size={20} className="text-indigo-400" />
            </div>
            <div>
                <h4 className="text-white font-bold text-sm">Formação Técnica</h4>
                <p className="text-[11px] text-zinc-500 font-mono">3º Ano @ COTIL UNICAMP</p>
            </div>
          </div>
          <div className="mb-4 flex items-end justify-between">
              <div>
                  <p className="text-[10px] text-zinc-600 uppercase font-mono mb-1">Target_Goal</p>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px]">
                    UNICAMP - TADS 2026
                  </Badge>
              </div>
              <div className="text-right font-mono">
                  <span className="text-xl font-bold text-white">9.2</span>
                  <span className="text-[10px] text-zinc-600 ml-1">GPA</span>
              </div>
          </div>
        </Card>

        <Card className="md:col-span-3 bg-zinc-900/30 border-zinc-800 p-6 flex flex-col justify-center gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-500">BACKEND ARCHITECTURE</span>
                <span className="text-[10px] font-mono text-indigo-400">95%</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full w-[95%] shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-500">SYSTEM DEPLOYMENT</span>
                <span className="text-[10px] font-mono text-indigo-400">80%</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full w-[80%]" />
              </div>
            </div>
        </Card>

      </div>
    </section>
  )
}