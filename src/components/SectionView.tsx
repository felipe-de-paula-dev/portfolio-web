"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, User, Briefcase, GraduationCap, Server } from "lucide-react";
import { SkillsContent } from "@/components/sections/SkillsContent";
import { AboutContent } from "@/components/sections/AboutContent";
import { CareerContent } from "@/components/sections/CareerContent";
import { EducationContent } from "@/components/sections/EducationContent";

export type SectionType = "skills" | "about" | "career" | "education" | "cognis" | "exit";

interface SectionViewProps {
  section: SectionType;
  onBack: () => void;
  onRestartBoot?: () => void;
}

export const SectionView: React.FC<SectionViewProps> = ({ section, onBack, onRestartBoot }) => {
  // ESC / Backspace key to return to Cube
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Backspace") {
        onBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack]);

  const getSectionTitle = () => {
    switch (section) {
      case "skills":
        return "SYNAPSE::STACK";
      case "about":
        return "BIO::KERNEL";
      case "career":
        return "CHRONICLES";
      case "education":
        return "ACADEMY";
      case "cognis":
        return "COGNIS::NEXUS";
      case "exit":
        return "TERMINATE";
    }
  };

  const getSectionSubtitle = () => {
    switch (section) {
      case "skills":
        return "JAVA 21 • SPRING BOOT 3 • DISTRIBUTED SYSTEMS";
      case "about":
        return "ENGINEERING PROFILE & ARCHITECTURAL PHILOSOPHY";
      case "career":
        return "HIGH-IMPACT ENTERPRISE SYSTEM EXPLOITS";
      case "education":
        return "COMPUTER SCIENCE FOUNDATIONS & CERTIFICATIONS";
      case "cognis":
        return "PROPRIETARY SYSTEM LABS";
      case "exit":
        return "SESSION DISCONNECT";
    }
  };

  const getSectionIcon = () => {
    switch (section) {
      case "skills":
        return <Zap className="w-5 h-5 text-cyan-400" />;
      case "about":
        return <User className="w-5 h-5 text-purple-400" />;
      case "career":
        return <Briefcase className="w-5 h-5 text-orange-400" />;
      case "education":
        return <GraduationCap className="w-5 h-5 text-yellow-400" />;
      default:
        return <Server className="w-5 h-5 text-indigo-400" />;
    }
  };

  const renderSectionContent = () => {
    switch (section) {
      case "skills":
        return <SkillsContent />;
      case "about":
        return <AboutContent />;
      case "career":
        return <CareerContent />;
      case "education":
        return <EducationContent />;
      default:
        return (
          <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto py-16">
            <div className="w-16 h-16 rounded-2xl bg-[#0e1628] border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/10">
              <Server className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase font-bold">
                {getSectionTitle()}
              </span>
              <h1 className="text-3xl font-orbitron font-extrabold text-white tracking-tight uppercase">
                COGNIS::NEXUS LABS
              </h1>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                Módulo de arquitetura proprietária sob atualização. Sessão ativada por Felipe de Paula.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.22 }}
      className="w-screen h-screen bg-[#020308] text-[#e2e8f0] font-mono flex flex-col justify-between p-4 sm:p-8 select-none z-40 overflow-hidden relative"
    >
      {/* Header */}
      <div className="z-20 flex items-center justify-between border-b border-slate-800/80 pb-4 max-w-6xl w-full mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0a101f] hover:bg-[#121c36] text-cyan-400 text-xs font-mono font-bold border border-cyan-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>[ESC] Retornar</span>
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            {getSectionIcon()}
            <span className="font-orbitron text-sm sm:text-base font-extrabold tracking-wider text-white uppercase">
              {getSectionTitle()}
            </span>
          </div>
          <span className="text-[10px] text-cyan-400/80 font-mono tracking-widest uppercase hidden sm:block mt-0.5">
            {getSectionSubtitle()}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <span className="font-mono text-cyan-400">©</span>
          <span className="font-orbitron text-xs font-bold tracking-widest uppercase">Felipe de Paula</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto py-6 px-2 max-w-6xl w-full mx-auto z-10 space-y-6">
        {renderSectionContent()}
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-[11px] text-slate-500 font-mono z-20 border-t border-slate-800/60 pt-3">
        Pressione <span className="text-cyan-400 font-bold">[ESC]</span> para retornar à Matrix 3D
        {onRestartBoot && (
          <>
            {" "}
            |{" "}
            <button
              onClick={onRestartBoot}
              className="text-purple-400 hover:text-purple-300 font-bold underline cursor-pointer"
            >
              Reiniciar Boot
            </button>
          </>
        )}
      </footer>
    </motion.div>
  );
};
