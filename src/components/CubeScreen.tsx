"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, User, Briefcase, GraduationCap, Server, Gamepad2, RotateCcw } from "lucide-react";
import { PS2MeteorBackground } from "@/components/PS2MeteorBackground";
import { MobileJoystick } from "@/components/MobileJoystick";
import { SkillsContent } from "@/components/sections/SkillsContent";
import { AboutContent } from "@/components/sections/AboutContent";
import { CareerContent } from "@/components/sections/CareerContent";
import { EducationContent } from "@/components/sections/EducationContent";
import { CognisContent } from "@/components/sections/CognisContent";
import { ArcadeGames } from "@/components/sections/ArcadeGames";

export type SectionType = "skills" | "about" | "career" | "education" | "cognis" | "play";

interface CubeScreenProps {
  onRestartBoot?: () => void;
}

export const CubeScreen: React.FC<CubeScreenProps> = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType | null>(null);
  const [hoveredFace, setHoveredFace] = useState<string | null>(null);

  // Intro Stage: "text" -> "emerge" -> "active"
  const [introStage, setIntroStage] = useState<"text" | "emerge" | "active">("text");

  // Continuous 60-120 FPS Direct DOM 3D Rotation Ref
  const rotRef = useRef({ x: -15, y: 25 });
  const cubeRef = useRef<HTMLDivElement>(null);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const rotStartRef = useRef({ x: -15, y: 25 });
  const dragDistanceRef = useRef(0);

  // Physics Momentum & Velocity Refs
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPointerPosRef = useRef({ x: 0, y: 0, time: 0 });
  const joystickVectorRef = useRef({ x: 0, y: 0 });

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

  // Direct DOM 120 FPS Rotation Loop (Supports Inertia Physics + Analog Joystick + Ambient Drift)
  useEffect(() => {
    let animId: number;
    const loop = () => {
      const jx = joystickVectorRef.current.x;
      const jy = joystickVectorRef.current.y;

      if (Math.abs(jx) > 0.05 || Math.abs(jy) > 0.05) {
        // Continuous Smooth 360° Analog Joystick Rotation
        rotRef.current = {
          x: rotRef.current.x - jy * 3.8,
          y: rotRef.current.y + jx * 3.8,
        };
        velocityRef.current = { x: -jy * 1.5, y: jx * 1.5 };
        if (cubeRef.current) {
          cubeRef.current.style.transform = `rotateX(${rotRef.current.x}deg) rotateY(${rotRef.current.y}deg) translateZ(0)`;
        }
      } else if (!isDraggingRef.current) {
        const speed = Math.hypot(velocityRef.current.x, velocityRef.current.y);

        if (speed > 0.06) {
          // Inertia Coasting Phase (Physics Momentum Damping)
          rotRef.current = {
            x: rotRef.current.x + velocityRef.current.x,
            y: rotRef.current.y + velocityRef.current.y,
          };
          // Apply smooth zero-gravity friction decay (0.95 = satisfying long spin)
          velocityRef.current.x *= 0.955;
          velocityRef.current.y *= 0.955;
        } else {
          // Continuous Ambient Drift
          rotRef.current = {
            x: (rotRef.current.x + (isMobile ? 0.08 : 0.12)) % 360,
            y: (rotRef.current.y + (isMobile ? 0.18 : 0.25)) % 360,
          };
        }

        if (cubeRef.current) {
          cubeRef.current.style.transform = `rotateX(${rotRef.current.x}deg) rotateY(${rotRef.current.y}deg) translateZ(0)`;
        }
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isMobile]);

  const resetCubeRotation = useCallback(() => {
    rotRef.current = { x: -15, y: 25 };
    velocityRef.current = { x: 0, y: 0 };
    if (cubeRef.current) {
      cubeRef.current.style.transform = `rotateX(-15deg) rotateY(25deg) translateZ(0)`;
    }
  }, []);

  const triggerSectionTransition = useCallback(
    (section: SectionType) => {
      if (introStage !== "active") return;
      setSelectedSection((prev) => (prev === section ? null : section));
    },
    [introStage]
  );

  // Direct High-Performance DOM Pointer Drag Engine with Inertia Flick Calculation
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || introStage !== "active") return;

      const now = performance.now();
      const deltaX = e.clientX - lastPointerPosRef.current.x;
      const deltaY = e.clientY - lastPointerPosRef.current.y;

      dragDistanceRef.current += Math.hypot(deltaX, deltaY);

      // Instantaneous Velocity (Degrees per frame)
      const instantVx = -deltaY * (isMobile ? 0.45 : 0.5);
      const instantVy = deltaX * (isMobile ? 0.45 : 0.5);

      // Exponential Moving Average filter for smooth inertia launch
      velocityRef.current = {
        x: velocityRef.current.x * 0.35 + instantVx * 0.65,
        y: velocityRef.current.y * 0.35 + instantVy * 0.65,
      };

      rotRef.current = {
        x: rotRef.current.x + instantVx,
        y: rotRef.current.y + instantVy,
      };

      lastPointerPosRef.current = { x: e.clientX, y: e.clientY, time: now };

      if (cubeRef.current) {
        cubeRef.current.style.transform = `rotateX(${rotRef.current.x}deg) rotateY(${rotRef.current.y}deg) translateZ(0)`;
      }
    };

    const handleGlobalPointerUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handleGlobalPointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [introStage, isMobile]);

  // High-Precision Pointer Down & Up
  const handlePointerDown = (e: React.PointerEvent) => {
    if (introStage !== "active") return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}

    isDraggingRef.current = true;
    dragDistanceRef.current = 0;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    rotStartRef.current = { ...rotRef.current };
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    velocityRef.current = { x: 0, y: 0 };
  };

  const handlePointerUp = (e: React.PointerEvent, faceSection?: SectionType) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    // If mouse movement distance < 6px, treat as CLICK!
    if (dragDistanceRef.current < 6 && faceSection) {
      velocityRef.current = { x: 0, y: 0 };
      triggerSectionTransition(faceSection);
    }

    isDraggingRef.current = false;
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
        return <ArcadeGames />;
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
          className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] pointer-events-auto z-20 select-none will-change-transform cursor-grab active:cursor-grabbing"
        >
          {/* Direct High-Performance 120 FPS DOM Transform Element */}
          <div
            ref={cubeRef}
            className="w-full h-full relative preserve-3d pointer-events-auto will-change-transform"
            style={{
              transform: `rotateX(${rotRef.current.x}deg) rotateY(${rotRef.current.y}deg) translateZ(0)`,
            }}
          >
            {/* FACE 1 (Front, 0°): SKILLS - Electric Cyan */}
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, "skills")}
              onMouseEnter={() => setHoveredFace("skills")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-full h-full border-2 border-cyan-400/90 bg-gradient-to-br from-[#061e2e]/95 via-[#08283e]/90 to-[#04101d]/95 cube-glass-face flex flex-col items-center justify-center p-3 sm:p-4 text-center rounded-none transition-all duration-200 cursor-pointer select-none shadow-[inset_0_0_25px_rgba(6,182,212,0.25)] ${
                hoveredFace === "skills" || selectedSection === "skills"
                  ? "glow-cyan border-white scale-105"
                  : ""
              }`}
              style={{ transform: `rotateY(0deg) translateZ(${isMobile ? "90px" : "110px"})` }}
            >
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 rounded bg-cyan-500/25 text-cyan-300 border border-cyan-400/70 font-mono font-extrabold text-[10px] sm:text-xs">
                [S]
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-cyan-400/20 border border-cyan-400/70 flex items-center justify-center text-cyan-300 mb-1.5 sm:mb-2 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-300" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-sm sm:text-base tracking-wider uppercase">SKILLS</h2>
              <span className="text-[9px] sm:text-[10px] text-cyan-300 font-mono tracking-widest uppercase font-bold mt-0.5">
                STACK & CONCURRENCY
              </span>
            </div>

            {/* FACE 2 (Right, 90°): PROFILE - Electric Rose & Magenta */}
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, "about")}
              onMouseEnter={() => setHoveredFace("about")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-full h-full border-2 border-rose-400/90 bg-gradient-to-br from-[#2a0618]/95 via-[#380b22]/90 to-[#18030e]/95 cube-glass-face flex flex-col items-center justify-center p-3 sm:p-4 text-center rounded-none transition-all duration-200 cursor-pointer select-none shadow-[inset_0_0_25px_rgba(244,63,94,0.25)] ${
                hoveredFace === "about" || selectedSection === "about"
                  ? "glow-purple border-white scale-105"
                  : ""
              }`}
              style={{ transform: `rotateY(90deg) translateZ(${isMobile ? "90px" : "110px"})` }}
            >
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 rounded bg-rose-500/25 text-rose-300 border border-rose-400/70 font-mono font-extrabold text-[10px] sm:text-xs">
                [A]
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-rose-500/20 border border-rose-400/70 flex items-center justify-center text-rose-300 mb-1.5 sm:mb-2 shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-rose-300" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-sm sm:text-base tracking-wider uppercase">PROFILE</h2>
              <span className="text-[9px] sm:text-[10px] text-rose-300 font-mono tracking-widest uppercase font-bold mt-0.5">
                ENGINEERING IDENTITY
              </span>
            </div>

            {/* FACE 3 (Back, 180°): CAREER - Sunset Amber & Flame */}
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, "career")}
              onMouseEnter={() => setHoveredFace("career")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-full h-full border-2 border-amber-400/90 bg-gradient-to-br from-[#2a1a04]/95 via-[#3d2606]/90 to-[#180e02]/95 cube-glass-face flex flex-col items-center justify-center p-3 sm:p-4 text-center rounded-none transition-all duration-200 cursor-pointer select-none shadow-[inset_0_0_25px_rgba(245,158,11,0.25)] ${
                hoveredFace === "career" || selectedSection === "career"
                  ? "glow-orange border-white scale-105"
                  : ""
              }`}
              style={{ transform: `rotateY(180deg) translateZ(${isMobile ? "90px" : "110px"})` }}
            >
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 rounded bg-amber-500/25 text-amber-300 border border-amber-400/70 font-mono font-extrabold text-[10px] sm:text-xs">
                [C]
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-amber-500/20 border border-amber-400/70 flex items-center justify-center text-amber-300 mb-1.5 sm:mb-2 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-sm sm:text-base tracking-wider uppercase">CAREER</h2>
              <span className="text-[9px] sm:text-[10px] text-amber-300 font-mono tracking-widest uppercase font-bold mt-0.5">
                SYSTEM MILESTONES
              </span>
            </div>

            {/* FACE 4 (Left, 270°): ACHIEVEMENTS - Royal Violet & Amethyst */}
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, "education")}
              onMouseEnter={() => setHoveredFace("education")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-full h-full border-2 border-violet-400/90 bg-gradient-to-br from-[#1c072b]/95 via-[#290c3d]/90 to-[#10031a]/95 cube-glass-face flex flex-col items-center justify-center p-3 sm:p-4 text-center rounded-none transition-all duration-200 cursor-pointer select-none shadow-[inset_0_0_25px_rgba(168,85,247,0.25)] ${
                hoveredFace === "education" || selectedSection === "education"
                  ? "glow-yellow border-white scale-105"
                  : ""
              }`}
              style={{ transform: `rotateY(-90deg) translateZ(${isMobile ? "90px" : "110px"})` }}
            >
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 rounded bg-violet-500/25 text-violet-300 border border-violet-400/70 font-mono font-extrabold text-[10px] sm:text-xs">
                [E]
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-violet-500/20 border border-violet-400/70 flex items-center justify-center text-violet-300 mb-1.5 sm:mb-2 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-violet-300" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-sm sm:text-base tracking-wider uppercase">ACHIEVEMENTS</h2>
              <span className="text-[9px] sm:text-[10px] text-violet-300 font-mono tracking-widest uppercase font-bold mt-0.5">
                DEGREES & CERTS
              </span>
            </div>

            {/* FACE 5 (Top, 90° X): LABS - Sapphire Blue */}
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, "cognis")}
              onMouseEnter={() => setHoveredFace("cognis")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-full h-full border-2 border-blue-400/90 bg-gradient-to-br from-[#051433]/95 via-[#0a1e47]/90 to-[#030c21]/95 cube-glass-face flex flex-col items-center justify-center p-3 sm:p-4 text-center rounded-none transition-all duration-200 cursor-pointer select-none shadow-[inset_0_0_25px_rgba(59,130,246,0.25)] ${
                hoveredFace === "cognis" || selectedSection === "cognis"
                  ? "border-white scale-105"
                  : ""
              }`}
              style={{ transform: `rotateX(90deg) translateZ(${isMobile ? "90px" : "110px"})` }}
            >
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 rounded bg-blue-500/25 text-blue-300 border border-blue-400/70 font-mono font-extrabold text-[10px] sm:text-xs">
                [SYS]
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-blue-400/20 border border-blue-400/70 flex items-center justify-center text-blue-300 mb-1.5 sm:mb-2 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                <Server className="w-6 h-6 sm:w-8 sm:h-8 text-blue-300" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-sm sm:text-base tracking-wider uppercase">LABS</h2>
              <span className="text-[9px] sm:text-[10px] text-blue-300 font-mono tracking-widest uppercase font-bold mt-0.5">
                BENCHMARKS & SANDBOX
              </span>
            </div>

            {/* FACE 6 (Bottom, -90° X): PLAY (RETRO ARCADE GAMES) - Cyber Emerald */}
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={(e) => handlePointerUp(e, "play")}
              onMouseEnter={() => setHoveredFace("play")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-full h-full border-2 border-emerald-400/90 bg-gradient-to-br from-[#042113]/95 via-[#08301c]/90 to-[#02130a]/95 cube-glass-face flex flex-col items-center justify-center p-3 sm:p-4 text-center rounded-none transition-all duration-200 cursor-pointer select-none shadow-[inset_0_0_25px_rgba(168,85,247,0.25)] ${
                hoveredFace === "play" || selectedSection === "play"
                  ? "glow-cyan border-white scale-105"
                  : ""
              }`}
              style={{ transform: `rotateX(-90deg) translateZ(${isMobile ? "90px" : "110px"})` }}
            >
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-400/70 font-mono font-extrabold text-[10px] sm:text-xs">
                [P]
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-emerald-400/20 border border-emerald-400/70 flex items-center justify-center text-emerald-300 mb-1.5 sm:mb-2 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-300" />
              </div>
              <h2 className="text-white font-orbitron font-extrabold text-sm sm:text-base tracking-wider uppercase">PLAY GAMES</h2>
              <span className="text-[9px] sm:text-[10px] text-emerald-300 font-mono tracking-widest uppercase font-bold mt-0.5">
                ARCADE CENTER
              </span>
            </div>
          </div>
        </motion.div>

        {/* 360° Analog Touch/Pointer Thumbstick Joystick Controller (Mobile Only) */}
        {isMobile && introStage === "active" && !selectedSection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 sm:bottom-6 z-30 flex flex-col items-center gap-2 pointer-events-auto touch-none"
          >
            <div className="flex items-center gap-3">
              <MobileJoystick
                onMove={(vx, vy) => {
                  joystickVectorRef.current = { x: vx, y: vy };
                }}
                onEnd={() => {
                  joystickVectorRef.current = { x: 0, y: 0 };
                }}
              />

              <button
                onPointerDown={(e) => {
                  e.preventDefault();
                  resetCubeRotation();
                }}
                onClick={resetCubeRotation}
                className="w-10 h-10 rounded-full bg-[#08152e]/90 border border-purple-400/60 text-purple-300 active:scale-90 flex items-center justify-center shadow-lg backdrop-blur-md cursor-pointer hover:border-purple-300 hover:bg-[#0c1f44] transition-all"
                title="Reset Angle"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* PURE FLOATING CARDS & TIMELINE CONTAINER */}
        <AnimatePresence>
          {selectedSection && (
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
              className={`absolute z-30 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-cyan-500/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-cyan-500/50 ${
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
