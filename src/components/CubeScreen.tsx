"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, User, Briefcase, GraduationCap, Server, Gamepad2 } from "lucide-react";
import { PS2MeteorBackground } from "@/components/PS2MeteorBackground";
import { SkillsContent } from "@/components/sections/SkillsContent";
import { AboutContent } from "@/components/sections/AboutContent";
import { CareerContent } from "@/components/sections/CareerContent";
import { EducationContent } from "@/components/sections/EducationContent";
import { CognisContent } from "@/components/sections/CognisContent";
import { SnakeGame } from "@/components/sections/SnakeGame";

export type SectionType = "skills" | "about" | "career" | "education" | "cognis" | "play";

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
  const dragDistanceRef = useRef(0);

  // Responsive screen width listener
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  // Global Pointer Move Listener: Tracks 3D rotation & drag distance
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || introStage !== "active") return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      dragDistanceRef.current += Math.hypot(e.movementX, e.movementY);

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

  // High-Precision Pointer Down & Up with Instant Click Detection Threshold
  const handlePointerDown = (e: React.PointerEvent) => {
    if (introStage !== "active") return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}

    isDraggingRef.current = true;
    setIsDragging(true);
    dragDistanceRef.current = 0;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    rotStartRef.current = { ...rot };
  };

  const handlePointerUp = (e: React.PointerEvent, faceSection?: SectionType) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    // If mouse movement distance < 6px, treat as CLICK!
    if (dragDistanceRef.current < 6 && faceSection) {
      triggerSectionTransition(faceSection);
    }

    isDraggingRef.current = false;
    setIsDragging(false);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (introStage !== "active") return;

      const key = e.key.toLowerCase();
      if (key === "escape" || key === "backspace") setSelectedSection(null);
      if (key === "s") triggerSectionTransition("skills");
      if (key === "a") triggerSectionTransition("about");
      if (key === "c") triggerSectionTransition("career");
      if (key === "e") triggerSectionTransition("education");
      if (key === "p" || key === "g") triggerSectionTransition("play");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [introStage, triggerSectionTransition]);

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
      case "cognis":
        return <CognisContent />;
      case "play":
        return <SnakeGame />;
    }
  };

  return (
    <div className="w-screen h-screen bg-[#010206] text-white font-mono flex flex-col justify-between overflow-hidden relative select-none">
      {/* Living Solar System Background */}
      <PS2MeteorBackground phase={introStage === "text" ? "intro" : "active"} />

      {/* Clean Minimalist Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: introStage === "active" ? 1 : 0, y: introStage === "active" ? 0 : -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between z-20"
      >
        <div className="flex items-center gap-2 text-slate-200 hover:text-cyan-400 transition-colors cursor-pointer group">
          <span className="font-orbitron text-xs sm:text-sm font-black tracking-widest uppercase opacity-90 group-hover:opacity-100 transition-opacity">
            FELIPE DE PAULA
          </span>
        </div>
      </motion.header>

      {/* Main Stage: 3D Cube & Pure Floating Cards Container */}
      <main className="flex-1 flex items-center justify-center relative perspective-1200 z-10 w-full h-full pb-6 sm:pb-8">
        {/* Clean "Feito por Felipe" Intro Text */}
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

        {/* 3D Cube Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, x: 0, y: -28 }}
          animate={
            introStage !== "text"
              ? {
                  scale: selectedSection ? (isMobile ? 0.45 : 0.8) : isMobile ? 0.85 : 1,
                  x: selectedSection ? (isMobile ? 0 : -320) : 0,
                  y: selectedSection ? (isMobile ? -230 : -28) : -28,
                  opacity: selectedSection && isMobile ? 0.2 : 1,
                }
              : { scale: 0.7, x: 0, y: -28, opacity: 0 }
          }
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className={`relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] pointer-events-auto z-20 select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {/* Continuous Angle Rotation */}
          <div
            className={`w-full h-full relative preserve-3d pointer-events-auto ${
              isDragging ? "transition-none" : "transition-transform duration-300"
            }`}
            style={{ transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}
          >
            {/* FACE 1 (Front, 0°): SKILLS */}
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, "skills")}
              onMouseEnter={() => setHoveredFace("skills")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-full h-full border-2 border-cyan-400 bg-[#061426]/90 cube-glass-face flex flex-col items-center justify-center p-3 sm:p-4 text-center rounded-none transition-all duration-200 cursor-pointer select-none ${
                hoveredFace === "skills" || selectedSection === "skills"
                  ? "glow-cyan border-white scale-105"
                  : ""
              }`}
              style={{ transform: `rotateY(0deg) translateZ(${isMobile ? "90px" : "110px"})` }}
            >
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 font-mono font-extrabold text-[10px] sm:text-xs">
                [S]
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-cyan-400/20 border border-cyan-400/60 flex items-center justify-center text-cyan-300 mb-1.5 sm:mb-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-sm sm:text-base tracking-wider uppercase">SKILLS</h2>
              <span className="text-[9px] sm:text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-bold mt-0.5">
                STACK & CONCURRENCY
              </span>
            </div>

            {/* FACE 2 (Right, 90°): PROFILE */}
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, "about")}
              onMouseEnter={() => setHoveredFace("about")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-full h-full border-2 border-purple-500 bg-[#120726]/90 cube-glass-face flex flex-col items-center justify-center p-3 sm:p-4 text-center rounded-none transition-all duration-200 cursor-pointer select-none ${
                hoveredFace === "about" || selectedSection === "about"
                  ? "glow-purple border-white scale-105"
                  : ""
              }`}
              style={{ transform: `rotateY(90deg) translateZ(${isMobile ? "90px" : "110px"})` }}
            >
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/60 font-mono font-extrabold text-[10px] sm:text-xs">
                [A]
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-purple-500/20 border border-purple-500/60 flex items-center justify-center text-purple-400 mb-1.5 sm:mb-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-sm sm:text-base tracking-wider uppercase">PROFILE</h2>
              <span className="text-[9px] sm:text-[10px] text-purple-400 font-mono tracking-widest uppercase font-bold mt-0.5">
                ENGINEERING IDENTITY
              </span>
            </div>

            {/* FACE 3 (Back, 180°): CAREER */}
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, "career")}
              onMouseEnter={() => setHoveredFace("career")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-full h-full border-2 border-orange-500 bg-[#1e0a05]/90 cube-glass-face flex flex-col items-center justify-center p-3 sm:p-4 text-center rounded-none transition-all duration-200 cursor-pointer select-none ${
                hoveredFace === "career" || selectedSection === "career"
                  ? "glow-orange border-white scale-105"
                  : ""
              }`}
              style={{ transform: `rotateY(180deg) translateZ(${isMobile ? "90px" : "110px"})` }}
            >
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-400/60 font-mono font-extrabold text-[10px] sm:text-xs">
                [C]
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-orange-500/20 border border-orange-500/60 flex items-center justify-center text-orange-400 mb-1.5 sm:mb-2 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-sm sm:text-base tracking-wider uppercase">CAREER</h2>
              <span className="text-[9px] sm:text-[10px] text-orange-400 font-mono tracking-widest uppercase font-bold mt-0.5">
                SYSTEM MILESTONES
              </span>
            </div>

            {/* FACE 4 (Left, 270°): ACHIEVEMENTS */}
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, "education")}
              onMouseEnter={() => setHoveredFace("education")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-full h-full border-2 border-yellow-400 bg-[#1c1706]/90 cube-glass-face flex flex-col items-center justify-center p-3 sm:p-4 text-center rounded-none transition-all duration-200 cursor-pointer select-none ${
                hoveredFace === "education" || selectedSection === "education"
                  ? "glow-yellow border-white scale-105"
                  : ""
              }`}
              style={{ transform: `rotateY(-90deg) translateZ(${isMobile ? "90px" : "110px"})` }}
            >
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-400/60 font-mono font-extrabold text-[10px] sm:text-xs">
                [E]
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-yellow-400/20 border border-yellow-400/60 flex items-center justify-center text-yellow-300 mb-1.5 sm:mb-2 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-sm sm:text-base tracking-wider uppercase">ACHIEVEMENTS</h2>
              <span className="text-[9px] sm:text-[10px] text-yellow-400 font-mono tracking-widest uppercase font-bold mt-0.5">
                DEGREES & CERTS
              </span>
            </div>

            {/* FACE 5 (Top, 90° X): LABS */}
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, "cognis")}
              className="absolute w-full h-full border-2 border-indigo-400 bg-[#0d0f2e]/90 cube-glass-face flex flex-col items-center justify-center p-3 sm:p-4 text-center rounded-none select-none cursor-pointer"
              style={{ transform: `rotateX(90deg) translateZ(${isMobile ? "90px" : "110px"})` }}
            >
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/60 font-mono font-extrabold text-[10px] sm:text-xs">
                [SYS]
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-indigo-400/20 border border-indigo-400/60 flex items-center justify-center text-indigo-300 mb-1.5 sm:mb-2">
                <Server className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-sm sm:text-base tracking-wider uppercase">LABS</h2>
              <span className="text-[9px] sm:text-[10px] text-indigo-400 font-mono tracking-widest uppercase font-bold mt-0.5">
                BENCHMARKS & SANDBOX
              </span>
            </div>

            {/* FACE 6 (Bottom, -90° X): PLAY (RETRO SNAKE GAME) */}
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, "play")}
              className="absolute w-full h-full border-2 border-emerald-400 bg-[#06180c]/90 cube-glass-face flex flex-col items-center justify-center p-3 sm:p-4 text-center rounded-none select-none cursor-pointer"
              style={{ transform: `rotateX(-90deg) translateZ(${isMobile ? "90px" : "110px"})` }}
            >
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 font-mono font-extrabold text-[10px] sm:text-xs">
                [P]
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-emerald-400/20 border border-emerald-400/60 flex items-center justify-center text-emerald-300 mb-1.5 sm:mb-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-sm sm:text-base tracking-wider uppercase">PLAY GAME</h2>
              <span className="text-[9px] sm:text-[10px] text-emerald-400 font-mono tracking-widest uppercase font-bold mt-0.5">
                RETRO ARCADE SNAKE
              </span>
            </div>
          </div>
        </motion.div>

        {/* PURE FLOATING CARDS & TIMELINE CONTAINER */}
        <AnimatePresence>
          {selectedSection && (
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
              className={`absolute z-30 overflow-y-auto scrollbar-thin ${
                isMobile
                  ? "inset-x-3 top-8 bottom-4 px-1 py-2"
                  : "right-4 sm:right-12 top-10 bottom-8 w-[58%] max-w-[740px] pr-3"
              }`}
            >
              {/* Clean Single Voltar Button (Top Right) */}
              <div className="sticky top-0 z-40 flex justify-end pb-3 pointer-events-auto">
                <button
                  onClick={() => setSelectedSection(null)}
                  className="px-4 py-2 rounded-xl bg-[#091122]/90 hover:bg-[#121c35] text-slate-200 border border-slate-700/80 backdrop-blur-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-2xl hover:scale-105 active:scale-95"
                >
                  Voltar
                </button>
              </div>

              {/* Pure Floating Cards Content */}
              <div className="space-y-6">
                {renderSectionContent(selectedSection)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
