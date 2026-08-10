"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

export const PS2MeteorBackground: React.FC = () => {
  // Generate 38 elegant parabolic orbiting comets with unique keys
  const comets = useMemo(() => {
    const colors = ["#06b6d4", "#a855f7", "#f97316", "#eab308", "#22c55e", "#38bdf8", "#ec4899"];

    return Array.from({ length: 38 }, (_, i) => {
      const startX = (i * 8.7) % 95;
      const startY = (i * 13.3) % 90;

      // Parabolic Arc offsets
      const midX = startX + 150 + ((i * 17) % 65);
      const midY = startY - 75 + ((i * 19) % 55);
      const endX = midX + 150;
      const endY = startY + 115;

      return {
        id: `comet-${i}`,
        startX,
        startY,
        midX,
        midY,
        endX,
        endY,
        size: 2 + (i % 3) * 1.2,
        tailLength: 110 + (i % 5) * 32,
        color: colors[i % colors.length],
        duration: 7 + (i % 5) * 1.8,
        delay: (i % 7) * 0.7,
      };
    });
  }, []);

  // Cosmic Stars with unique keys
  const stars = useMemo(() => {
    return Array.from({ length: 55 }, (_, i) => ({
      id: `star-${i}`,
      x: (i * 17.3) % 100,
      y: (i * 21.7) % 100,
      size: 1 + (i % 3) * 0.8,
      duration: 3 + (i % 4) * 0.8,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#020308]">
      {/* 🌌 Spinning Deep Space Galaxy 1 (Cyan / Blue Spiral) */}
      <motion.div
        className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.4) 0%, rgba(59,130,246,0.2) 40%, rgba(6,182,212,0.06) 60%, transparent 75%)",
          filter: "drop-shadow(0 0 45px rgba(6,182,212,0.5))",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      />

      {/* 🌌 Spinning Deep Space Galaxy 2 (Violet / Magenta Spiral) */}
      <motion.div
        className="absolute bottom-[-15%] right-[-10%] w-[800px] h-[850px] rounded-full opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(236,72,153,0.2) 45%, rgba(168,85,247,0.06) 65%, transparent 75%)",
          filter: "drop-shadow(0 0 45px rgba(168,85,247,0.5))",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 95, repeat: Infinity, ease: "linear" }}
      />

      {/* 🌌 Deep Space Galaxy 3 (Golden Amber Core) */}
      <motion.div
        className="absolute top-[35%] right-[15%] w-[550px] h-[550px] rounded-full opacity-40"
        style={{
          background: "radial-gradient(circle, rgba(249,115,22,0.3) 0%, rgba(234,179,8,0.12) 45%, transparent 70%)",
        }}
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Twinkling Cosmic Star Field */}
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute bg-white rounded-full shadow-[0_0_6px_#ffffff]"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
          }}
          animate={{ opacity: [0.2, 0.85, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: s.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Parabolic Orbiting Comets & Light Trails */}
      {comets.map((c) => (
        <motion.div
          key={c.id}
          className="absolute rounded-full"
          style={{
            left: `${c.startX}%`,
            top: `${c.startY}%`,
            width: `${c.size}px`,
            height: `${c.size}px`,
            backgroundColor: c.color,
            boxShadow: `0 0 14px ${c.color}, 0 0 28px ${c.color}`,
          }}
          animate={{
            x: [0, c.midX - c.startX, c.endX - c.startX],
            y: [0, c.midY - c.startY, c.endY - c.startY],
            opacity: [0, 0.8, 0],
            scale: [0.4, 1.2, 0.3],
            rotate: [0, 45, 90],
          }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: c.delay,
          }}
        >
          {/* Curved Parabolic Light Tail */}
          <div
            className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-full opacity-75"
            style={{
              width: `${c.tailLength}px`,
              height: "1.2px",
              background: `linear-gradient(to left, ${c.color}, ${c.color}77, transparent)`,
              filter: `drop-shadow(0 0 6px ${c.color})`,
              transform: "rotate(-15deg)",
              transformOrigin: "right center",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};
