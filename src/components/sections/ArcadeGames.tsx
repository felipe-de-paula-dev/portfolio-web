"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Trophy, Gamepad2, ArrowLeft, ArrowRight, Rocket, Shield, Crosshair, Cpu } from "lucide-react";
import { SnakeGame } from "@/components/sections/SnakeGame";
import { BrickBreakerGame } from "@/components/sections/BrickBreakerGame";
import { CyberPongGame } from "@/components/sections/CyberPongGame";

// Game 2: Space Invaders / Defender Game
const SpaceInvadersGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerXRef = useRef(130);
  const bulletsRef = useRef<{ x: number; y: number }[]>([]);
  const aliensRef = useRef<{ x: number; y: number; speed: number; alive: boolean }[]>([]);

  const startGame = () => {
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    playerXRef.current = 130;
    bulletsRef.current = [];

    // Spawn 12 Alien ships in a grid
    const initialAliens = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        initialAliens.push({
          x: 30 + c * 44,
          y: 25 + r * 30,
          speed: 1,
          alive: true,
        });
      }
    }
    aliensRef.current = initialAliens;
  };

  const movePlayer = (dir: -1 | 1) => {
    if (!isPlaying || isGameOver) return;
    playerXRef.current = Math.max(15, Math.min(245, playerXRef.current + dir * 20));
  };

  const shootLaser = () => {
    if (!isPlaying || isGameOver) return;
    bulletsRef.current.push({ x: playerXRef.current, y: 230 });
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") movePlayer(-1);
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") movePlayer(1);
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") shootLaser();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isGameOver]);

  // Main Canvas Render Loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let alienDir = 1;

    const loop = () => {
      ctx.fillStyle = "#030a14";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Stars
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      for (let i = 0; i < 18; i++) {
        ctx.fillRect((i * 41) % 260, (i * 29 + Date.now() * 0.05) % 260, 1.5, 1.5);
      }

      // Draw Player Spaceship
      const px = playerXRef.current;
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.moveTo(px, 225);
      ctx.lineTo(px - 12, 245);
      ctx.lineTo(px + 12, 245);
      ctx.closePath();
      ctx.fill();

      // Update & Draw Bullets
      ctx.fillStyle = "#34d399";
      bulletsRef.current.forEach((b, index) => {
        b.y -= 7;
        ctx.fillRect(b.x - 1.5, b.y, 3, 9);
        if (b.y < 0) bulletsRef.current.splice(index, 1);
      });

      // Update & Draw Aliens
      let reachedEdge = false;
      let aliveCount = 0;

      aliensRef.current.forEach((a) => {
        if (!a.alive) return;
        aliveCount++;
        a.x += alienDir * 0.75;
        if (a.x > 235 || a.x < 25) reachedEdge = true;

        // Draw Alien Ship
        ctx.fillStyle = "#f43f5e";
        ctx.beginPath();
        ctx.arc(a.x, a.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(a.x - 3, a.y - 2, 6, 2.5);

        // Check Bullet Collision
        bulletsRef.current.forEach((b, bIdx) => {
          if (Math.hypot(b.x - a.x, b.y - a.y) < 12) {
            a.alive = false;
            bulletsRef.current.splice(bIdx, 1);
            setScore((s) => {
              const ns = s + 100;
              setHighScore((hs) => Math.max(hs, ns));
              return ns;
            });
          }
        });

        // Check Invasion Loss
        if (a.y >= 220) {
          setIsGameOver(true);
          setIsPlaying(false);
        }
      });

      if (reachedEdge) {
        alienDir *= -1;
        aliensRef.current.forEach((a) => (a.y += 10));
      }

      if (aliveCount === 0 && aliensRef.current.length > 0) {
        // Respawn harder wave
        startGame();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver]);

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-2 py-1 select-none touch-none max-w-[260px] sm:max-w-[280px] mx-auto px-1">
      {/* Game Metrics */}
      <div className="flex items-center justify-between w-full px-3 py-1.5 rounded-xl bg-[#071322]/90 border border-cyan-500/40 text-xs font-mono backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <Rocket className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-bold text-[11px]">SCORE:</span>
          <span className="text-cyan-400 font-orbitron font-bold text-xs">{score}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-yellow-400 font-orbitron font-bold text-xs">{highScore}</span>
        </div>
      </div>

      {/* Canvas Screen */}
      <div className="relative w-full aspect-square bg-[#030a14] border-2 border-cyan-500/60 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.3)] flex items-center justify-center">
        <canvas ref={canvasRef} width={260} height={260} className="w-full h-full" />

        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-[#030a14]/94 backdrop-blur-md flex flex-col items-center justify-center text-center p-3 space-y-2.5 z-20">
            {isGameOver ? (
              <div className="space-y-1">
                <span className="text-[10px] text-rose-400 font-mono tracking-widest uppercase font-bold">GAME OVER</span>
                <h3 className="text-lg font-orbitron font-extrabold text-white">SCORE: {score}</h3>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-bold">RETRO ARCADE</span>
                <h3 className="text-lg font-orbitron font-extrabold text-white">SPACE DEFENDER</h3>
                <p className="text-[10px] text-slate-400 font-mono">Destrua as naves alienígenas!</p>
              </div>
            )}

            <button
              onClick={startGame}
              onTouchStart={(e) => {
                e.preventDefault();
                startGame();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-orbitron font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)] cursor-pointer active:scale-95"
            >
              {isGameOver ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isGameOver ? "RECOLAR NOVAMENTE" : "INICIAR MISSÃO"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch Controls */}
      <div className="flex items-center justify-between w-full pt-0.5 touch-none">
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            movePlayer(-1);
          }}
          onClick={() => movePlayer(-1)}
          className="w-14 h-9 rounded-lg bg-[#081e36] border border-cyan-500/60 text-cyan-300 active:scale-95 flex items-center justify-center font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          onTouchStart={(e) => {
            e.preventDefault();
            shootLaser();
          }}
          onClick={shootLaser}
          className="px-4 h-9 rounded-lg bg-emerald-500/30 border border-emerald-400 text-emerald-300 font-orbitron font-extrabold text-[11px] active:scale-95 flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
        >
          <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
          <span>FOGO</span>
        </button>

        <button
          onTouchStart={(e) => {
            e.preventDefault();
            movePlayer(1);
          }}
          onClick={() => movePlayer(1)}
          className="w-14 h-9 rounded-lg bg-[#081e36] border border-cyan-500/60 text-cyan-300 active:scale-95 flex items-center justify-center font-bold"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export type GameKey = "snake" | "space" | "brick" | "pong";

// Main Component: Arcade Games Center Selector (4 Games Hub)
export const ArcadeGames: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameKey>("snake");

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {/* 4 Games Retro Arcade Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 rounded-xl bg-[#06121e]/90 border border-slate-800">
        <button
          onClick={() => setSelectedGame("snake")}
          className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
            selectedGame === "snake"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 shadow-lg"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>SNAKE</span>
        </button>

        <button
          onClick={() => setSelectedGame("space")}
          className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
            selectedGame === "space"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-lg"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Rocket className="w-3.5 h-3.5 text-cyan-400" />
          <span>SPACE</span>
        </button>

        <button
          onClick={() => setSelectedGame("brick")}
          className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
            selectedGame === "brick"
              ? "bg-amber-500/20 text-amber-300 border border-amber-400/60 shadow-lg"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>BRICK</span>
        </button>

        <button
          onClick={() => setSelectedGame("pong")}
          className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
            selectedGame === "pong"
              ? "bg-purple-500/20 text-purple-300 border border-purple-400/60 shadow-lg"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>PONG</span>
        </button>
      </div>

      {/* Selected Game Display */}
      <div>
        {selectedGame === "snake" && <SnakeGame />}
        {selectedGame === "space" && <SpaceInvadersGame />}
        {selectedGame === "brick" && <BrickBreakerGame />}
        {selectedGame === "pong" && <CyberPongGame />}
      </div>
    </div>
  );
};
