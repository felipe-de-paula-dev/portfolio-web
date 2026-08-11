"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Code, Terminal, Cpu, Award, MapPin, Mail, ShieldCheck } from "lucide-react";

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
          <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500 text-black border border-white">
            ONLINE
          </span>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-orbitron text-white">Felipe de Paula</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
              Backend & Fullstack Developer
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed max-w-2xl">
            Desenvolvedor Fullstack especializado em arquiteturas enterprise robustas com <span className="text-cyan-300 font-bold">Java 21</span>, <span className="text-cyan-300 font-bold">Spring Boot 3</span> e interfaces web reativas de alto desempenho utilizando <span className="text-purple-300 font-bold">React</span>, <span className="text-purple-300 font-bold">Next.js</span> e <span className="text-purple-300 font-bold">TypeScript</span>.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Brasil</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>Clean Code & DDD</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Spring Security / OAuth2</span>
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
          <h3 className="font-mono text-sm font-extrabold text-white">Backend Especialista</h3>
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            Construção de REST APIs resilientes, microserviços escaláveis, otimização de queries SQL/JPA e mensageria de alto throughput.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#090d1a]/80 border border-slate-800 hover:border-cyan-500/40 transition-all backdrop-blur-md space-y-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <Code className="w-5 h-5" />
          </div>
          <h3 className="font-mono text-sm font-extrabold text-white">Frontend Moderno</h3>
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            Criação de dashboards e aplicações web responsivas com Next.js, componentes modulares em TypeScript, animações 3D e CSS sci-fi.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#090d1a]/80 border border-slate-800 hover:border-emerald-500/40 transition-all backdrop-blur-md space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-mono text-sm font-extrabold text-white">DevOps & Qualidade</h3>
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            Integração contínua com Docker, GitHub Actions, testes automatizados (JUnit 5 / Mockito) e monitoramento via Spring Actuator.
          </p>
        </div>
      </div>
    </div>
  );
};
