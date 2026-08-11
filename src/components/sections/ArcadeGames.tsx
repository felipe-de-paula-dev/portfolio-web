"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, RotateCcw, Trophy, Gamepad2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Rocket, Shield, Crosshair } from "lucide-react";
import { SnakeGame } from "@/components/sections/SnakeGame";

// Game 2: Space Invaders / Defender Game
const SpaceInvadersGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerXRef = useRef(150);
  const bulletsRef = useRef<{ x: number; y: number }[]>([]);
  const aliensRef = useRef<{ x: number; y: number; speed: number; alive: boolean }[]>([]);

  const startGame = () => {
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    playerXRef.current = 150;
    bulletsRef.current = [];

    // Spawn 12 Alien ships in a grid
    const initialAliens = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        initialAliens.push({
          x: 35 + c * 50,
          y: 30 + r * 35,
          speed: 1,
          alive: true,
        });
      }
    }
    aliensRef.current = initialAliens;
  };

  const movePlayer = (dir: -1 | 1) => {
    if (!isPlaying || isGameOver) return;
    playerXRef.current = Math.max(20, Math.min(280, playerXRef.current + dir * 25));
  };

  const shootLaser = () => {
    if (!isPlaying || isGameOver) return;
    bulletsRef.current.push({ x: playerXRef.current, y: 260 });
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
      for (let i = 0; i < 20; i++) {
        ctx.fillRect((i * 47) % 300, (i * 31 + Date.now() * 0.05) % 300, 1.5, 1.5);
      }

      // Draw Player Spaceship
      const px = playerXRef.current;
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.moveTo(px, 260);
      ctx.lineTo(px - 14, 280);
      ctx.lineTo(px + 14, 280);
      ctx.closePath();
      ctx.fill();

      // Update & Draw Bullets
      ctx.fillStyle = "#34d399";
      bulletsRef.current.forEach((b, index) => {
        b.y -= 7;
        ctx.fillRect(b.x - 2, b.y, 4, 10);
        if (b.y < 0) bulletsRef.current.splice(index, 1);
      });

      // Update & Draw Aliens
      let reachedEdge = false;
      let aliveCount = 0;

      aliensRef.current.forEach((a) => {
        if (!a.alive) return;
        aliveCount++;
        a.x += alienDir * 0.8;
        if (a.x > 270 || a.x < 30) reachedEdge = true;

        // Draw Alien Ship
        ctx.fillStyle = "#f43f5e";
        ctx.beginPath();
        ctx.arc(a.x, a.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(a.x - 4, a.y - 3, 8, 3);

        // Check Bullet Collision
        bulletsRef.current.forEach((b, bIdx) => {
          if (Math.hypot(b.x - a.x, b.y - a.y) < 14) {
            a.alive = false;
            bulletsRef.current.splice(bIdx, 1);
            setScore((s) => {
              const ns = s + 100;
              setHighScore((hs) => Math.max(hs, ns));
              return ns;
            });
          }
        });

        // Check Invasion Win/Loss
        if (a.y >= 250) {
          setIsGameOver(true);
          setIsPlaying(false);
        }
      });

      if (reachedEdge) {
        alienDir *= -1;
        aliensRef.current.forEach((a) => (a.y += 12));
      }

      if (aliveCount === 0) {
        // Respawn harder wave
        startGame();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver]);

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-3 py-1 select-none touch-none max-w-[300px] sm:max-w-sm mx-auto px-1">
      {/* Game Metrics */}
      <div className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-[#071322]/90 border border-cyan-500/40 text-xs font-mono backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <Rocket className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-bold">DEFENDER SCORE:</span>
          <span className="text-cyan-400 font-orbitron font-bold text-sm">{score}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 font-orbitron font-bold text-sm">{highScore}</span>
        </div>
      </div>

      {/* Canvas Screen */}
      <div className="relative w-full aspect-square bg-[#030a14] border-2 border-cyan-500/60 rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(6,182,212,0.3)] flex items-center justify-center">
        <canvas ref={canvasRef} width={300} height={300} className="w-full h-full" />

        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-[#030a14]/94 backdrop-blur-md flex flex-col items-center justify-center text-center p-4 space-y-3 z-20">
            {isGameOver ? (
              <div className="space-y-1">
                <span className="text-[11px] text-rose-400 font-mono tracking-widest uppercase font-bold">GAME OVER</span>
                <h3 className="text-xl font-orbitron font-extrabold text-white">SCORE: {score}</h3>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-[11px] text-cyan-400 font-mono tracking-widest uppercase font-bold font-orbitron">RETRO ARCADE</span>
                <h3 className="text-xl font-orbitron font-extrabold text-white">SPACE DEFENDER</h3>
                <p className="text-[11px] text-slate-400 font-mono">Destrua a frota de naves alienígenas!</p>
              </div>
            )}

            <button
              onClick={startGame}
              onTouchStart={(e) => {
                e.preventDefault();
                startGame();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-orbitron font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer active:scale-95"
            >
              {isGameOver ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isGameOver ? "DECOLAR NOVAMENTE" : "INICIAR MISSÃO"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch Controls */}
      <div className="flex items-center justify-between w-full pt-1 touch-none">
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            movePlayer(-1);
          }}
          onClick={() => movePlayer(-1)}
          className="w-20 h-12 rounded-xl bg-[#081e36] border-2 border-cyan-500/60 text-cyan-300 active:scale-95 flex items-center justify-center font-bold"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          onTouchStart={(e) => {
            e.preventDefault();
            shootLaser();
          }}
          onClick={shootLaser}
          className="px-6 h-12 rounded-xl bg-emerald-500/30 border-2 border-emerald-400 text-emerald-300 font-orbitron font-extrabold text-xs active:scale-95 flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        >
          <Crosshair className="w-4 h-4 text-emerald-400" />
          <span>FOGO</span>
        </button>

        <button
          onTouchStart={(e) => {
            e.preventDefault();
            movePlayer(1);
          }}
          onClick={() => movePlayer(1)}
          className="w-20 h-12 rounded-xl bg-[#081e36] border-2 border-cyan-500/60 text-cyan-300 active:scale-95 flex items-center justify-center font-bold"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

// Main Component: Arcade Games Center Selector
export const ArcadeGames: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<"snake" | "space">("snake");

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Game Selection Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 rounded-xl bg-[#06121e]/90 border border-slate-800">
        <button
          onClick={() => setSelectedGame("snake")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
            selectedGame === "snake"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 shadow-lg"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-emerald-400" />
          <span>SNAKE</span>
        </button>

        <button
          onClick={() => setSelectedGame("space")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
            selectedGame === "space"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-lg"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Rocket className="w-4 h-4 text-cyan-400" />
          <span>SPACE DEFENDER</span>
        </button>
      </div>

      {/* Selected Game Display */}
      <div>{selectedGame === "snake" ? <SnakeGame /> : <SpaceInvadersGame />}</div>
    </div>
  );
};
