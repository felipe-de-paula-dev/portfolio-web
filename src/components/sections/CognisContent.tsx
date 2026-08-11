"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Server, Activity, Terminal, ShieldAlert, Zap, Layers, Play } from "lucide-react";

export const CognisContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"benchmark" | "topology" | "sandbox">("benchmark");
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [simMetrics, setSimMetrics] = useState({ requests: 10000, latency: 1.2, rps: 8400 });

  const runSimulation = () => {
    setIsRunningSim(true);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setSimMetrics({
        requests: 10000 + count * 1450,
        latency: parseFloat((0.8 + Math.random() * 0.5).toFixed(2)),
        rps: Math.floor(8200 + Math.random() * 1800),
      });
      if (count > 6) {
        clearInterval(interval);
        setIsRunningSim(false);
      }
    }, 300);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Subnav Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setActiveTab("benchmark")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
            activeTab === "benchmark"
              ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-lg shadow-emerald-500/20"
              : "bg-[#06140d]/60 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>SIMULADOR DE CONCORRÊNCIA</span>
        </button>

        <button
          onClick={() => setActiveTab("topology")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
            activeTab === "topology"
              ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-lg shadow-emerald-500/20"
              : "bg-[#06140d]/60 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>TOPOLOGIA DE MICROSERVIÇOS</span>
        </button>

        <button
          onClick={() => setActiveTab("sandbox")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
            activeTab === "sandbox"
              ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-lg shadow-emerald-500/20"
              : "bg-[#06140d]/60 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>CONSOLE DE LOGS</span>
        </button>
      </div>

      {/* Tab 1: High Concurrency Benchmark Simulator */}
      {activeTab === "benchmark" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-[#03140c]/80 border border-emerald-500/40 backdrop-blur-xl space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/30 pb-4">
            <div>
              <h3 className="font-orbitron font-extrabold text-lg text-white uppercase flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                JAVA 21 VIRTUAL THREADS BENCHMARK
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Teste de estresse concorrente processando I/O não bloqueante em massa.
              </p>
            </div>

            <button
              onClick={runSimulation}
              disabled={isRunningSim}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs transition-all shadow-lg cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${isRunningSim ? "animate-spin" : ""}`} />
              <span>{isRunningSim ? "EXECUTANDO TAREFAS..." : "DISPARAR ESTRUTURA"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#020b06] border border-emerald-500/30">
              <span className="text-[10px] text-slate-400 uppercase font-mono">REQUISIÇÕES PROCESSADAS</span>
              <div className="text-2xl font-orbitron font-extrabold text-emerald-400 mt-1">
                {simMetrics.requests.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#020b06] border border-emerald-500/30">
              <span className="text-[10px] text-slate-400 uppercase font-mono">LATÊNCIA MÉDIA</span>
              <div className="text-2xl font-orbitron font-extrabold text-cyan-400 mt-1">
                {simMetrics.latency} ms
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#020b06] border border-emerald-500/30">
              <span className="text-[10px] text-slate-400 uppercase font-mono">THROUGHPUT (RPS)</span>
              <div className="text-2xl font-orbitron font-extrabold text-purple-400 mt-1">
                {simMetrics.rps.toLocaleString()} req/s
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2: Microservices Mesh Topology */}
      {activeTab === "topology" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-[#03140c]/80 border border-emerald-500/40 backdrop-blur-xl space-y-4"
        >
          <h3 className="font-orbitron font-extrabold text-lg text-white uppercase flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            MALHA DE MICROSERVIÇOS SPRING BOOT
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#020b06] border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">API GATEWAY</span>
                <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">SPRING CLOUD</span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Roteamento dinâmico, limitação de taxa e autenticação unificada.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#020b06] border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400">AUTH SERVICE</span>
                <span className="text-[10px] text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/40">SPRING SECURITY</span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Emissão de tokens JWT assíncronos e verificação RBAC.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#020b06] border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400">EVENT BROKER</span>
                <span className="text-[10px] text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/40">APACHE KAFKA</span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Streaming de eventos distribuídos de alta vazão.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#020b06] border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-yellow-400">DATA STORE</span>
                <span className="text-[10px] text-yellow-300 bg-yellow-500/20 px-2 py-0.5 rounded border border-yellow-500/40">POSTGRES + REDIS</span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Persistência relacional otimizada e cache em memória.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 3: Console Logs */}
      {activeTab === "sandbox" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-[#020905] border border-emerald-500/40 backdrop-blur-xl space-y-3 font-mono text-xs text-emerald-400"
        >
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2 text-slate-400">
            <span>TERMINAL LOGS // SYSTEM TELEMETRY</span>
            <span className="text-emerald-400 font-bold">[ONLINE]</span>
          </div>

          <div className="space-y-1.5 pt-2 text-slate-300">
            <p><span className="text-slate-500">[13:34:01]</span> <span className="text-emerald-400">INFO</span> Java 21 VirtualThreadExecutor initialized. Carrier threads: 16.</p>
            <p><span className="text-slate-500">[13:34:02]</span> <span className="text-cyan-400">DEBUG</span> PostgreSQL connection pool size: 30. HikariCP active.</p>
            <p><span className="text-slate-500">[13:34:03]</span> <span className="text-purple-400">TRACE</span> Spring Security JWT validator loaded successfully.</p>
            <p><span className="text-slate-500">[13:34:04]</span> <span className="text-emerald-400 font-bold">SUCCESS</span> All microservices healthy. Zero bottleneck detected.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
