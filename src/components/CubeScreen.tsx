"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, User, Briefcase, GraduationCap, Server, Cpu, X } from "lucide-react";
import { PS2MeteorBackground } from "@/components/PS2MeteorBackground";
import { SkillsContent } from "@/components/sections/SkillsContent";
import { AboutContent } from "@/components/sections/AboutContent";
import { CareerContent } from "@/components/sections/CareerContent";
import { EducationContent } from "@/components/sections/EducationContent";

export type SectionType = "skills" | "about" | "career" | "education" | "cognis" | "exit";

interface CubeScreenProps {
  onRestartBoot?: () => void;
}

export const CubeScreen: React.FC<CubeScreenProps> = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType | null>(null);
  const [hoveredFace, setHoveredFace] = useState<string | null>(null);

  // Intro Stage: "text" -> "emerge" -> "active"
  const [introStage, setIntroStage] = useState<"text" | "emerge" | "active">("text");

  // Continuous 60 FPS 3D Rotation State
  const [rot, setRot] = useState({ x: -15, y: 25 });
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const rotStartRef = useRef({ x: -15, y: 25 });

  // Single Timeline Effect
  useEffect(() => {
    const t1 = setTimeout(() => setIntroStage("emerge"), 1800);
    const t2 = setTimeout(() => setIntroStage("active"), 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Continuous 60 FPS Ambient Rotation Loop when NOT dragging
  useEffect(() => {
    let animId: number;
    const loop = () => {
      if (!isDraggingRef.current) {
        setRot((prev) => ({
          x: (prev.x + 0.12) % 360,
          y: (prev.y + 0.25) % 360,
        }));
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const triggerSectionTransition = useCallback(
    (section: SectionType) => {
      if (introStage !== "active") return;
      setSelectedSection((prev) => (prev === section ? null : section));
    },
    [introStage]
  );

  // Global Pointer Move Listener: Smooth 1-to-1 Instant Mouse Rotation Tracking (Zero CSS Transition Lag)
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || introStage !== "active") return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      setRot({
        x: rotStartRef.current.x - deltaY * 0.45,
        y: rotStartRef.current.y + deltaX * 0.45,
      });
    };

    const handleGlobalPointerUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handleGlobalPointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [introStage]);

  // High-Precision Pointer Down with setPointerCapture (Zero Browser Ghost Interference)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (introStage !== "active") return;
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}

    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    rotStartRef.current = { ...rot };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  // Keyboard shortcut listener: S -> Skills, A -> About, C -> Career, E -> Education, ESC -> Close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (introStage !== "active") return;

      const key = e.key.toLowerCase();
      if (key === "escape" || key === "backspace") setSelectedSection(null);
      if (key === "s") triggerSectionTransition("skills");
      if (key === "a") triggerSectionTransition("about");
      if (key === "c") triggerSectionTransition("career");
      if (key === "e") triggerSectionTransition("education");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [introStage, triggerSectionTransition]);

  const getSectionTitle = (sec: SectionType) => {
    switch (sec) {
      case "skills":
        return "MEMORY SLOTS";
      case "about":
        return "PLAYER PROFILE";
      case "career":
        return "SYSTEM SAVES";
      case "education":
        return "ACHIEVEMENTS";
      case "cognis":
        return "X-LIVE LABS";
      case "exit":
        return "POWER DOWN";
    }
  };

  const getSectionButtonBadge = (sec: SectionType) => {
    switch (sec) {
      case "skills":
        return "(X) [S]";
      case "about":
        return "(Y) [A]";
      case "career":
        return "(B) [C]";
      case "education":
        return "(A) [E]";
      default:
        return "[SYS]";
    }
  };

  const renderSectionContent = (sec: SectionType) => {
    switch (sec) {
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
          <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto py-12">
            <div className="w-16 h-16 rounded-2xl bg-[#061e14] border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
              <Server className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs text-emerald-400 font-mono tracking-widest uppercase font-bold">
                {getSectionTitle(sec)}
              </span>
              <h1 className="text-2xl font-orbitron font-extrabold text-white tracking-tight uppercase">
                X-LIVE PROPRIETARY LABS
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
    <div className="w-screen h-screen bg-[#010206] text-white font-mono flex flex-col justify-between overflow-hidden relative select-none">
      {/* High-Contrast Space Canvas Background */}
      <PS2MeteorBackground phase={introStage === "active" ? "active" : "intro"} />

      {/* Clean Minimalist Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: introStage === "active" ? 1 : 0, y: introStage === "active" ? 0 : -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full px-8 py-6 flex items-center justify-between z-20"
      >
        <div className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer group">
          <span className="font-mono text-xs text-cyan-400/80">©</span>
          <span className="font-orbitron text-xs sm:text-sm font-bold tracking-widest uppercase opacity-90 group-hover:opacity-100 transition-opacity">
            Felipe de Paula
          </span>
        </div>
      </motion.header>

      {/* Main Stage: 3D Cube & Right Side Cards Panel */}
      <main className="flex-1 flex items-center justify-center relative perspective-1200 z-10 w-full h-full pb-8">
        {/* "Feito por Felipe" Text */}
        <AnimatePresence>
          {introStage === "text" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 0.85, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute z-20 text-center pointer-events-none"
            >
              <h1 className="font-orbitron font-medium text-xs sm:text-sm tracking-[0.3em] uppercase text-slate-300">
                Feito por Felipe
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Cube Container with setPointerCapture */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, x: 0, y: -28 }}
          animate={
            introStage !== "text"
              ? {
                  scale: selectedSection ? 0.8 : 1,
                  x: selectedSection ? -320 : 0,
                  y: -28,
                  opacity: 1,
                }
              : { scale: 0.7, x: 0, y: -28, opacity: 0 }
          }
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDragStart={(e) => e.preventDefault()}
          className={`relative w-[220px] h-[220px] pointer-events-auto z-20 select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {/* Continuous Angle Rotation (transition-none during drag to eliminate flick/lag fight) */}
          <div
            className={`w-full h-full relative preserve-3d pointer-events-auto ${
              isDragging ? "transition-none" : "transition-transform duration-300"
            }`}
            style={{ transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}
          >
            {/* FACE 1 (Front, 0°): MEMORY SLOTS (SKILLS) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                triggerSectionTransition("skills");
              }}
              onMouseEnter={() => setHoveredFace("skills")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-[220px] h-[220px] border-2 border-cyan-400 bg-[#061426]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none transition-all duration-200 cursor-pointer select-none ${
                hoveredFace === "skills" || selectedSection === "skills"
                  ? "glow-cyan border-white scale-105"
                  : ""
              }`}
              style={{ transform: "rotateY(0deg) translateZ(110px)" }}
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 font-mono font-extrabold text-xs shadow-[0_0_10px_rgba(6,182,212,0.4)] pointer-events-none">
                (X) [S]
              </div>
              <div className="w-14 h-14 rounded-lg bg-cyan-400/20 border border-cyan-400/60 flex items-center justify-center text-cyan-300 mb-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] pointer-events-none">
                <Zap className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-base tracking-wider uppercase pointer-events-none">MEMORY SLOTS</h2>
              <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-bold mt-0.5 pointer-events-none">
                STACK & KNOWLEDGE
              </span>
            </div>

            {/* FACE 2 (Right, 90°): PLAYER PROFILE (ABOUT ME) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                triggerSectionTransition("about");
              }}
              onMouseEnter={() => setHoveredFace("about")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-[220px] h-[220px] border-2 border-purple-500 bg-[#120726]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none transition-all duration-200 cursor-pointer select-none ${
                hoveredFace === "about" || selectedSection === "about"
                  ? "glow-purple border-white scale-105"
                  : ""
              }`}
              style={{ transform: "rotateY(90deg) translateZ(110px)" }}
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/60 font-mono font-extrabold text-xs shadow-[0_0_10px_rgba(168,85,247,0.4)] pointer-events-none">
                (Y) [A]
              </div>
              <div className="w-14 h-14 rounded-lg bg-purple-500/20 border border-purple-500/60 flex items-center justify-center text-purple-400 mb-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] pointer-events-none">
                <User className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-base tracking-wider uppercase pointer-events-none">PLAYER PROFILE</h2>
              <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase font-bold mt-0.5 pointer-events-none">
                BIOGRAPHY & IDENTITY
              </span>
            </div>

            {/* FACE 3 (Back, 180°): SYSTEM SAVES (CAREER) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                triggerSectionTransition("career");
              }}
              onMouseEnter={() => setHoveredFace("career")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-[220px] h-[220px] border-2 border-orange-500 bg-[#1e0a05]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none transition-all duration-200 cursor-pointer select-none ${
                hoveredFace === "career" || selectedSection === "career"
                  ? "glow-orange border-white scale-105"
                  : ""
              }`}
              style={{ transform: "rotateY(180deg) translateZ(110px)" }}
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-400/60 font-mono font-extrabold text-xs shadow-[0_0_10px_rgba(249,115,22,0.4)] pointer-events-none">
                (B) [C]
              </div>
              <div className="w-14 h-14 rounded-lg bg-orange-500/20 border border-orange-500/60 flex items-center justify-center text-orange-400 mb-2 shadow-[0_0_15px_rgba(249,115,22,0.3)] pointer-events-none">
                <Briefcase className="w-8 h-8 text-orange-400" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-base tracking-wider uppercase pointer-events-none">SYSTEM SAVES</h2>
              <span className="text-[10px] text-orange-400 font-mono tracking-widest uppercase font-bold mt-0.5 pointer-events-none">
                CAREER & EXPLOITS
              </span>
            </div>

            {/* FACE 4 (Left, 270°): ACHIEVEMENTS (EDUCATION) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                triggerSectionTransition("education");
              }}
              onMouseEnter={() => setHoveredFace("education")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-[220px] h-[220px] border-2 border-yellow-400 bg-[#1c1706]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none transition-all duration-200 cursor-pointer select-none ${
                hoveredFace === "education" || selectedSection === "education"
                  ? "glow-yellow border-white scale-105"
                  : ""
              }`}
              style={{ transform: "rotateY(-90deg) translateZ(110px)" }}
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-400/60 font-mono font-extrabold text-xs shadow-[0_0_10px_rgba(234,179,8,0.4)] pointer-events-none">
                (A) [E]
              </div>
              <div className="w-14 h-14 rounded-lg bg-yellow-400/20 border border-yellow-400/60 flex items-center justify-center text-yellow-300 mb-2 shadow-[0_0_15px_rgba(234,179,8,0.3)] pointer-events-none">
                <GraduationCap className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-base tracking-wider uppercase pointer-events-none">ACHIEVEMENTS</h2>
              <span className="text-[10px] text-yellow-400 font-mono tracking-widest uppercase font-bold mt-0.5 pointer-events-none">
                DEGREES & CERTS
              </span>
            </div>

            {/* FACE 5 (Top, 90° X): X-LIVE LABS */}
            <div
              className="absolute w-[220px] h-[220px] border-2 border-indigo-400 bg-[#0d0f2e]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none select-none"
              style={{ transform: "rotateX(90deg) translateZ(110px)" }}
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/60 font-mono font-extrabold text-xs pointer-events-none">
                [SYS]
              </div>
              <div className="w-14 h-14 rounded-lg bg-indigo-400/20 border border-indigo-400/60 flex items-center justify-center text-indigo-300 mb-2 pointer-events-none">
                <Server className="w-8 h-8 text-indigo-400" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-base tracking-wider uppercase pointer-events-none">X-LIVE LABS</h2>
              <span className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase font-bold mt-0.5 pointer-events-none">
                PROPRIETARY SYSTEMS
              </span>
            </div>

            {/* FACE 6 (Bottom, -90° X): POWER DOWN */}
            <div
              className="absolute w-[220px] h-[220px] border-2 border-emerald-400 bg-[#06180c]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none select-none"
              style={{ transform: "rotateX(-90deg) translateZ(110px)" }}
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 font-mono font-extrabold text-xs pointer-events-none">
                [OFF]
              </div>
              <div className="w-14 h-14 rounded-lg bg-emerald-400/20 border border-emerald-400/60 flex items-center justify-center text-emerald-300 mb-2 pointer-events-none">
                <Cpu className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-base tracking-wider uppercase pointer-events-none">POWER DOWN</h2>
              <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase font-bold mt-0.5 pointer-events-none">
                SHUTDOWN SESSION
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Side Content Cards Panel */}
        <AnimatePresence>
          {selectedSection && (
            <motion.div
              initial={{ opacity: 0, x: 90, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 90, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
              className="absolute right-4 sm:right-12 top-14 bottom-12 w-[92%] sm:w-[58%] max-w-[680px] bg-[#040e1b]/92 border border-emerald-500/40 backdrop-blur-2xl rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.85)] p-6 sm:p-8 z-30 flex flex-col justify-between overflow-hidden"
            >
              {/* Header inside Panel */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 font-mono font-black text-xs">
                    {getSectionButtonBadge(selectedSection)}
                  </span>
                  <h2 className="text-lg sm:text-xl font-orbitron font-extrabold text-white tracking-wider uppercase">
                    {getSectionTitle(selectedSection)}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedSection(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/60 text-xs font-mono font-bold transition-all cursor-pointer shadow-lg"
                >
                  <X className="w-4 h-4" />
                  <span>[ESC / FECHAR]</span>
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin">
                {renderSectionContent(selectedSection)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
