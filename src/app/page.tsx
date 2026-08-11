"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalLoader } from "@/components/TerminalLoader";
import { GameCubeLoader } from "@/components/GameCubeLoader";
import { CubeScreen } from "@/components/CubeScreen";

export default function Home() {
  const [loaderType, setLoaderType] = useState<"gamecube" | "terminal">("gamecube");
  const [isLoading, setIsLoading] = useState(true);

  const handleRestartBoot = (type: "gamecube" | "terminal" = "gamecube") => {
    setLoaderType(type);
    setIsLoading(true);
  };

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#020308] relative">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key={loaderType}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {loaderType === "gamecube" ? (
              <GameCubeLoader onFinished={() => setIsLoading(false)} />
            ) : (
              <TerminalLoader onFinished={() => setIsLoading(false)} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="main-cube"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <CubeScreen onRestartBoot={() => handleRestartBoot("gamecube")} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
