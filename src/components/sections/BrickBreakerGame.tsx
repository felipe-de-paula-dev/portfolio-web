"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Trophy, Shield, ArrowLeft, ArrowRight } from "lucide-react";

export const BrickBreakerGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paddleXRef = useRef(110);
  const ballRef = useRef({ x: 130, y: 200, dx: 3.2, dy: -3.2 });
  const bricksRef = useRef<{ x: number; y: number; width: number; height: number; alive: boolean; color: string; points: number }[]>([]);

  const PADDLE_WIDTH = 55;
  const PADDLE_HEIGHT = 8;
  const BALL_RADIUS = 5;

  const initBricks = () => {
    const rows = 4;
    const cols = 5;
    const brickW = 46;
    const brickH = 12;
    const padding = 5;
    const offsetTop = 30;
    const offsetLeft = 12;

    const colors = ["#f43f5e", "#f59e0b", "#10b981", "#06b6d4"];
    const pointsList = [40, 30, 20, 10];

    const bricks = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: offsetLeft + c * (brickW + padding),
          y: offsetTop + r * (brickH + padding),
          width: brickW,
          height: brickH,
          alive: true,
          color: colors[r % colors.length],
          points: pointsList[r % pointsList.length],
        });
      }
    }
    bricksRef.current = bricks;
  };

  const startGame = () => {
    setScore(0);
    setIsGameOver(false);
    setIsWon(false);
    setIsPlaying(true);
    paddleXRef.current = 110;
    ballRef.current = { x: 130, y: 200, dx: (Math.random() > 0.5 ? 1 : -1) * (2.8 + Math.random() * 0.8), dy: -3.2 };
    initBricks();
  };

  const movePaddle = (dir: -1 | 1) => {
    if (!isPlaying || isGameOver) return;
    paddleXRef.current = Math.max(0, Math.min(260 - PADDLE_WIDTH, paddleXRef.current + dir * 22));
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") movePaddle(-1);
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") movePaddle(1);
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

    const loop = () => {
      ctx.fillStyle = "#040b14";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid lines
      ctx.strokeStyle = "rgba(6, 182, 212, 0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 260; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 260);
        ctx.stroke();
      }

      // Update Ball Position
      const b = ballRef.current;
      b.x += b.dx;
      b.y += b.dy;

      // Bounce off walls
      if (b.x - BALL_RADIUS <= 0 || b.x + BALL_RADIUS >= 260) {
        b.dx *= -1;
      }
      if (b.y - BALL_RADIUS <= 0) {
        b.dy *= -1;
      }

      // Ball falls below paddle -> Game Over
      if (b.y + BALL_RADIUS >= 260) {
        setIsGameOver(true);
        setIsPlaying(false);
      }

      // Bounce off Paddle
      const px = paddleXRef.current;
      if (
        b.y + BALL_RADIUS >= 240 &&
        b.y - BALL_RADIUS <= 248 &&
        b.x >= px - 4 &&
        b.x <= px + PADDLE_WIDTH + 4
      ) {
        b.dy = -Math.abs(b.dy);
        // Angle variation based on hit position
        const hitPoint = (b.x - (px + PADDLE_WIDTH / 2)) / (PADDLE_WIDTH / 2);
        b.dx = hitPoint * 4.2;
      }

      // Brick Collision Detection
      let remainingBricks = 0;
      bricksRef.current.forEach((brick) => {
        if (!brick.alive) return;
        remainingBricks++;

        if (
          b.x + BALL_RADIUS >= brick.x &&
          b.x - BALL_RADIUS <= brick.x + brick.width &&
          b.y + BALL_RADIUS >= brick.y &&
          b.y - BALL_RADIUS <= brick.y + brick.height
        ) {
          brick.alive = false;
          b.dy *= -1;
          setScore((s) => {
            const ns = s + brick.points;
            setHighScore((hs) => Math.max(hs, ns));
            return ns;
          });
        }
      });

      if (remainingBricks === 0 && bricksRef.current.length > 0) {
        setIsWon(true);
        setIsGameOver(true);
        setIsPlaying(false);
      }

      // Draw Bricks
      bricksRef.current.forEach((brick) => {
        if (!brick.alive) return;
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
      });

      // Draw Paddle
      ctx.fillStyle = "#38bdf8";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 10;
      ctx.fillRect(px, 240, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.shadowBlur = 0;

      // Draw Ball
      ctx.fillStyle = "#fef08a";
      ctx.shadowColor = "#fef08a";
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
    const touchX = e.touches[0].clientX - rect.left;
    paddleXRef.current = Math.max(0, Math.min(260 - PADDLE_WIDTH, touchX - PADDLE_WIDTH / 2));
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-2 py-1 select-none touch-none max-w-[260px] sm:max-w-[280px] mx-auto px-1">
      {/* Game Metrics */}
      <div className="flex items-center justify-between w-full px-3 py-1.5 rounded-xl bg-[#040e1a]/90 border border-cyan-500/40 text-xs font-mono backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-bold text-[11px]">SCORE:</span>
          <span className="text-cyan-400 font-orbitron font-bold text-xs">{score}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-slate-300 font-bold text-[11px]">BEST:</span>
          <span className="text-yellow-400 font-orbitron font-bold text-xs">{highScore}</span>
        </div>
      </div>

      {/* Canvas Board */}
      <div className="relative w-full aspect-square bg-[#040b14] border-2 border-cyan-500/60 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.3)] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={260}
          height={260}
          onTouchMove={handleTouchMoveCanvas}
          className="w-full h-full touch-none"
        />

        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-[#040b14]/94 backdrop-blur-md flex flex-col items-center justify-center text-center p-3 space-y-2.5 z-20">
            {isGameOver ? (
              <div className="space-y-1">
                <span className={`text-[10px] ${isWon ? "text-emerald-400" : "text-rose-400"} font-mono tracking-widest uppercase font-bold`}>
                  {isWon ? "FASIE CONCLUÍDA!" : "GAME OVER"}
                </span>
                <h3 className="text-lg font-orbitron font-extrabold text-white">SCORE: {score}</h3>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-bold">RETRO ARCADE</span>
                <h3 className="text-lg font-orbitron font-extrabold text-white">BRICK BREAKER</h3>
                <p className="text-[10px] text-slate-400 font-mono">Destrua os blocos com o plasma orb!</p>
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
              <span>{isGameOver ? "JOGAR NOVAMENTE" : "INICIAR JOGO"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="flex items-center justify-between w-full pt-0.5 touch-none">
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            movePaddle(-1);
          }}
          onClick={() => movePaddle(-1)}
          className="w-24 h-9 rounded-lg bg-[#081e36] border border-cyan-500/60 text-cyan-300 active:scale-95 flex items-center justify-center font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          onTouchStart={(e) => {
            e.preventDefault();
            movePaddle(1);
          }}
          onClick={() => movePaddle(1)}
          className="w-24 h-9 rounded-lg bg-[#081e36] border border-cyan-500/60 text-cyan-300 active:scale-95 flex items-center justify-center font-bold"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
