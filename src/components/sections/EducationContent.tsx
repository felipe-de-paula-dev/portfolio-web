"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, BrainCircuit, Microscope, Sparkles } from "lucide-react";

export const EducationContent: React.FC = () => {
  const academicHighlights = [
    {
      title: "Pesquisador de Iniciação Científica — UNICAMP",
      institution: "Universidade Estadual de Campinas (UNICAMP)",
      period: "Pesquisa & IA Aplicada",
      type: "Iniciação Científica",
      project: "Projeto SmileFY",
      description:
        "Desenvolvimento do SmileFY: sistema de inteligência artificial aplicada ao processamento de imagens odontológicas para identificação e diagnóstico automatizado de cárie e gengivite.",
      icon: <BrainCircuit className="w-5 h-5 text-yellow-400" />,
      tag: "IA & VISÃO COMPUTACIONAL",
    },
    {
      title: "Técnico em Desenvolvimento de Sistemas — COTIL",
      institution: "COTIL — Colégio Técnico de Limeira (UNICAMP)",
      period: "Formação Técnica",
      type: "Ensino Técnico",
      description:
        "Formação técnica completa com foco em lógica de programação, orientação a objetos com Java, modelagem de banco de dados SQL e desenvolvimento mobile com Dart/Flutter.",
      icon: <GraduationCap className="w-5 h-5 text-yellow-400" />,
      tag: "JAVA, SQL, DART",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-mono font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-2">
          <Award className="w-4 h-4" />
          <span>Formação Acadêmica & Pesquisa Científica</span>
        </h3>

        {academicHighlights.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-[#141006]/85 border border-yellow-500/30 hover:border-yellow-400/60 backdrop-blur-md transition-all space-y-3 shadow-xl group"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-yellow-500/20 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-mono font-extrabold text-white group-hover:text-yellow-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs font-mono text-yellow-400/90 font-bold">{item.institution}</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 text-xs font-mono font-bold">
                {item.tag}
              </span>
            </div>

            {item.project && (
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-lg w-fit">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{item.project}</span>
              </div>
            )}

            <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed pt-1">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
