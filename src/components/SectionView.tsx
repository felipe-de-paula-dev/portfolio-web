"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, HardHat } from "lucide-react";

export type SectionType = "skills" | "about" | "career" | "education" | "cognis" | "exit";

interface SectionViewProps {
  section: SectionType;
  onBack: () => void;
  onRestartBoot?: () => void;
}

export const SectionView: React.FC<SectionViewProps> = ({ section, onBack }) => {
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
        return "Skills";
      case "about":
        return "About Me";
      case "career":
        return "Career";
      case "education":
        return "Education";
      case "cognis":
        return "Cognis Lab";
      case "exit":
        return "Exit";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.25 }}
      className="w-screen h-screen bg-[#020308] text-[#e2e8f0] font-mono flex flex-col justify-between p-6 sm:p-10 select-none z-40 overflow-hidden relative"
    >
      {/* Top Left: Ultra Simple Back Button & Discrete Logo */}
      <div className="z-10 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0a101f] hover:bg-[#121c36] text-cyan-400 text-xs font-mono font-bold border border-cyan-500/40 transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar [ESC]</span>
        </button>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="font-mono text-xs text-cyan-400/80">©</span>
          <span className="font-orbitron text-xs sm:text-sm font-bold tracking-widest uppercase opacity-80">
            Felipe de Paula
          </span>
        </div>
      </div>

      {/* Center: Ultra Simple "Em Construção" Text */}
      <main className="flex-1 flex flex-col items-center justify-center text-center space-y-4 z-10 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#0e1628] border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/10">
          <HardHat className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">
            {getSectionTitle()}
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
            Em construção
          </h1>

          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            Esta seção está em desenvolvimento por Felipe de Paula.
          </p>
        </div>
      </main>

      {/* Footer minimal spacer */}
      <div className="text-center text-[11px] text-slate-500 font-mono z-10">
        Pressione <span className="text-cyan-400 font-bold">[ESC]</span> para retornar ao Cubo 3D.
      </div>
    </motion.div>
  );
};
