"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Trophy, Cpu, ArrowUp, ArrowDown } from "lucide-react";

export const CyberPongGame: React.FC = () => {
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [winner, setWinner] = useState<"player" | "ai" | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerYRef = useRef(100);
  const aiYRef = useRef(100);
  const ballRef = useRef({ x: 130, y: 130, dx: 3.5, dy: 2.2 });

  const PADDLE_WIDTH = 6;
  const PADDLE_HEIGHT = 50;
  const BALL_RADIUS = 5;
  const WINNING_SCORE = 5;

  const startGame = () => {
    setPlayerScore(0);
    setAiScore(0);
    setIsGameOver(false);
    setWinner(null);
    setIsPlaying(true);
    playerYRef.current = 105;
    aiYRef.current = 105;
    resetBall(1);
  };

  const resetBall = (dir = 1) => {
    ballRef.current = {
      x: 130,
      y: 130,
      dx: dir * (3.0 + Math.random() * 0.8),
      dy: (Math.random() > 0.5 ? 1 : -1) * (1.8 + Math.random() * 1.5),
    };
  };

  const movePlayer = (dir: -1 | 1) => {
    if (!isPlaying || isGameOver) return;
    playerYRef.current = Math.max(10, Math.min(250 - PADDLE_HEIGHT, playerYRef.current + dir * 20));
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") movePlayer(-1);
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") movePlayer(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isGameOver]);

  // Main Game Loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      ctx.fillStyle = "#070414";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center dashed net line
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = "rgba(168, 85, 247, 0.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(130, 0);
      ctx.lineTo(130, 260);
      ctx.stroke();
      ctx.setLineDash([]);

      const b = ballRef.current;
      b.x += b.dx;
      b.y += b.dy;

      // Bounce Top / Bottom Walls
      if (b.y - BALL_RADIUS <= 0 || b.y + BALL_RADIUS >= 260) {
        b.dy *= -1;
      }

      // Smooth AI Tracking
      const aiTarget = b.y - PADDLE_HEIGHT / 2;
      const aiDiff = aiTarget - aiYRef.current;
      aiYRef.current += Math.sign(aiDiff) * Math.min(Math.abs(aiDiff), 2.4);
      aiYRef.current = Math.max(10, Math.min(250 - PADDLE_HEIGHT, aiYRef.current));

      // Player Paddle Collision (Left side x = 15)
      const py = playerYRef.current;
      if (
        b.x - BALL_RADIUS <= 21 &&
        b.x + BALL_RADIUS >= 15 &&
        b.y >= py - 4 &&
        b.y <= py + PADDLE_HEIGHT + 4
      ) {
        b.dx = Math.abs(b.dx) * 1.05; // accelerate slightly
        const hitOffset = (b.y - (py + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        b.dy = hitOffset * 3.8;
      }

      // AI Paddle Collision (Right side x = 239)
      const ay = aiYRef.current;
      if (
        b.x + BALL_RADIUS >= 239 &&
        b.x - BALL_RADIUS <= 245 &&
        b.y >= ay - 4 &&
        b.y <= ay + PADDLE_HEIGHT + 4
      ) {
        b.dx = -Math.abs(b.dx) * 1.05;
        const hitOffset = (b.y - (ay + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        b.dy = hitOffset * 3.8;
      }

      // Goal Left (AI Scores)
      if (b.x < 0) {
        setAiScore((s) => {
          const ns = s + 1;
          if (ns >= WINNING_SCORE) {
            setWinner("ai");
            setIsGameOver(true);
            setIsPlaying(false);
          } else {
            resetBall(1);
          }
          return ns;
        });
      }

      // Goal Right (Player Scores)
      if (b.x > 260) {
        setPlayerScore((s) => {
          const ns = s + 1;
          setHighScore((hs) => Math.max(hs, ns));
          if (ns >= WINNING_SCORE) {
            setWinner("player");
            setIsGameOver(true);
            setIsPlaying(false);
          } else {
            resetBall(-1);
          }
          return ns;
        });
      }

      // Draw Player Paddle (Purple Neon)
      ctx.fillStyle = "#a855f7";
      ctx.shadowColor = "#a855f7";
      ctx.shadowBlur = 10;
      ctx.fillRect(15, py, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Draw AI Paddle (Rose Neon)
      ctx.fillStyle = "#f43f5e";
      ctx.shadowColor = "#f43f5e";
      ctx.fillRect(239, ay, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.shadowBlur = 0;

      // Draw Glowing Ball
      ctx.fillStyle = "#38bdf8";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(b.x, b.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver]);

  const handleTouchMoveCanvas = (e: React.TouchEvent) => {
    if (!isPlaying || isGameOver || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const touchY = e.touches[0].clientY - rect.top;
    playerYRef.current = Math.max(10, Math.min(250 - PADDLE_HEIGHT, touchY - PADDLE_HEIGHT / 2));
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-2 py-1 select-none touch-none max-w-[260px] sm:max-w-[280px] mx-auto px-1">
      {/* Game Metrics */}
      <div className="flex items-center justify-between w-full px-3 py-1.5 rounded-xl bg-[#0e0722]/90 border border-purple-500/40 text-xs font-mono backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="text-purple-400 font-bold text-[11px]">YOU:</span>
          <span className="text-purple-300 font-orbitron font-bold text-xs">{playerScore}</span>
        </div>

        <div className="flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-mono text-[10px]">VS AI</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-rose-400 font-bold text-[11px]">AI:</span>
          <span className="text-rose-400 font-orbitron font-bold text-xs">{aiScore}</span>
        </div>
      </div>

      {/* Canvas Board */}
      <div className="relative w-full aspect-square bg-[#070414] border-2 border-purple-500/60 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(168,85,247,0.3)] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={260}
          height={260}
          onTouchMove={handleTouchMoveCanvas}
          className="w-full h-full touch-none"
        />

        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-[#070414]/94 backdrop-blur-md flex flex-col items-center justify-center text-center p-3 space-y-2.5 z-20">
            {isGameOver ? (
              <div className="space-y-1">
                <span className={`text-[10px] ${winner === "player" ? "text-emerald-400" : "text-rose-400"} font-mono tracking-widest uppercase font-bold`}>
                  {winner === "player" ? "VITÓRIA CYBER!" : "SISTEMA VENCEU"}
                </span>
                <h3 className="text-lg font-orbitron font-extrabold text-white">
                  {playerScore} - {aiScore}
                </h3>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase font-bold">RETRO ARCADE</span>
                <h3 className="text-lg font-orbitron font-extrabold text-white">CYBER PONG</h3>
                <p className="text-[10px] text-slate-400 font-mono">Desafie a Inteligência Artificial!</p>
              </div>
            )}

            <button
              onClick={startGame}
              onTouchStart={(e) => {
                e.preventDefault();
                startGame();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-orbitron font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.5)] cursor-pointer active:scale-95"
            >
              {isGameOver ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isGameOver ? "REMATCH" : "INICIAR PARTIDA"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="flex items-center justify-between w-full pt-0.5 touch-none">
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            movePlayer(-1);
          }}
          onClick={() => movePlayer(-1)}
          className="w-24 h-9 rounded-lg bg-[#190d36] border border-purple-500/60 text-purple-300 active:scale-95 flex items-center justify-center font-bold"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        <button
          onTouchStart={(e) => {
            e.preventDefault();
            movePlayer(1);
          }}
          onClick={() => movePlayer(1)}
          className="w-24 h-9 rounded-lg bg-[#190d36] border border-purple-500/60 text-purple-300 active:scale-95 flex items-center justify-center font-bold"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
