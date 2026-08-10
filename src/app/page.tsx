"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { TerminalLoader } from "@/components/TerminalLoader";
import { CubeScreen } from "@/components/CubeScreen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#0c0c0c]">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <TerminalLoader key="loader" onFinished={() => setIsLoading(false)} />
        ) : (
          <CubeScreen key="cube-screen" />
        )}
      </AnimatePresence>
    </main>
  );
}
