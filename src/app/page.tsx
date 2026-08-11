"use client";

import React, { useState } from "react";
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
      {isLoading ? (
        loaderType === "gamecube" ? (
          <GameCubeLoader onFinished={() => setIsLoading(false)} />
        ) : (
          <TerminalLoader onFinished={() => setIsLoading(false)} />
        )
      ) : (
        <CubeScreen onRestartBoot={() => handleRestartBoot("gamecube")} />
      )}
    </main>
  );
}
