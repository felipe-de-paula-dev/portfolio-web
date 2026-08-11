"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen, ExternalLink, ShieldCheck } from "lucide-react";

export const EducationContent: React.FC = () => {
  const degrees = [
    {
      title: "Análise e Desenvolvimento de Sistemas",
      institution: "Universidade Tecnológica",
      period: "2020 - 2023",
      type: "Graduação Superior",
      description:
        "Foco em engenharia de software, estrutura de dados, redes de computadores, banco de dados relacionais e segurança da informação.",
    },
  ];

  const certs = [
    {
      name: "Java SE 21 Developer Specialist",
      issuer: "Oracle Certified",
      year: "2024",
      tag: "Certificação Oficial",
    },
    {
      name: "Spring Certified Professional",
      issuer: "VMware Spring",
      year: "2024",
      tag: "Certificação Oficial",
    },
    {
      name: "Docker & Container Architecture",
      issuer: "Docker Certified",
      year: "2023",
      tag: "DevOps",
    },
    {
      name: "Clean Code & Software Architecture",
      issuer: "Specialist Course",
      year: "2023",
      tag: "Arquitetura",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Degree Card */}
      <div className="space-y-4">
        <h3 className="text-sm font-mono font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-2">
          <GraduationCap className="w-4 h-4" />
          <span>Formação Acadêmica</span>
        </h3>

        {degrees.map((deg, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-[#141006]/80 border border-yellow-500/30 hover:border-yellow-400 backdrop-blur-md transition-all space-y-2 shadow-xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-lg font-mono font-extrabold text-white">{deg.title}</h4>
              <span className="px-3 py-1 rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 text-xs font-mono">
                {deg.period}
              </span>
            </div>
            <p className="text-xs font-mono text-yellow-400/90 font-bold">{deg.institution}</p>
            <p className="text-xs text-slate-300 font-mono leading-relaxed pt-1">{deg.description}</p>
          </div>
        ))}
      </div>

      {/* Certifications Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-mono font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-2">
          <Award className="w-4 h-4" />
          <span>Certificações & Especializações</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certs.map((cert, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0d0a04]/80 border border-slate-800 hover:border-yellow-500/50 transition-all backdrop-blur-md space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                  {cert.tag}
                </span>
                <span className="text-[11px] font-mono text-slate-500">{cert.year}</span>
              </div>

              <h4 className="font-mono text-sm font-extrabold text-slate-100 group-hover:text-yellow-300 transition-colors">
                {cert.name}
              </h4>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{cert.issuer}</span>
                <ShieldCheck className="w-4 h-4 text-yellow-400 opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
