"use client";

import React, { useState, useEffect, useRef } from "react";

interface LogItem {
  id: number;
  timestamp: string;
  level: "INFO" | "WARN" | "DEBUG";
  pid: string;
  thread: string;
  logger: string;
  message: string;
  delayMs: number;
}

const COGNIS_ASCII_BANNER = [
  " ____        ___                          ",
  "/\\  _`\\     /\\_ \\    __                   ",
  "\\ \\ \\L\\_\\ __\\//\\ \\  /\\_\\  _____      __   ",
  " \\ \\  _\\/'__`\\\\ \\ \\ \\/\\ \\/\\ '__`\\  /'__`\\ ",
  "  \\ \\ \\/\\  __/ \\_\\ \\_\\ \\ \\ \\ \\L\\ \\/\\  __/ ",
  "   \\ \\_\\ \\____\\/\\____\\\\ \\_\\ \\ ,__\\/\\ \\____\\",
  "    \\/_/\\/____\\/____/ \\/_/\\ \\ \\/  \\/____/ ",
  "                            \\ \\_\\         ",
  "                             \\/_/         ",
  "©CognisGroup 2026"
];

const LOG_ENTRIES: Omit<LogItem, "id" | "timestamp">[] = [
  {
    level: "INFO",
    pid: "48210",
    thread: "main",
    logger: "com.cognisgroup.CognisApplication",
    message: "Starting CognisApplication v1.0.0 using Java 21.0.3 on cognis-server with PID 48210 (/app/target/cognis-app-1.0.0.jar)",
    delayMs: 180,
  },
  {
    level: "INFO",
    pid: "48210",
    thread: "main",
    logger: "com.cognisgroup.CognisApplication",
    message: "No active profile set, falling back to 1 default profile: \"production\"",
    delayMs: 140,
  },
  {
    level: "INFO",
    pid: "48210",
    thread: "main",
    logger: "o.s.d.r.c.RepositoryConfigurationDelegate",
    message: "Bootstrapping Spring Data JPA repositories in DEFAULT mode for CognisGroup.",
    delayMs: 160,
  },
  {
    level: "INFO",
    pid: "48210",
    thread: "main",
    logger: "o.s.d.r.c.RepositoryConfigurationDelegate",
    message: "Finished Spring Data repository scanning in 32 ms. Found 4 repository interfaces.",
    delayMs: 150,
  },
  {
    level: "INFO",
    pid: "48210",
    thread: "main",
    logger: "o.s.b.w.embedded.tomcat.TomcatWebServer",
    message: "Tomcat initialized with port(s): 8080 (http)",
    delayMs: 220,
  },
  {
    level: "INFO",
    pid: "48210",
    thread: "main",
    logger: "o.a.catalina.core.StandardService",
    message: "Starting service [Tomcat]",
    delayMs: 160,
  },
  {
    level: "INFO",
    pid: "48210",
    thread: "main",
    logger: "o.a.catalina.core.StandardEngine",
    message: "Starting Servlet engine: [Apache Tomcat/10.1.24]",
    delayMs: 180,
  },
  {
    level: "INFO",
    pid: "48210",
    thread: "main",
    logger: "o.a.c.c.C.[Tomcat].[localhost].[/]",
    message: "Initializing Spring embedded WebApplicationContext for CognisGroup",
    delayMs: 160,
  },
  {
    level: "INFO",
    pid: "48210",
    thread: "main",
    logger: "w.s.c.ServletWebServerApplicationContext",
    message: "Root WebApplicationContext: initialization completed in 384 ms",
    delayMs: 200,
  },
  {
    level: "INFO",
    pid: "48210",
    thread: "main",
    logger: "o.s.b.w.embedded.tomcat.TomcatWebServer",
    message: "Tomcat started on port(s): 8080 (http) with context path ''",
    delayMs: 250,
  },
  {
    level: "INFO",
    pid: "48210",
    thread: "main",
    logger: "com.cognisgroup.CognisApplication",
    message: "Started CognisApplication in 1.482 seconds (process running for 1.892)",
    delayMs: 300,
  },
];

interface TerminalLoaderProps {
  onFinished?: () => void;
}

export const TerminalLoader: React.FC<TerminalLoaderProps> = ({ onFinished }) => {
  const [displayedLogs, setDisplayedLogs] = useState<LogItem[]>([]);
  const [showBanner, setShowBanner] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayedLogs, showBanner]);

  useEffect(() => {
    let active = true;

    const startSequence = async () => {
      // Step 1: Print Cognis ASCII Banner
      await new Promise((r) => setTimeout(r, 200));
      if (!active) return;
      setShowBanner(true);

      // Step 2: Stream logs line by line
      for (let i = 0; i < LOG_ENTRIES.length; i++) {
        const item = LOG_ENTRIES[i];
        await new Promise((r) => setTimeout(r, item.delayMs));
        if (!active) return;

        const d = new Date();
        const timestampStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
          d.getDate()
        ).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(
          d.getMinutes()
        ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}.${String(
          d.getMilliseconds()
        ).padStart(3, "0")}-03:00`;

        const logItem: LogItem = {
          ...item,
          id: i,
          timestamp: timestampStr,
        };

        setDisplayedLogs((prev) => [...prev, logItem]);
      }

      // Final delay before transitioning
      await new Promise((r) => setTimeout(r, 800));
      if (!active) return;
      if (onFinished) {
        onFinished();
      }
    };

    startSequence();

    return () => {
      active = false;
    };
  }, [onFinished]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen bg-[#0c0c0c] text-[#cccccc] font-mono text-xs sm:text-sm p-4 sm:p-8 overflow-y-auto select-text leading-relaxed z-50"
    >
      {/* ASCII Banner */}
      {showBanner && (
        <pre className="text-[#6db33f] font-bold leading-tight mb-4 select-text overflow-x-auto text-cursive-glow">
          {COGNIS_ASCII_BANNER.join("\n")}
        </pre>
      )}

      {/* Log Output Stream */}
      {displayedLogs.map((log) => (
        <div key={log.id} className="flex flex-wrap items-start gap-x-2 py-[1px]">
          <span className="text-[#888888]">{log.timestamp}</span>
          <span className="text-[#6db33f] font-bold">{log.level.padEnd(5, " ")}</span>
          <span className="text-[#c678dd]">{log.pid}</span>
          <span className="text-[#666666]">--- [{log.thread.padStart(10, " ")}]</span>
          <span className="text-[#56b6c2]">{log.logger.padEnd(42, " ")} :</span>
          <span
            className={
              log.message.includes("Tomcat started") || log.message.includes("Started CognisApplication")
                ? "text-white font-bold"
                : "text-[#cccccc]"
            }
          >
            {log.message}
          </span>
        </div>
      ))}

      {/* Blinking Cursor */}
      <div className="pt-2 flex items-center gap-2">
        <span className="text-[#6db33f] font-bold">cognis@server:~$</span>
        <span className="animate-pulse text-white">▌</span>
      </div>
    </div>
  );
};
