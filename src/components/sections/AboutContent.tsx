"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Code, Terminal, Cpu, Award, MapPin } from "lucide-react";

export const AboutContent: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Top Banner / Avatar Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0c0926]/90 via-[#0a1128]/80 to-[#05181a]/90 border border-purple-500/30 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[3px] shadow-xl shadow-purple-500/20">
            <div className="w-full h-full rounded-[13px] bg-[#070a14] flex items-center justify-center relative overflow-hidden">
              <User className="w-16 h-16 text-purple-400 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent" />
            </div>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-orbitron text-white">Felipe de Paula</h2>

          <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed max-w-2xl">
            Desenvolvedor Backend de alta performance especializado no ecossistema <span className="text-cyan-300 font-bold">Java 25</span> e <span className="text-cyan-300 font-bold">Spring Boot 4</span>. Foco em arquitetura de microserviços, emissões de documentos e integrações críticas.
          </p>

          {/* Location Badge: 🇧🇷 Brasil */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>🇧🇷 Brasil</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl bg-[#090d1a]/80 border border-slate-800 hover:border-purple-500/40 transition-all backdrop-blur-md space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-400">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="font-mono text-sm font-extrabold text-white">Java 25 & Spring Boot 4</h3>
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            Construção de REST APIs escaláveis, concorrência moderna, JPA avançado e mensageria de alto volume.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#090d1a]/80 border border-slate-800 hover:border-cyan-500/40 transition-all backdrop-blur-md space-y-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <Code className="w-5 h-5" />
          </div>
          <h3 className="font-mono text-sm font-extrabold text-white">Integrações & Emissões</h3>
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            Desenvolvimento de fluxos de emissão automatizada, comunicação resiliente via APIs e correção de bugs complexos.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#090d1a]/80 border border-slate-800 hover:border-emerald-500/40 transition-all backdrop-blur-md space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-mono text-sm font-extrabold text-white">IA & Iniciação Científica</h3>
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            Pesquisador na UNICAMP desenvolvendo soluções de IA aplicada para diagnósticos de saúde bucal (SmileFY).
          </p>
        </div>
      </div>
    </div>
  );
};
