"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface MobileJoystickProps {
  onMove: (vx: number, vy: number) => void;
  onEnd: () => void;
}

export const MobileJoystick: React.FC<MobileJoystickProps> = ({ onMove, onEnd }) => {
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isEngaged, setIsEngaged] = useState(false);

  const baseRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!baseRef.current) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsEngaged(true);
    updateKnob(touch.clientX, touch.clientY);
  };

  const updateKnob = useCallback(
    (clientX: number, clientY: number) => {
      if (!baseRef.current) return;
      const rect = baseRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const distance = Math.hypot(dx, dy);

      const maxRadius = rect.width / 2 - 16; // Constrain inside ring
      const clampedDist = Math.min(distance, maxRadius);

      const angle = Math.atan2(dy, dx);
      const knobX = Math.cos(angle) * clampedDist;
      const knobY = Math.sin(angle) * clampedDist;

      setKnobPos({ x: knobX, y: knobY });

      // Normalized velocity (-1 to 1)
      const vx = (knobX / maxRadius);
      const vy = (knobY / maxRadius);

      onMove(vx, vy);
    },
    [onMove]
  );

  useEffect(() => {
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (touchIdRef.current === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchIdRef.current) {
          updateKnob(touch.clientX, touch.clientY);
          break;
        }
      }
    };

    const handleGlobalTouchEnd = (e: TouchEvent) => {
      if (touchIdRef.current === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          touchIdRef.current = null;
          setIsEngaged(false);
          setKnobPos({ x: 0, y: 0 });
          onEnd();
          break;
        }
      }
    };

    window.addEventListener("touchmove", handleGlobalTouchMove, { passive: false });
    window.addEventListener("touchend", handleGlobalTouchEnd);
    window.addEventListener("touchcancel", handleGlobalTouchEnd);

    return () => {
      window.removeEventListener("touchmove", handleGlobalTouchMove);
      window.removeEventListener("touchend", handleGlobalTouchEnd);
      window.removeEventListener("touchcancel", handleGlobalTouchEnd);
    };
  }, [updateKnob, onEnd]);

  return (
    <div
      ref={baseRef}
      onTouchStart={handleTouchStart}
      className={`relative w-28 h-28 rounded-full bg-[#050c1a]/85 border-2 transition-colors flex items-center justify-center backdrop-blur-xl touch-none select-none ${
        isEngaged
          ? "border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.5)] bg-[#08152e]/90"
          : "border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
      }`}
    >
      {/* Outer Ring Target Crosshair Lines */}
      <div className="absolute inset-0 rounded-full border border-cyan-500/20 pointer-events-none" />
      <div className="absolute w-[1px] h-full bg-cyan-500/20 pointer-events-none" />
      <div className="absolute h-[1px] w-full bg-cyan-500/20 pointer-events-none" />

      {/* Analog Thumbstick Knob Handle */}
      <div
        className={`w-12 h-12 rounded-full border-2 transition-transform duration-75 flex items-center justify-center shadow-lg ${
          isEngaged
            ? "bg-gradient-to-tr from-cyan-500 to-indigo-500 border-white shadow-[0_0_20px_#38bdf8] scale-110"
            : "bg-[#091830] border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
        }`}
        style={{
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
        }}
      >
        <div className="w-3 h-3 rounded-full bg-white/80 shadow-inner" />
      </div>
    </div>
  );
};
