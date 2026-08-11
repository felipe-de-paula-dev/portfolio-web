"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PS2MeteorBackground } from "@/components/PS2MeteorBackground";

interface GameCubeLoaderProps {
  onFinished: () => void;
}

export const GameCubeLoader: React.FC<GameCubeLoaderProps> = ({ onFinished }) => {
  const [textStage, setTextStage] = useState<"hidden" | "show" | "fadeOut">("hidden");
  const [showCube, setShowCube] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [bgPhase, setBgPhase] = useState<"intro" | "legend" | "active">("intro");

  // Check prefers-reduced-motion
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      onFinished();
    }
  }, [onFinished]);

  // Seamless Immediate Timeline
  useEffect(() => {
    // Start "Feito por Felipe" text fade-in immediately at 20ms
    const t1 = setTimeout(() => setTextStage("show"), 20);
    const t2 = setTimeout(() => setTextStage("fadeOut"), 1800);

    // 2.0s: Cubo surge no centro
    const t3 = setTimeout(() => setShowCube(true), 2000);

    // 2.9s: Legendas sobem de baixo para cima + Barras sobem para fora + Galáxias aparecem
    const t4 = setTimeout(() => {
      setShowLegend(true);
      setBgPhase("legend");
    }, 2900);

    // 3.9s: Handoff seamless para CubeScreen sem flicker
    const t5 = setTimeout(() => onFinished(), 3900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onFinished]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#020308] text-white flex flex-col justify-between p-6 overflow-hidden select-none z-50 font-mono">
      {/* Background with PS2 towers exit & galaxy reveal */}
      <PS2MeteorBackground phase={bgPhase} />

      {/* Top Header Logo sliding from top */}
      <AnimatePresence>
        {showLegend && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full px-4 py-2 flex items-center justify-between z-20"
          >
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="font-mono text-xs text-cyan-400/80">©</span>
              <span className="font-orbitron text-xs sm:text-sm font-bold tracking-widest uppercase opacity-80">
                Felipe de Paula
              </span>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Center Stage: "Feito por Felipe" & Main 3D Cube */}
      <main className="flex-1 flex items-center justify-center relative perspective-1200 z-10">
        {/* "Feito por Felipe" Text */}
        <AnimatePresence>
          {textStage === "show" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 0.85, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute z-20 text-center pointer-events-none"
            >
              <h1 className="font-orbitron font-medium text-xs sm:text-sm tracking-[0.3em] uppercase text-slate-300">
                Feito por Felipe
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main 3D Orbital Cube */}
        <AnimatePresence>
          {showCube && (
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-[220px] h-[220px]"
            >
              <div className="w-full h-full relative preserve-3d animate-multiaxis-cube">
                {/* FACE 1 (Front, 0°): SKILLS - AZUL CIANO */}
                <div
                  className="absolute w-[220px] h-[220px] border-2 border-cyan-400/80 bg-[#061426]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none shadow-[0_0_25px_rgba(6,182,212,0.3)]"
                  style={{ transform: "rotateY(0deg) translateZ(110px)" }}
                >
                  <div className="w-14 h-14 rounded-lg bg-cyan-400/20 border border-cyan-400/60 flex items-center justify-center text-cyan-300 mb-3">
                    <span className="font-orbitron font-extrabold text-lg text-cyan-400">S</span>
                  </div>
                  <h2 className="text-white font-mono font-extrabold text-xl tracking-wider">Skills</h2>
                </div>

                {/* FACE 2 (Right, 90°): ABOUT ME - VIOLETA */}
                <div
                  className="absolute w-[220px] h-[220px] border-2 border-purple-500/80 bg-[#120726]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none shadow-[0_0_25px_rgba(168,85,247,0.3)]"
                  style={{ transform: "rotateY(90deg) translateZ(110px)" }}
                >
                  <div className="w-14 h-14 rounded-lg bg-purple-500/20 border border-purple-500/60 flex items-center justify-center text-purple-400 mb-3">
                    <span className="font-orbitron font-extrabold text-lg text-purple-400">A</span>
                  </div>
                  <h2 className="text-white font-mono font-extrabold text-xl tracking-wider">About Me</h2>
                </div>

                {/* FACE 3 (Back, 180°): CAREER - LARANJA */}
                <div
                  className="absolute w-[220px] h-[220px] border-2 border-orange-500/80 bg-[#1e0a05]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none shadow-[0_0_25px_rgba(249,115,22,0.3)]"
                  style={{ transform: "rotateY(180deg) translateZ(110px)" }}
                >
                  <div className="w-14 h-14 rounded-lg bg-orange-500/20 border border-orange-500/60 flex items-center justify-center text-orange-400 mb-3">
                    <span className="font-orbitron font-extrabold text-lg text-orange-400">C</span>
                  </div>
                  <h2 className="text-white font-mono font-extrabold text-xl tracking-wider">Career</h2>
                </div>

                {/* FACE 4 (Left, 270°): EDUCATION - AMARELO */}
                <div
                  className="absolute w-[220px] h-[220px] border-2 border-yellow-400/80 bg-[#1c1706]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none shadow-[0_0_25px_rgba(234,179,8,0.3)]"
                  style={{ transform: "rotateY(-90deg) translateZ(110px)" }}
                >
                  <div className="w-14 h-14 rounded-lg bg-yellow-400/20 border border-yellow-400/60 flex items-center justify-center text-yellow-300 mb-3">
                    <span className="font-orbitron font-extrabold text-lg text-yellow-400">E</span>
                  </div>
                  <h2 className="text-white font-mono font-extrabold text-xl tracking-wider">Education</h2>
                </div>

                {/* FACE 5 (Top, 90° X) */}
                <div
                  className="absolute w-[220px] h-[220px] border-2 border-indigo-400/80 bg-[#0d0f2e]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none"
                  style={{ transform: "rotateX(90deg) translateZ(110px)" }}
                >
                  <h2 className="text-white font-mono font-extrabold text-xl tracking-wider">CognisGroup</h2>
                </div>

                {/* FACE 6 (Bottom, -90° X) */}
                <div
                  className="absolute w-[220px] h-[220px] border-2 border-emerald-400/80 bg-[#06180c]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none"
                  style={{ transform: "rotateX(-90deg) translateZ(110px)" }}
                >
                  <h2 className="text-white font-mono font-extrabold text-xl tracking-wider">Exit</h2>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Legend & Navigation Controls sliding up from bottom to top */}
      <AnimatePresence>
        {showLegend && (
          <motion.footer
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full px-6 py-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono z-20"
          >
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#091424] text-cyan-400 border border-cyan-500/50 font-bold">
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 text-[10px]">[S]</span>
              <span>Skills</span>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#140a24] text-purple-400 border border-purple-500/50 font-bold">
              <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/50 text-[10px]">[A]</span>
              <span>About Me</span>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#240c06] text-orange-400 border border-orange-500/50 font-bold">
              <span className="px-1.5 py-0.5 rounded bg-[#f97316]/20 text-orange-400 border border-orange-500/50 text-[10px]">[C]</span>
              <span>Career</span>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#241d06] text-yellow-400 border border-yellow-500/50 font-bold">
              <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 text-[10px]">[E]</span>
              <span>Education</span>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
};
