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
  const activePointerIdRef = useRef<number | null>(null);

  const onMoveRef = useRef(onMove);
  const onEndRef = useRef(onEnd);

  useEffect(() => {
    onMoveRef.current = onMove;
    onEndRef.current = onEnd;
  }, [onMove, onEnd]);

  const updateKnob = useCallback((clientX: number, clientY: number) => {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.hypot(dx, dy);

    const maxRadius = Math.max(1, rect.width / 2 - 16);
    const clampedDist = Math.min(distance, maxRadius);

    const angle = Math.atan2(dy, dx);
    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: knobX, y: knobY });

    const vx = knobX / maxRadius;
    const vy = knobY / maxRadius;

    onMoveRef.current(vx, vy);
  }, []);

  const resetJoystick = useCallback(() => {
    activePointerIdRef.current = null;
    setIsEngaged(false);
    setKnobPos({ x: 0, y: 0 });
    onEndRef.current();
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (!baseRef.current) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}

    activePointerIdRef.current = e.pointerId;
    setIsEngaged(true);
    updateKnob(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isEngaged || activePointerIdRef.current !== e.pointerId) return;
    updateKnob(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current === e.pointerId || isEngaged) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch (_) {}
      resetJoystick();
    }
  };

  useEffect(() => {
    if (!isEngaged) return;

    const handleGlobalMove = (e: MouseEvent | TouchEvent | PointerEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      updateKnob(clientX, clientY);
    };

    const handleGlobalEnd = () => {
      resetJoystick();
    };

    window.addEventListener("pointermove", handleGlobalMove);
    window.addEventListener("pointerup", handleGlobalEnd);
    window.addEventListener("pointercancel", handleGlobalEnd);
    window.addEventListener("touchmove", handleGlobalMove, { passive: true });
    window.addEventListener("touchend", handleGlobalEnd);
    window.addEventListener("touchcancel", handleGlobalEnd);
    window.addEventListener("mousemove", handleGlobalMove);
    window.addEventListener("mouseup", handleGlobalEnd);

    return () => {
      window.removeEventListener("pointermove", handleGlobalMove);
      window.removeEventListener("pointerup", handleGlobalEnd);
      window.removeEventListener("pointercancel", handleGlobalEnd);
      window.removeEventListener("touchmove", handleGlobalMove);
      window.removeEventListener("touchend", handleGlobalEnd);
      window.removeEventListener("touchcancel", handleGlobalEnd);
      window.removeEventListener("mousemove", handleGlobalMove);
      window.removeEventListener("mouseup", handleGlobalEnd);
    };
  }, [isEngaged, updateKnob, resetJoystick]);

  return (
    <div
      ref={baseRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-28 h-28 rounded-full bg-[#050c1a]/85 border-2 transition-colors flex items-center justify-center backdrop-blur-xl touch-none select-none cursor-grab active:cursor-grabbing ${
        isEngaged
          ? "border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)] bg-[#08152e]/95 scale-105"
          : "border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:border-cyan-400/70"
      }`}
    >
      {/* Outer Ring Target Crosshair Lines */}
      <div className="absolute inset-0 rounded-full border border-cyan-500/20 pointer-events-none" />
      <div className="absolute w-[1px] h-full bg-cyan-500/20 pointer-events-none" />
      <div className="absolute h-[1px] w-full bg-cyan-500/20 pointer-events-none" />

      {/* Analog Thumbstick Knob Handle */}
      <div
        className={`w-12 h-12 rounded-full border-2 transition-transform duration-75 flex items-center justify-center shadow-lg pointer-events-none ${
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

