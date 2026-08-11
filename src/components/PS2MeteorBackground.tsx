"use client";

import React, { useLayoutEffect, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface PS2MeteorBackgroundProps {
  phase?: "intro" | "legend" | "active";
}

export const PS2MeteorBackground: React.FC<PS2MeteorBackgroundProps> = ({ phase = "active" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const towersYOffsetRef = useRef(0);
  const mousePosRef = useRef({ x: 0, y: 0 });

  // Mouse move listener for differential parallax depth
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mousePosRef.current = {
        x: (e.clientX - cx) / cx, // -1 to 1
        y: (e.clientY - cy) / cy, // -1 to 1
      };
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Animate towers Y offset up and out of screen when phase is "legend" or "active"
  useEffect(() => {
    let animId: number;
    const targetOffset = phase === "intro" ? 0 : -window.innerHeight * 1.3;

    const animateTowers = () => {
      const current = towersYOffsetRef.current;
      const diff = targetOffset - current;
      if (Math.abs(diff) > 0.5) {
        towersYOffsetRef.current += diff * 0.05;
        animId = requestAnimationFrame(animateTowers);
      } else {
        towersYOffsetRef.current = targetOffset;
      }
    };

    animId = requestAnimationFrame(animateTowers);
    return () => cancelAnimationFrame(animId);
  }, [phase]);

  // Synchronous initial paint + 60 FPS Canvas Loop with Solar System Engine
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

    // Living Solar System Planets Definition
    const planets = [
      { name: "Mercury", r: 3.5, orbit: 85, speed: 0.015, angle: Math.random() * Math.PI * 2, color: "#cbd5e1" },
      { name: "Venus", r: 5.5, orbit: 130, speed: 0.011, angle: Math.random() * Math.PI * 2, color: "#fef08a" },
      { name: "Earth", r: 6.5, orbit: 185, speed: 0.008, angle: Math.random() * Math.PI * 2, color: "#38bdf8", hasMoon: true },
      { name: "Mars", r: 4.8, orbit: 240, speed: 0.006, angle: Math.random() * Math.PI * 2, color: "#f97316" },
      { name: "Jupiter", r: 13.0, orbit: 320, speed: 0.0035, angle: Math.random() * Math.PI * 2, color: "#fdba74" },
      { name: "Saturn", r: 10.5, orbit: 410, speed: 0.0024, angle: Math.random() * Math.PI * 2, color: "#fef08a", hasRings: true },
      { name: "Uranus", r: 7.5, orbit: 490, speed: 0.0016, angle: Math.random() * Math.PI * 2, color: "#67e8f9" },
      { name: "Neptune", r: 7.0, orbit: 570, speed: 0.0011, angle: Math.random() * Math.PI * 2, color: "#818cf8" },
    ];

    // Distant 3D Wireframe Cubes
    const distantCubes = Array.from({ length: 24 }, () => ({
      x: (Math.random() - 0.5) * window.innerWidth * 1.8,
      y: (Math.random() - 0.5) * window.innerHeight * 1.6,
      z: 200 + Math.random() * 700,
      size: 10 + Math.random() * 20,
      opacity: 0.03 + Math.random() * 0.08,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      rotSpeedX: 0.001 + Math.random() * 0.002,
      rotSpeedY: 0.001 + Math.random() * 0.002,
    }));

    // Micro-Meteors
    const microMeteors = Array.from({ length: 24 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speedX: 2.2 + Math.random() * 4.5,
      speedY: 0.7 + Math.random() * 2.2,
      size: 0.8 + Math.random() * 1.2,
      alpha: 0.15 + Math.random() * 0.4,
      length: 14 + Math.random() * 24,
    }));

    // Ambient space dust
    const dust = Array.from({ length: 25 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 0.5 + Math.random() * 0.8,
      alpha: 0.05 + Math.random() * 0.15,
      speed: 0.08 + Math.random() * 0.15,
    }));

    const project = (x: number, y: number, z: number, cx: number, cy: number, parallaxMult = 1) => {
      const fov = 420;
      const scale = fov / (fov + z);
      const px = cx + (x + mousePosRef.current.x * 25 * parallaxMult) * scale;
      const py = cy + (y + towersYOffsetRef.current + mousePosRef.current.y * 25 * parallaxMult) * scale;
      return { px, py, scale };
    };

    let moonAngle = 0;

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Deep Space Background Gradient
      const grad = ctx.createRadialGradient(cx, cy, 60, cx, cy, Math.max(canvas.width, canvas.height) * 0.85);
      grad.addColorStop(0, "rgba(24, 18, 52, 0.65)");
      grad.addColorStop(0.5, "rgba(8, 14, 32, 0.45)");
      grad.addColorStop(1, "rgba(2, 3, 8, 1)");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ==========================================
      // LIVING SOLAR SYSTEM ENGINE (Center Stage Canvas)
      // ==========================================
      ctx.save();
      const sysX = cx + mousePosRef.current.x * 12;
      const sysY = cy + mousePosRef.current.y * 12;

      // 1. Central Glowing Sun
      const sunGrad = ctx.createRadialGradient(sysX, sysY, 4, sysX, sysY, 32);
      sunGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
      sunGrad.addColorStop(0.2, "rgba(253, 224, 71, 0.9)");
      sunGrad.addColorStop(0.6, "rgba(249, 115, 22, 0.4)");
      sunGrad.addColorStop(1, "rgba(249, 115, 22, 0)");

      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(sysX, sysY, 32, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.arc(sysX, sysY, 8, 0, Math.PI * 2);
      ctx.fill();

      // 2. Render Orbital Rings & Orbiting Planets
      moonAngle += 0.03;

      planets.forEach((p) => {
        p.angle += p.speed;

        // Draw faint orbital ring track
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(sysX, sysY, p.orbit, 0, Math.PI * 2);
        ctx.stroke();

        // Calculate planet position
        const px = sysX + Math.cos(p.angle) * p.orbit;
        const py = sysY + Math.sin(p.angle) * p.orbit * 0.65; // Elliptical 3D tilt

        // Draw Saturn Rings
        if (p.hasRings) {
          ctx.strokeStyle = "rgba(254, 240, 138, 0.35)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(px, py, p.r * 2.2, p.r * 0.8, Math.PI / 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw Planet Body
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Earth Moon
        if (p.hasMoon) {
          const mx = px + Math.cos(moonAngle) * 14;
          const my = py + Math.sin(moonAngle) * 8;
          ctx.fillStyle = "#e2e8f0";
          ctx.beginPath();
          ctx.arc(mx, my, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.restore();

      // ==========================================
      // DISTANT 3D WIREFRAME CUBES
      // ==========================================
      ctx.save();
      distantCubes.forEach((dc) => {
        dc.rotX += dc.rotSpeedX;
        dc.rotY += dc.rotSpeedY;

        const proj = project(dc.x, dc.y, dc.z, cx, cy, 0.3);
        const pSize = dc.size * proj.scale;

        if (proj.px > -50 && proj.px < canvas.width + 50 && proj.py > -50 && proj.py < canvas.height + 50) {
          ctx.strokeStyle = `rgba(148, 163, 184, ${dc.opacity})`;
          ctx.lineWidth = 0.8 * proj.scale;
          ctx.strokeRect(proj.px - pSize / 2, proj.py - pSize / 2, pSize, pSize);
        }
      });
      ctx.restore();

      // Space dust
      dust.forEach((d) => {
        d.y -= d.speed;
        if (d.y < 0) d.y = canvas.height;
        ctx.fillStyle = `rgba(255, 255, 255, ${d.alpha})`;
        ctx.beginPath();
        ctx.arc(d.x + mousePosRef.current.x * 12, d.y + mousePosRef.current.y * 12, d.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Micro-Meteors in Motion
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
      {/* 2D Canvas for Living Solar System (Fades in ONLY after intro) */}
      <motion.canvas
        ref={canvasRef}
        animate={{ opacity: phase === "intro" ? 0 : 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full z-0"
      />

      {/* Deep Space Galaxy Spirals */}
      <motion.div
        animate={{ opacity: phase === "intro" ? 0 : 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none z-1"
      >
        <motion.div
          className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(6,182,212,0.3) 0%, rgba(59,130,246,0.15) 40%, transparent 75%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute bottom-[-15%] right-[-10%] w-[800px] h-[850px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(236,72,153,0.15) 45%, transparent 75%)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 95, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
};
