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

  // Animate towers Y offset up and out of screen when phase transitions from intro -> active
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

  // Synchronous initial paint + 60 FPS Canvas Loop
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

    // 1. PS2 3D Translucent Towers (Paralelopípedos Verticais)
    const ps2Towers = Array.from({ length: 22 }, (_, i) => ({
      x: (Math.random() - 0.5) * window.innerWidth * 1.6,
      y: (Math.random() - 0.5) * window.innerHeight * 1.4,
      z: 120 + Math.random() * 700,
      w: 24 + Math.random() * 26,
      h: 80 + Math.random() * 160,
      speedY: 0.15 + Math.random() * 0.35,
      color: i % 2 === 0 ? "rgba(99, 102, 241, 0.55)" : "rgba(6, 182, 212, 0.55)",
      strokeColor: i % 2 === 0 ? "rgba(168, 85, 247, 0.8)" : "rgba(56, 189, 248, 0.8)",
    }));

    // 2. Solar System Planets Orbiting Centered Behind the 3D Cube
    const planets = [
      { name: "Mercury", r: 3.5, orbit: 85, speed: 0.015, angle: Math.random() * Math.PI * 2, color: "#cbd5e1" },
      { name: "Venus", r: 5.5, orbit: 130, speed: 0.011, angle: Math.random() * Math.PI * 2, color: "#fef08a" },
      { name: "Earth", r: 6.5, orbit: 180, speed: 0.008, angle: Math.random() * Math.PI * 2, color: "#38bdf8", hasMoon: true },
      { name: "Mars", r: 4.8, orbit: 235, speed: 0.006, angle: Math.random() * Math.PI * 2, color: "#f97316" },
      { name: "Jupiter", r: 15.0, orbit: 330, speed: 0.0035, angle: Math.random() * Math.PI * 2, color: "#fdba74" },
      { name: "Saturn", r: 12.5, orbit: 440, speed: 0.0024, angle: Math.random() * Math.PI * 2, color: "#fef08a", hasRings: true },
      { name: "Uranus", r: 9.5, orbit: 550, speed: 0.0016, angle: Math.random() * Math.PI * 2, color: "#67e8f9", hasCyanRings: true },
      { name: "Neptune", r: 9.0, orbit: 660, speed: 0.0011, angle: Math.random() * Math.PI * 2, color: "#818cf8", hasBlueRings: true },
      { name: "Pluto", r: 3.2, orbit: 760, speed: 0.0008, angle: Math.random() * Math.PI * 2, color: "#e2e8f0", hasCharon: true },
    ];

    // Kuiper Belt Outer Ice Asteroids (120 orbiting particles)
    const kuiperBelt = Array.from({ length: 120 }, () => ({
      orbit: 820 + Math.random() * 80,
      angle: Math.random() * Math.PI * 2,
      speed: 0.0004 + Math.random() * 0.0003,
      size: 0.8 + Math.random() * 1.5,
      alpha: 0.15 + Math.random() * 0.45,
    }));

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
      const grad = ctx.createRadialGradient(cx, cy, 60, cx, cy, Math.max(canvas.width, canvas.height) * 0.95);
      grad.addColorStop(0, "rgba(24, 18, 52, 0.65)");
      grad.addColorStop(0.5, "rgba(8, 14, 32, 0.45)");
      grad.addColorStop(1, "rgba(2, 3, 8, 1)");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ==========================================
      // PS2 3D TRANSLUCENT TOWERS (Paralelopípedos Verticais na Tela Inicial)
      // ==========================================
      if (Math.abs(towersYOffsetRef.current) < window.innerHeight * 1.2) {
        ctx.save();
        ps2Towers.forEach((t) => {
          t.y -= t.speedY;
          if (t.y < -canvas.height * 0.8) t.y = canvas.height * 0.8;

          const hw = t.w / 2;
          const hh = t.h / 2;

          const vTop = [
            project(t.x - hw, t.y - hh, t.z - hw, cx, cy, 0.6),
            project(t.x + hw, t.y - hh, t.z - hw, cx, cy, 0.6),
            project(t.x + hw, t.y - hh, t.z + hw, cx, cy, 0.6),
            project(t.x - hw, t.y - hh, t.z + hw, cx, cy, 0.6),
          ];

          const vBot = [
            project(t.x - hw, t.y + hh, t.z - hw, cx, cy, 0.6),
            project(t.x + hw, t.y + hh, t.z - hw, cx, cy, 0.6),
            project(t.x + hw, t.y + hh, t.z + hw, cx, cy, 0.6),
            project(t.x - hw, t.y + hh, t.z + hw, cx, cy, 0.6),
          ];

          ctx.fillStyle = t.color;
          ctx.strokeStyle = t.strokeColor;
          ctx.globalAlpha = Math.max(0, 0.55 * (1 - Math.abs(towersYOffsetRef.current) / (window.innerHeight * 1.2)));
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

      // ==========================================
      // FULL SOLAR SYSTEM ENGINE (Orbiting Centered Behind 3D Cube)
      // ==========================================
      if (phase !== "intro") {
        ctx.save();
        const sysX = cx + mousePosRef.current.x * 12;
        const sysY = cy + mousePosRef.current.y * 12;

        // 1. Central Glowing Sun directly behind 3D Cube
        const sunGrad = ctx.createRadialGradient(sysX, sysY, 4, sysX, sysY, 36);
        sunGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
        sunGrad.addColorStop(0.2, "rgba(253, 224, 71, 0.9)");
        sunGrad.addColorStop(0.6, "rgba(249, 115, 22, 0.4)");
        sunGrad.addColorStop(1, "rgba(249, 115, 22, 0)");

        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(sysX, sysY, 36, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#fef08a";
        ctx.beginPath();
        ctx.arc(sysX, sysY, 9, 0, Math.PI * 2);
        ctx.fill();

        // 2. Render Orbiting Planets
        moonAngle += 0.03;

        planets.forEach((p) => {
          p.angle += p.speed;

          // Draw faint orbital ring track
          ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(sysX, sysY, p.orbit, 0, Math.PI * 2);
          ctx.stroke();

          // Calculate planet position
          const px = sysX + Math.cos(p.angle) * p.orbit;
          const py = sysY + Math.sin(p.angle) * p.orbit * 0.65;

          // Draw Saturn Rings
          if (p.hasRings) {
            ctx.strokeStyle = "rgba(254, 240, 138, 0.4)";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.ellipse(px, py, p.r * 2.4, p.r * 0.8, Math.PI / 6, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Draw Uranus Rings
          if (p.hasCyanRings) {
            ctx.strokeStyle = "rgba(103, 232, 249, 0.35)";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.ellipse(px, py, p.r * 2.1, p.r * 0.7, -Math.PI / 4, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Draw Neptune Rings
          if (p.hasBlueRings) {
            ctx.strokeStyle = "rgba(129, 140, 248, 0.35)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(px, py, p.r * 2.0, p.r * 0.6, Math.PI / 3, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Draw Planet Body
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
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

          // Draw Pluto Moon Charon
          if (p.hasCharon) {
            const cxM = px + Math.cos(moonAngle * 0.8) * 8;
            const cyM = py + Math.sin(moonAngle * 0.8) * 5;
            ctx.fillStyle = "#cbd5e1";
            ctx.beginPath();
            ctx.arc(cxM, cyM, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Kuiper Belt
        kuiperBelt.forEach((kb) => {
          kb.angle += kb.speed;
          const kx = sysX + Math.cos(kb.angle) * kb.orbit;
          const ky = sysY + Math.sin(kb.angle) * kb.orbit * 0.65;

          ctx.fillStyle = `rgba(203, 213, 225, ${kb.alpha})`;
          ctx.beginPath();
          ctx.arc(kx, ky, kb.size, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      }

      // Distant Wireframe Cubes
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

      // Micro-Meteors
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
  }, [phase]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#020308]">
      {/* 2D Canvas for PS2 Towers on Intro + Solar System Orbiting Centered Behind Cube when Active */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

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
