"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, User, Briefcase, GraduationCap, Server, Cpu } from "lucide-react";
import { SectionView, SectionType } from "@/components/SectionView";
import { PS2MeteorBackground } from "@/components/PS2MeteorBackground";

interface CubeScreenProps {
  onRestartBoot?: () => void;
}

export const CubeScreen: React.FC<CubeScreenProps> = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredFace, setHoveredFace] = useState<string | null>(null);

  // Intro Stage: "text" -> "emerge" -> "active"
  const [introStage, setIntroStage] = useState<"text" | "emerge" | "active">("text");

  // Continuous 60 FPS 3D Rotation State (No Keyframe Restarts)
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

  const handleRestart = () => {
    setSelectedSection(null);
    setIntroStage("text");
    setTimeout(() => setIntroStage("emerge"), 1800);
    setTimeout(() => setIntroStage("active"), 2800);
  };

  const triggerSectionTransition = useCallback(
    (section: SectionType) => {
      if (isTransitioning || introStage !== "active") return;
      setIsTransitioning(true);

      setTimeout(() => {
        setSelectedSection(section);
        setIsTransitioning(false);
      }, 220);
    },
    [isTransitioning, introStage]
  );

  // Pointer Move Listener: ONLY rotates when holding click
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

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [introStage]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (introStage !== "active") return;
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    rotStartRef.current = { ...rot };
  };

  // Keyboard shortcut listener: ONLY S -> Skills, A -> About, C -> Career, E -> Education
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedSection || isTransitioning || introStage !== "active") return;

      const key = e.key.toLowerCase();
      if (key === "s") triggerSectionTransition("skills");
      if (key === "a") triggerSectionTransition("about");
      if (key === "c") triggerSectionTransition("career");
      if (key === "e") triggerSectionTransition("education");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSection, isTransitioning, introStage, triggerSectionTransition]);

  if (selectedSection) {
    return (
      <SectionView
        section={selectedSection}
        onBack={() => setSelectedSection(null)}
        onRestartBoot={handleRestart}
      />
    );
  }

  return (
    <div className="w-screen h-screen bg-[#010206] text-white font-mono flex flex-col justify-between overflow-hidden relative select-none">
      {/* High-Contrast Space Galaxies, Stars & PS2 Towers Canvas Background */}
      <PS2MeteorBackground phase={introStage === "active" ? "active" : "intro"} />

      {/* Top Left Navbar Logo */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: introStage === "active" ? 1 : 0, y: introStage === "active" ? 0 : -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full px-8 py-6 flex items-center justify-between z-20"
      >
        <div className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer group">
          <span className="font-mono text-xs text-cyan-400/80">©</span>
          <span className="font-orbitron text-xs sm:text-sm font-bold tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">
            Felipe de Paula
          </span>
        </div>
      </motion.header>

      {/* Center Stage: Text & 3D Cube (Continuous Angle Engine) */}
      <main className="flex-1 flex items-center justify-center relative perspective-1200 z-10">
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

        {/* 3D Cube Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={
            isTransitioning
              ? { scale: 2.2, opacity: 0 }
              : introStage !== "text"
              ? { scale: 1, opacity: 1 }
              : { scale: 0.7, opacity: 0 }
          }
          transition={{ duration: isTransitioning ? 0.22 : 0.8, ease: "easeOut" }}
          onPointerDown={handlePointerDown}
          className={`relative w-[220px] h-[220px] ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        >
          {/* Continuous Angle Rotation (Zero Keyframe Restarts) */}
          <div
            className="w-full h-full relative preserve-3d"
            style={{ transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}
          >
            {/* FACE 1 (Front, 0°): SKILLS - AZUL CIANO */}
            <div
              onClick={() => triggerSectionTransition("skills")}
              onMouseEnter={() => setHoveredFace("skills")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-[220px] h-[220px] border-2 border-cyan-400 bg-[#061426]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none transition-all duration-200 ${
                hoveredFace === "skills" ? "glow-cyan border-white scale-105" : ""
              }`}
              style={{ transform: "rotateY(0deg) translateZ(110px)" }}
            >
              <div className="w-14 h-14 rounded-lg bg-cyan-400/20 border border-cyan-400/60 flex items-center justify-center text-cyan-300 mb-3">
                <Zap className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-white font-mono font-extrabold text-xl tracking-wider">Skills</h2>
              <span className="text-xs text-cyan-400 mt-1 font-mono font-bold">[S]</span>
            </div>

            {/* FACE 2 (Right, 90°): ABOUT ME - VIOLETA */}
            <div
              onClick={() => triggerSectionTransition("about")}
              onMouseEnter={() => setHoveredFace("about")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-[220px] h-[220px] border-2 border-purple-500 bg-[#120726]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none transition-all duration-200 ${
                hoveredFace === "about" ? "glow-purple border-white scale-105" : ""
              }`}
              style={{ transform: "rotateY(90deg) translateZ(110px)" }}
            >
              <div className="w-14 h-14 rounded-lg bg-purple-500/20 border border-purple-500/60 flex items-center justify-center text-purple-400 mb-3">
                <User className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-white font-mono font-extrabold text-xl tracking-wider">About Me</h2>
              <span className="text-xs text-purple-400 mt-1 font-mono font-bold">[A]</span>
            </div>

            {/* FACE 3 (Back, 180°): CAREER - LARANJA */}
            <div
              onClick={() => triggerSectionTransition("career")}
              onMouseEnter={() => setHoveredFace("career")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-[220px] h-[220px] border-2 border-orange-500 bg-[#1e0a05]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none transition-all duration-200 ${
                hoveredFace === "career" ? "glow-orange border-white scale-105" : ""
              }`}
              style={{ transform: "rotateY(180deg) translateZ(110px)" }}
            >
              <div className="w-14 h-14 rounded-lg bg-orange-500/20 border border-orange-500/60 flex items-center justify-center text-orange-400 mb-3">
                <Briefcase className="w-8 h-8 text-orange-400" />
              </div>
              <h2 className="text-white font-mono font-extrabold text-xl tracking-wider">Career</h2>
              <span className="text-xs text-orange-400 mt-1 font-mono font-bold">[C]</span>
            </div>

            {/* FACE 4 (Left, 270°): EDUCATION - AMARELO */}
            <div
              onClick={() => triggerSectionTransition("education")}
              onMouseEnter={() => setHoveredFace("education")}
              onMouseLeave={() => setHoveredFace(null)}
              className={`absolute w-[220px] h-[220px] border-2 border-yellow-400 bg-[#1c1706]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none transition-all duration-200 ${
                hoveredFace === "education" ? "glow-yellow border-white scale-105" : ""
              }`}
              style={{ transform: "rotateY(-90deg) translateZ(110px)" }}
            >
              <div className="w-14 h-14 rounded-lg bg-yellow-400/20 border border-yellow-400/60 flex items-center justify-center text-yellow-300 mb-3">
                <GraduationCap className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-white font-mono font-extrabold text-xl tracking-wider">Education</h2>
              <span className="text-xs text-yellow-400 mt-1 font-mono font-bold">[E]</span>
            </div>

            {/* FACE 5 (Top, 90° X): COGNISGROUP */}
            <div
              className="absolute w-[220px] h-[220px] border-2 border-indigo-400 bg-[#0d0f2e]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none"
              style={{ transform: "rotateX(90deg) translateZ(110px)" }}
            >
              <div className="w-14 h-14 rounded-lg bg-indigo-400/20 border border-indigo-400/60 flex items-center justify-center text-indigo-300 mb-3">
                <Server className="w-8 h-8 text-indigo-400" />
              </div>
              <h2 className="text-white font-mono font-extrabold text-xl tracking-wider">CognisGroup</h2>
              <span className="text-xs text-indigo-400 mt-1 font-mono font-bold">SYSTEM</span>
            </div>

            {/* FACE 6 (Bottom, -90° X): EXIT */}
            <div
              className="absolute w-[220px] h-[220px] border-2 border-emerald-400 bg-[#06180c]/90 cube-glass-face flex flex-col items-center justify-center p-4 text-center rounded-none"
              style={{ transform: "rotateX(-90deg) translateZ(110px)" }}
            >
              <div className="w-14 h-14 rounded-lg bg-emerald-400/20 border border-emerald-400/60 flex items-center justify-center text-emerald-300 mb-3">
                <Cpu className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-white font-mono font-extrabold text-xl tracking-wider">Exit</h2>
              <span className="text-xs text-emerald-400 mt-1 font-mono font-bold">BYE</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer Legend Buttons */}
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: introStage === "active" ? 1 : 0, y: introStage === "active" ? 0 : 40 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full px-6 py-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono z-20 backdrop-blur"
      >
        <button
          onClick={() => triggerSectionTransition("skills")}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#091424] hover:bg-[#0f2038] text-cyan-400 border border-cyan-500/50 hover:border-cyan-400 transition-all font-bold cursor-pointer"
        >
          <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 text-[10px]">
            [S]
          </span>
          <span>Skills</span>
        </button>

        <button
          onClick={() => triggerSectionTransition("about")}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#140a24] hover:bg-[#201138] text-purple-400 border border-purple-500/50 hover:border-purple-400 transition-all font-bold cursor-pointer"
        >
          <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/50 text-[10px]">
            [A]
          </span>
          <span>About Me</span>
        </button>

        <button
          onClick={() => triggerSectionTransition("career")}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#240c06] hover:bg-[#38140a] text-orange-400 border border-orange-500/50 hover:border-orange-400 transition-all font-bold cursor-pointer"
        >
          <span className="px-1.5 py-0.5 rounded bg-[#f97316]/20 text-orange-400 border border-orange-500/50 text-[10px]">
            [C]
          </span>
          <span>Career</span>
        </button>

        <button
          onClick={() => triggerSectionTransition("education")}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#241d06] hover:bg-[#382d0a] text-yellow-400 border border-yellow-500/50 hover:border-yellow-400 transition-all font-bold cursor-pointer"
        >
          <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 text-[10px]">
            [E]
          </span>
          <span>Education</span>
        </button>
      </motion.footer>
    </div>
  );
};
