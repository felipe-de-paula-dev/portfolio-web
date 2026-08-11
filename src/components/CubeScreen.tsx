"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, User, Briefcase, GraduationCap, Server, Gamepad2, X } from "lucide-react";
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

  // Keyboard shortcut listener: S -> Skills, A -> About, C -> Career, E -> Education, P -> Play Snake, ESC -> Close
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

  const getSectionTitle = (sec: SectionType) => {
    switch (sec) {
      case "skills":
        return "SKILLS";
      case "about":
        return "PROFILE";
      case "career":
        return "CAREER";
      case "education":
        return "ACHIEVEMENTS";
      case "cognis":
        return "LABS";
      case "play":
        return "ARCADE SNAKE";
    }
  };

  const getSectionButtonBadge = (sec: SectionType) => {
    switch (sec) {
      case "skills":
        return "[S]";
      case "about":
        return "[A]";
      case "career":
        return "[C]";
      case "education":
        return "[E]";
      case "cognis":
        return "[SYS]";
      case "play":
        return "[P]";
    }
  };

  const getSectionPanelStyle = (sec: SectionType) => {
    switch (sec) {
      case "skills":
        return "border-cyan-400/60 shadow-[0_0_50px_rgba(6,182,212,0.3)] bg-[#041424]/94";
      case "about":
        return "border-purple-400/60 shadow-[0_0_50px_rgba(168,85,247,0.3)] bg-[#120726]/94";
      case "career":
        return "border-orange-400/60 shadow-[0_0_50px_rgba(249,115,22,0.3)] bg-[#1e0a05]/94";
      case "education":
        return "border-yellow-400/60 shadow-[0_0_50px_rgba(234,179,8,0.3)] bg-[#1c1706]/94";
      case "cognis":
        return "border-indigo-400/60 shadow-[0_0_50px_rgba(129,140,248,0.3)] bg-[#0d0f2e]/94";
      case "play":
        return "border-emerald-400/60 shadow-[0_0_50px_rgba(16,185,129,0.3)] bg-[#041a12]/94";
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
      case "cognis":
        return <CognisContent />;
      case "play":
        return <SnakeGame />;
    }
  };

  return (
    <div className="w-screen h-screen bg-[#010206] text-white font-mono flex flex-col justify-between overflow-hidden relative select-none">
      {/* Living Solar System Background */}
      <PS2MeteorBackground phase={introStage === "active" ? "active" : "intro"} />

      {/* Clean Minimalist Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: introStage === "active" ? 1 : 0, y: introStage === "active" ? 0 : -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full px-8 py-6 flex items-center justify-between z-20"
      >
        <div className="flex items-center gap-2 text-slate-200 hover:text-cyan-400 transition-colors cursor-pointer group">
          <span className="font-orbitron text-xs sm:text-sm font-black tracking-widest uppercase opacity-90 group-hover:opacity-100 transition-opacity">
            FELIPE DE PAULA
          </span>
        </div>
      </motion.header>

      {/* Main Stage: 3D Cube & Right Side Cards Panel */}
      <main className="flex-1 flex items-center justify-center relative perspective-1200 z-10 w-full h-full pb-8">
        {/* "Feito por Felipe" Text + Thin Mini Progress Bar */}
        <AnimatePresence>
          {introStage === "text" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 0.85, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute z-20 text-center pointer-events-none flex flex-col items-center gap-3"
            >
              <h1 className="font-orbitron font-medium text-xs sm:text-sm tracking-[0.3em] uppercase text-slate-300">
                Feito por Felipe
              </h1>

              {/* Sleek Thin Mini-Progress Bar */}
              <div className="w-40 h-[2px] bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.6, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400 shadow-[0_0_8px_#06b6d4]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Cube Container */}
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
          className={`relative w-[220px] h-[220px] pointer-events-auto z-20 select-none ${
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
              className={`absolute w-[220px] h-[220px] border-2 border-cyan-400 bg-[#061426]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none transition-all duration-200 cursor-pointer select-none ${
                hoveredFace === "skills" || selectedSection === "skills"
                  ? "glow-cyan border-white scale-105"
                  : ""
              }`}
              style={{ transform: "rotateY(0deg) translateZ(110px)" }}
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 font-mono font-extrabold text-xs shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                [S]
              </div>
              <div className="w-14 h-14 rounded-lg bg-cyan-400/20 border border-cyan-400/60 flex items-center justify-center text-cyan-300 mb-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Zap className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-base tracking-wider uppercase">SKILLS</h2>
              <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-bold mt-0.5">
                STACK & CONCURRENCY
              </span>
            </div>

            {/* FACE 2 (Right, 90°): PROFILE */}
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, "about")}
              onMouseEnter={() => setHoveredFace("about")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-[220px] h-[220px] border-2 border-purple-500 bg-[#120726]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none transition-all duration-200 cursor-pointer select-none ${
                hoveredFace === "about" || selectedSection === "about"
                  ? "glow-purple border-white scale-105"
                  : ""
              }`}
              style={{ transform: "rotateY(90deg) translateZ(110px)" }}
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/60 font-mono font-extrabold text-xs shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                [A]
              </div>
              <div className="w-14 h-14 rounded-lg bg-purple-500/20 border border-purple-500/60 flex items-center justify-center text-purple-400 mb-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <User className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-base tracking-wider uppercase">PROFILE</h2>
              <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase font-bold mt-0.5">
                ENGINEERING IDENTITY
              </span>
            </div>

            {/* FACE 3 (Back, 180°): CAREER */}
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, "career")}
              onMouseEnter={() => setHoveredFace("career")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-[220px] h-[220px] border-2 border-orange-500 bg-[#1e0a05]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none transition-all duration-200 cursor-pointer select-none ${
                hoveredFace === "career" || selectedSection === "career"
                  ? "glow-orange border-white scale-105"
                  : ""
              }`}
              style={{ transform: "rotateY(180deg) translateZ(110px)" }}
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-400/60 font-mono font-extrabold text-xs shadow-[0_0_10px_rgba(249,115,22,0.4)]">
                [C]
              </div>
              <div className="w-14 h-14 rounded-lg bg-orange-500/20 border border-orange-500/60 flex items-center justify-center text-orange-400 mb-2 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                <Briefcase className="w-8 h-8 text-orange-400" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-base tracking-wider uppercase">CAREER</h2>
              <span className="text-[10px] text-orange-400 font-mono tracking-widest uppercase font-bold mt-0.5">
                SYSTEM MILESTONES
              </span>
            </div>

            {/* FACE 4 (Left, 270°): ACHIEVEMENTS */}
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, "education")}
              onMouseEnter={() => setHoveredFace("education")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-[220px] h-[220px] border-2 border-yellow-400 bg-[#1c1706]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none transition-all duration-200 cursor-pointer select-none ${
                hoveredFace === "education" || selectedSection === "education"
                  ? "glow-yellow border-white scale-105"
                  : ""
              }`}
              style={{ transform: "rotateY(-90deg) translateZ(110px)" }}
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-400/60 font-mono font-extrabold text-xs shadow-[0_0_10px_rgba(234,179,8,0.4)]">
                [E]
              </div>
              <div className="w-14 h-14 rounded-lg bg-yellow-400/20 border border-yellow-400/60 flex items-center justify-center text-yellow-300 mb-2 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                <GraduationCap className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-base tracking-wider uppercase">ACHIEVEMENTS</h2>
              <span className="text-[10px] text-yellow-400 font-mono tracking-widest uppercase font-bold mt-0.5">
                DEGREES & CERTS
              </span>
            </div>

            {/* FACE 5 (Top, 90° X): LABS */}
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, "cognis")}
              className="absolute w-[220px] h-[220px] border-2 border-indigo-400 bg-[#0d0f2e]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none select-none cursor-pointer"
              style={{ transform: "rotateX(90deg) translateZ(110px)" }}
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/60 font-mono font-extrabold text-xs">
                [SYS]
              </div>
              <div className="w-14 h-14 rounded-lg bg-indigo-400/20 border border-indigo-400/60 flex items-center justify-center text-indigo-300 mb-2">
                <Server className="w-8 h-8 text-indigo-400" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-base tracking-wider uppercase">LABS</h2>
              <span className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase font-bold mt-0.5">
                BENCHMARKS & SANDBOX
              </span>
            </div>

            {/* FACE 6 (Bottom, -90° X): PLAY (RETRO SNAKE GAME) */}
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, "play")}
              className="absolute w-[220px] h-[220px] border-2 border-emerald-400 bg-[#06180c]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none select-none cursor-pointer"
              style={{ transform: "rotateX(-90deg) translateZ(110px)" }}
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 font-mono font-extrabold text-xs">
                [P]
              </div>
              <div className="w-14 h-14 rounded-lg bg-emerald-400/20 border border-emerald-400/60 flex items-center justify-center text-emerald-300 mb-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Gamepad2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-base tracking-wider uppercase">PLAY GAME</h2>
              <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase font-bold mt-0.5">
                RETRO ARCADE SNAKE
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
              className={`absolute right-4 sm:right-12 top-14 bottom-12 w-[92%] sm:w-[58%] max-w-[680px] border-2 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 z-30 flex flex-col justify-between overflow-hidden ${getSectionPanelStyle(
                selectedSection
              )}`}
            >
              {/* Header inside Panel */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/30 font-mono font-black text-xs">
                    {getSectionButtonBadge(selectedSection)}
                  </span>
                  <h2 className="text-lg sm:text-xl font-orbitron font-extrabold text-white tracking-wider uppercase">
                    {getSectionTitle(selectedSection)}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedSection(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs font-mono font-bold transition-all cursor-pointer shadow-lg"
                >
                  <X className="w-4 h-4" />
                  <span>[ESC / CLOSE]</span>
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
