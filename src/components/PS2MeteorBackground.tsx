"use client";

import React, { useLayoutEffect, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface PS2MeteorBackgroundProps {
  phase?: "intro" | "legend" | "active";
}

export const PS2MeteorBackground: React.FC<PS2MeteorBackgroundProps> = ({ phase = "active" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const towersYOffsetRef = useRef(0);

  // Animate towers Y offset up and out of screen when phase is "legend" or "active"
  useEffect(() => {
    let animId: number;
    const targetOffset = phase === "intro" ? 0 : -window.innerHeight * 1.3;

    const animateTowers = () => {
      const current = towersYOffsetRef.current;
      const diff = targetOffset - current;
      if (Math.abs(diff) > 0.5) {
        towersYOffsetRef.current += diff * 0.05; // smooth lerp drift
        animId = requestAnimationFrame(animateTowers);
      } else {
        towersYOffsetRef.current = targetOffset;
      }
    };

    animId = requestAnimationFrame(animateTowers);
    return () => cancelAnimationFrame(animId);
  }, [phase]);

  // Synchronous initial paint + 60 FPS Canvas Loop (NO Static JSX elements)
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    // 1. PS2 3D Translucent Towers (50% opacity glass columns)
    const ps2Towers = Array.from({ length: 20 }, (_, i) => ({
      x: (Math.random() - 0.5) * window.innerWidth * 1.6,
      y: (Math.random() - 0.5) * window.innerHeight * 1.4,
      z: 120 + Math.random() * 700,
      w: 20 + Math.random() * 22,
      h: 70 + Math.random() * 140,
      speedY: 0.15 + Math.random() * 0.35,
      color: i % 2 === 0 ? "rgba(99, 102, 241, 0.45)" : "rgba(6, 182, 212, 0.45)",
      strokeColor: i % 2 === 0 ? "rgba(168, 85, 247, 0.7)" : "rgba(56, 189, 248, 0.7)",
    }));

    // 2. Micro-Meteors (Fast, tiny 1-2px, subtle 60 FPS motion)
    const microMeteors = Array.from({ length: 24 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speedX: 2.2 + Math.random() * 4.5,
      speedY: 0.7 + Math.random() * 2.2,
      size: 0.8 + Math.random() * 1.2,
      alpha: 0.15 + Math.random() * 0.4,
      length: 14 + Math.random() * 24,
    }));

    // 3. Ambient space dust
    const dust = Array.from({ length: 25 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 0.5 + Math.random() * 0.8,
      alpha: 0.05 + Math.random() * 0.15,
      speed: 0.08 + Math.random() * 0.15,
    }));

    const project = (x: number, y: number, z: number, cx: number, cy: number) => {
      const fov = 420;
      const scale = fov / (fov + z);
      return {
        px: cx + x * scale,
        py: cy + (y + towersYOffsetRef.current) * scale,
        scale,
      };
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Deep Blue / Violet Space Nebula Background
      const grad = ctx.createRadialGradient(cx, cy, 60, cx, cy, Math.max(canvas.width, canvas.height) * 0.85);
      grad.addColorStop(0, "rgba(16, 24, 52, 0.65)");
      grad.addColorStop(0.5, "rgba(8, 14, 32, 0.45)");
      grad.addColorStop(1, "rgba(2, 3, 8, 1)");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render space dust
      dust.forEach((d) => {
        d.y -= d.speed;
        if (d.y < 0) d.y = canvas.height;
        ctx.fillStyle = `rgba(255, 255, 255, ${d.alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // PS2 3D Translucent Towers (50% Opacity)
      if (Math.abs(towersYOffsetRef.current) < window.innerHeight * 1.2) {
        ctx.save();
        ps2Towers.forEach((t) => {
          t.y -= t.speedY;
          if (t.y < -canvas.height * 0.8) t.y = canvas.height * 0.8;

          const hw = t.w / 2;
          const hh = t.h / 2;

          const vTop = [
            project(t.x - hw, t.y - hh, t.z - hw, cx, cy),
            project(t.x + hw, t.y - hh, t.z - hw, cx, cy),
            project(t.x + hw, t.y - hh, t.z + hw, cx, cy),
            project(t.x - hw, t.y - hh, t.z + hw, cx, cy),
          ];

          const vBot = [
            project(t.x - hw, t.y + hh, t.z - hw, cx, cy),
            project(t.x + hw, t.y + hh, t.z - hw, cx, cy),
            project(t.x + hw, t.y + hh, t.z + hw, cx, cy),
            project(t.x - hw, t.y + hh, t.z + hw, cx, cy),
          ];

          ctx.fillStyle = t.color;
          ctx.strokeStyle = t.strokeColor;
          ctx.globalAlpha = Math.max(0, 0.5 * (1 - Math.abs(towersYOffsetRef.current) / (window.innerHeight * 1.2)));
          ctx.lineWidth = 1;

          ctx.beginPath();
          ctx.moveTo(vTop[3].px, vTop[3].py);
          ctx.lineTo(vTop[2].px, vTop[2].py);
          ctx.lineTo(vBot[2].px, vBot[2].py);
          ctx.lineTo(vBot[3].px, vBot[3].py);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(vTop[0].px, vTop[0].py);
          ctx.lineTo(vTop[1].px, vTop[1].py);
          ctx.lineTo(vTop[2].px, vTop[2].py);
          ctx.lineTo(vTop[3].px, vTop[3].py);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        });
        ctx.restore();
      }

      // Micro-Meteors in Motion (Canvas 60 FPS)
      ctx.save();
      microMeteors.forEach((m) => {
        m.x += m.speedX;
        m.y += m.speedY;

        if (m.x > canvas.width + 50 || m.y > canvas.height + 50) {
          m.x = -50;
          m.y = Math.random() * canvas.height;
        }

        ctx.beginPath();
        ctx.moveTo(m.x - m.speedX * (m.length / 5), m.y - m.speedY * (m.length / 5));
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = `rgba(226, 232, 240, ${m.alpha})`;
        ctx.lineWidth = m.size;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha * 1.2})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    };

    // Immediate first frame paint
    drawFrame();

    const loop = () => {
      drawFrame();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#020308]">
      {/* 2D Canvas for PS2 Towers + Micro-Meteors (No static DOM dots) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Deep Space Galaxy Spirals (Fades in smoothly when phase transitions) */}
      <motion.div
        animate={{ opacity: phase === "intro" ? 0 : 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none z-1"
      >
        {/* Spinning Deep Space Galaxy 1 */}
        <motion.div
          className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full opacity-50"
          style={{
            background: "radial-gradient(circle, rgba(6,182,212,0.4) 0%, rgba(59,130,246,0.2) 40%, rgba(6,182,212,0.06) 60%, transparent 75%)",
            filter: "drop-shadow(0 0 45px rgba(6,182,212,0.5))",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />

        {/* Spinning Deep Space Galaxy 2 */}
        <motion.div
          className="absolute bottom-[-15%] right-[-10%] w-[800px] h-[850px] rounded-full opacity-50"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(236,72,153,0.2) 45%, rgba(168,85,247,0.06) 65%, transparent 75%)",
            filter: "drop-shadow(0 0 45px rgba(168,85,247,0.5))",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 95, repeat: Infinity, ease: "linear" }}
        />

        {/* Deep Space Galaxy 3 */}
        <motion.div
          className="absolute top-[35%] right-[15%] w-[550px] h-[550px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(249,115,22,0.3) 0%, rgba(234,179,8,0.12) 45%, transparent 70%)",
          }}
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
};
