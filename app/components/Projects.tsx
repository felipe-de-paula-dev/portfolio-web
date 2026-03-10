import React from 'react'
import { Github, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Projects() {
  return (
    <section id="projetos" className="scroll-mt-20 mb-32">
      <h2 className="text-sm font-mono text-zinc-500 mb-6 tracking-widest uppercase">/ Principais Projetos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="md:col-span-2 bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all group relative overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-white">Build Up Vision</CardTitle>
                <CardDescription className="mt-1">Plataforma de gestão de obras inteligente com IA.</CardDescription>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white" asChild>
                  <a href="#"><Github size={18} /></a>
                </Button>
                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 ml-2">TCC @ COTIL</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-zinc-950 rounded border border-zinc-800 flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a href="#" className="text-xs text-indigo-400 underline underline-offset-4 flex items-center gap-1">
                  Ver demo <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-white text-base">FindIt</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white" asChild>
                <a href="#"><Github size={18} /></a>
              </Button>
            </div>
            <CardDescription>Sistema Multi-tenant para achados e perdidos.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="flex flex-wrap gap-2 mt-auto">
                  <Badge variant="outline" className="text-[10px] border-zinc-800 text-zinc-500">Spring Boot</Badge>
                  <Badge variant="outline" className="text-[10px] border-zinc-800 text-zinc-500">MinIO</Badge>
              </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all">
        <CardHeader className="flex-row items-center justify-between gap-4">
          <div className="space-y-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-white">SmileFY (PIBIC)</CardTitle>
                <Github size={16} className="text-zinc-600" />
              </div>
              <CardDescription>Análise de densidade óssea em exames de imagem usando FastApi e IA.</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-emerald-950/30 text-emerald-500 border-emerald-900/50 whitespace-nowrap">
            Pesquisa Científica
          </Badge>
        </CardHeader>
      </Card>
    </section>
  )
}