"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, RotateCcw, Trophy, Gamepad2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const GRID_SIZE = 16;
const INITIAL_SNAKE: Position[] = [
  { x: 7, y: 8 },
  { x: 7, y: 9 },
  { x: 7, y: 10 },
];

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 4, y: 4 });
  const [direction, setDirection] = useState<Direction>("UP");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const directionRef = useRef<Direction>("UP");
  directionRef.current = direction;

  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Generate random food position not on snake body
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection("UP");
    directionRef.current = "UP";
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const changeDirection = useCallback((newDir: Direction) => {
    const current = directionRef.current;
    if (newDir === "UP" && current !== "DOWN") setDirection("UP");
    if (newDir === "DOWN" && current !== "UP") setDirection("DOWN");
    if (newDir === "LEFT" && current !== "RIGHT") setDirection("LEFT");
    if (newDir === "RIGHT" && current !== "LEFT") setDirection("RIGHT");
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") changeDirection("UP");
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") changeDirection("DOWN");
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") changeDirection("LEFT");
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") changeDirection("RIGHT");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isGameOver, changeDirection]);

  // Touch Swipe Gesture Controls on Game Board
  const handleTouchStartBoard = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEndBoard = (e: React.TouchEvent) => {
    if (!isPlaying || isGameOver) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 15) changeDirection("RIGHT");
      else if (deltaX < -15) changeDirection("LEFT");
    } else {
      if (deltaY > 15) changeDirection("DOWN");
      else if (deltaY < -15) changeDirection("UP");
    }
  };

  // Main Game Loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const speed = Math.max(70, 140 - Math.floor(score / 20) * 10);

    const timer = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        const dir = directionRef.current;

        if (dir === "UP") head.y -= 1;
        if (dir === "DOWN") head.y += 1;
        if (dir === "LEFT") head.x -= 1;
        if (dir === "RIGHT") head.x += 1;

        // Check Wall Collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Check Self Collision
        const selfCollided = prevSnake.some((segment) => segment.x === head.x && segment.y === head.y);
        if (selfCollided) {
          setIsGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check Food Collision
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => {
            const nextScore = s + 10;
            setHighScore((hs) => Math.max(hs, nextScore));
            return nextScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [isPlaying, isGameOver, food, score, generateFood]);

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-3 py-1 select-none relative touch-none max-w-[300px] sm:max-w-sm mx-auto px-1">
      {/* Game Metrics */}
      <div className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-[#061e14]/90 border border-emerald-500/40 text-xs font-mono backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <Gamepad2 className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-bold">SCORE:</span>
          <span className="text-emerald-400 font-orbitron font-bold text-sm">{score}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-slate-300 font-bold">BEST:</span>
          <span className="text-yellow-400 font-orbitron font-bold text-sm">{highScore}</span>
        </div>
      </div>

      {/* Touch-Enabled Snake Arcade Board */}
      <div
        onTouchStart={handleTouchStartBoard}
        onTouchEnd={handleTouchEndBoard}
        className="relative w-full aspect-square bg-[#020b06]/95 border-2 border-emerald-500/60 rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(16,185,129,0.3)] flex items-center justify-center p-2 touch-none"
      >
        {/* Grid Background Lines */}
        <div
          className="w-full h-full grid gap-[1px]"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);

            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
            const isFoodItem = food.x === x && food.y === y;

            return (
              <div
                key={index}
                className={`rounded-[2px] transition-colors ${
                  isHead
                    ? "bg-emerald-400 shadow-[0_0_10px_#34d399]"
                    : isBody
                    ? "bg-emerald-600/80"
                    : isFoodItem
                    ? "bg-cyan-400 shadow-[0_0_12px_#38bdf8] animate-pulse"
                    : "bg-[#04140b]/50"
                }`}
              />
            );
          })}
        </div>

        {/* Start / Game Over Overlay */}
        {(!isPlaying || isGameOver) && (
          <div className="absolute inset-0 bg-[#020b06]/94 backdrop-blur-md flex flex-col items-center justify-center text-center p-4 sm:p-6 space-y-3 z-20">
            {isGameOver ? (
              <div className="space-y-1">
                <span className="text-[11px] text-rose-400 font-mono tracking-widest uppercase font-bold">GAME OVER</span>
                <h3 className="text-xl font-orbitron font-extrabold text-white">SCORE: {score}</h3>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-[11px] text-emerald-400 font-mono tracking-widest uppercase font-bold">RETRO ARCADE</span>
                <h3 className="text-xl font-orbitron font-extrabold text-white">SNAKE GAME</h3>
                <p className="text-[11px] text-slate-400 font-mono">Deslize na tela ou use o D-Pad abaixo</p>
              </div>
            )}

            <button
              onClick={startGame}
              onTouchStart={(e) => {
                e.preventDefault();
                startGame();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-orbitron font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer active:scale-95"
            >
              {isGameOver ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isGameOver ? "JOGAR NOVAMENTE" : "INICIAR JOGO"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Ergonomic Mobile Touch D-Pad Controls (Compact Fit) */}
      <div className="flex flex-col items-center gap-1.5 pt-1 touch-none w-full">
        <button
          onMouseDown={() => changeDirection("UP")}
          onTouchStart={(e) => {
            e.preventDefault();
            changeDirection("UP");
          }}
          className="w-12 h-11 sm:w-14 sm:h-12 rounded-xl bg-[#092e1d] border-2 border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/30 active:bg-emerald-500/50 active:scale-95 transition-all shadow-lg flex items-center justify-center"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onMouseDown={() => changeDirection("LEFT")}
            onTouchStart={(e) => {
              e.preventDefault();
              changeDirection("LEFT");
            }}
            className="w-12 h-11 sm:w-14 sm:h-12 rounded-xl bg-[#092e1d] border-2 border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/30 active:bg-emerald-500/50 active:scale-95 transition-all shadow-lg flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onMouseDown={() => changeDirection("DOWN")}
            onTouchStart={(e) => {
              e.preventDefault();
              changeDirection("DOWN");
            }}
            className="w-12 h-11 sm:w-14 sm:h-12 rounded-xl bg-[#092e1d] border-2 border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/30 active:bg-emerald-500/50 active:scale-95 transition-all shadow-lg flex items-center justify-center"
          >
            <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onMouseDown={() => changeDirection("RIGHT")}
            onTouchStart={(e) => {
              e.preventDefault();
              changeDirection("RIGHT");
            }}
            className="w-12 h-11 sm:w-14 sm:h-12 rounded-xl bg-[#092e1d] border-2 border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/30 active:bg-emerald-500/50 active:scale-95 transition-all shadow-lg flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
