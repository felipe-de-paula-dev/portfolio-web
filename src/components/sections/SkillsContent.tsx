"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Terminal, Database, Server, ShieldCheck, Zap, Layers, Sparkles, Code2 } from "lucide-react";

interface SkillNode {
  category: string;
  title: string;
  version: string;
  badge: string;
  badgeColor?: string;
  icon: React.ReactNode;
  accentColor: string;
  borderColor: string;
  glowColor: string;
  highlights: string[];
  description: string;
}

export const SkillsContent: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");

  const skillNodes: SkillNode[] = [
    {
      category: "BACKEND",
      title: "Java 25 Engine",
      version: "v25.0",
      badge: "LATEST ECOSYSTEM",
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      accentColor: "text-cyan-400",
      borderColor: "border-cyan-500/40 hover:border-cyan-400",
      glowColor: "shadow-[0_0_20px_rgba(6,182,212,0.25)]",
      highlights: ["Virtual Threads (Loom)", "Foreign Function & Memory API", "Pattern Matching & Records", "ZGC Low-Latency Tuning"],
      description: "Desenvolvimento de alta concorrência com threads virtuais não-bloqueantes e utilização de novos recursos da JVM 25.",
    },
    {
      category: "BACKEND",
      title: "Spring Boot 4",
      version: "v4.0 / Spring 7",
      badge: "CORE ARCHITECTURE",
      icon: <Server className="w-5 h-5 text-emerald-400" />,
      accentColor: "text-emerald-400",
      borderColor: "border-emerald-500/40 hover:border-emerald-400",
      glowColor: "shadow-[0_0_20px_rgba(16,185,129,0.25)]",
      highlights: ["Spring Web / REST APIs", "Spring Security & OAuth2", "Spring Data JPA / ORM", "Spring Cloud & Gateway"],
      description: "Construção de microserviços escaláveis, APIs RESTful de alta resposta e arquitetura de segurança integrada.",
    },
    {
      category: "DATA",
      title: "PostgreSQL & Database",
      version: "SQL & JPA",
      badge: "HIGH THROUGHPUT",
      icon: <Database className="w-5 h-5 text-purple-400" />,
      accentColor: "text-purple-400",
      borderColor: "border-purple-500/40 hover:border-purple-400",
      glowColor: "shadow-[0_0_20px_rgba(168,85,247,0.25)]",
      highlights: ["Indexação & Query Optimization", "Connection Pooling (HikariCP)", "Modelagem Relacional SQL", "Cache com Redis"],
      description: "Otimização de consultas relacionais de alto volume, migrações de banco de dados e estratégias de cache.",
    },
    {
      category: "INTEGRATIONS",
      title: "Integrações & Emissões",
      version: "CRITICAL FLOWS",
      badge: "BUSINESS BACKEND",
      icon: <Layers className="w-5 h-5 text-orange-400" />,
      accentColor: "text-orange-400",
      borderColor: "border-orange-500/40 hover:border-orange-400",
      glowColor: "shadow-[0_0_20px_rgba(249,115,22,0.25)]",
      highlights: ["Emissão de Documentos/Transações", "Resiliência de Integrações API", "Diagnóstico e Correção de Bugs", "Arquitetura Orientada a Eventos"],
      description: "Desenvolvimento de motores de emissão automatizada e conectores de comunicação resiliente entre sistemas.",
    },
    {
      category: "RESEARCH",
      title: "IA & Visão Computacional",
      version: "SmileFY Project",
      badge: "UNICAMP LABS",
      badgeColor: "text-yellow-400",
      icon: <Sparkles className="w-5 h-5 text-yellow-400" />,
      accentColor: "text-yellow-400",
      borderColor: "border-yellow-500/40 hover:border-yellow-400",
      glowColor: "shadow-[0_0_20px_rgba(234,179,8,0.25)]",
      highlights: ["Inteligência Artificial Aplicada", "Processamento de Imagens", "Diagnóstico Odontológico", "Iniciação Científica UNICAMP"],
      description: "Pesquisa científica na UNICAMP aplicada à detecção automatizada de cáries e lesões via algoritmos de IA.",
    },
    {
      category: "DEVOPS",
      title: "DevOps & Mobile",
      version: "Docker & Dart",
      badge: "INFRA & TOOLS",
      icon: <Code2 className="w-5 h-5 text-indigo-400" />,
      accentColor: "text-indigo-400",
      borderColor: "border-indigo-500/40 hover:border-indigo-400",
      glowColor: "shadow-[0_0_20px_rgba(129,140,248,0.25)]",
      highlights: ["Docker Containerization", "GitHub Actions CI/CD", "Desenvolvimento Mobile Dart", "Engenharia de Qualidade JUnit 5"],
      description: "Empacotamento de contêineres, pipelines de automação e desenvolvimento complementar mobile no COTIL UNICAMP.",
    },
  ];

  const filters = ["ALL", "BACKEND", "DATA", "INTEGRATIONS", "RESEARCH", "DEVOPS"];

  const filteredNodes =
    selectedFilter === "ALL"
      ? skillNodes
      : skillNodes.filter((node) => node.category === selectedFilter);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {filters.map((filter) => {
          const isActive = selectedFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20 scale-105"
                  : "bg-[#060b17]/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Grid of Sci-Fi Skill Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNodes.map((node, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            className={`p-5 rounded-2xl bg-[#070c18]/90 border backdrop-blur-xl transition-all duration-300 space-y-3 ${node.borderColor} ${node.glowColor}`}
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-700/80">
                  {node.icon}
                </div>
                <div>
                  <h3 className="font-mono text-base font-extrabold text-white">
                    {node.title}
                  </h3>
                  <span className={`text-[11px] font-mono font-bold ${node.accentColor}`}>
                    {node.version}
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-slate-900 border border-slate-700 text-slate-300">
                {node.badge}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              {node.description}
            </p>

            {/* Bullet Highlights */}
            <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/60">
              {node.highlights.map((h, hIdx) => (
                <div key={hIdx} className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <div className={`w-1.5 h-1.5 rounded-full ${node.accentColor.replace('text-', 'bg-')}`} />
                  <span className="truncate">{h}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
