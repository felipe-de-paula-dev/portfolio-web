"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Server, Eye, Sparkles, Layers, Terminal, ArrowUpRight } from "lucide-react";

export const CognisContent: React.FC = () => {
  const projects = [
    {
      name: "Vizion",
      tagline: "Plataforma de Visão Computacional & IA",
      badge: "SISTEMA VIZION",
      badgeColor: "border-cyan-400 text-cyan-300 bg-cyan-500/10",
      icon: <Eye className="w-6 h-6 text-cyan-400" />,
      description:
        "Sistema avançado de análise de imagens e visão computacional para processamento inteligente de diagnósticos e padrões com alta precisão.",
      features: ["Processamento de Imagens", "Deep Learning", "Diagnóstico Inteligente", "APIs Reativas"],
    },
    {
      name: "CognisGroup",
      tagline: "Arquitetura & Plataforma de Software",
      badge: "COGNISGROUP",
      badgeColor: "border-purple-400 text-purple-300 bg-purple-500/10",
      icon: <Server className="w-6 h-6 text-purple-400" />,
      description:
        "Ecossistema de software focado em microserviços Java, integrações críticas, automação de emissões e infraestrutura distribuída.",
      features: ["Microserviços Java 25", "Spring Boot 4", "Integrações Críticas", "Fluxo de Emissões"],
    },
    {
      name: "SmileFY Engine",
      tagline: "IA Odontológica na UNICAMP",
      badge: "UNICAMP RESEARCH",
      badgeColor: "border-yellow-400 text-yellow-300 bg-yellow-500/10",
      icon: <Sparkles className="w-6 h-6 text-yellow-400" />,
      description:
        "Motor de inteligência artificial desenvolvido na Iniciação Científica para mapeamento e detecção precoce de cárie e gengivite via imagens.",
      features: ["Algoritmos de IA", "Saúde Bucal", "Visão Computacional", "Iniciação Científica"],
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {projects.map((proj, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-[#090b17]/85 border border-indigo-500/30 hover:border-indigo-400/60 backdrop-blur-md transition-all space-y-4 shadow-xl flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 group-hover:scale-105 transition-transform">
                  {proj.icon}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${proj.badgeColor}`}>
                  {proj.badge}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-mono font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                  {proj.name}
                </h3>
                <p className="text-xs font-mono text-indigo-400/90 font-bold">{proj.tagline}</p>
              </div>

              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                {proj.description}
              </p>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
              {proj.features.map((feat, fIdx) => (
                <span
                  key={fIdx}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900/90 border border-slate-800 text-slate-300"
                >
                  {feat}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
