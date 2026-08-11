"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, Building2, CheckCircle2, ChevronRight } from "lucide-react";

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  techStack: string[];
}

export const CareerContent: React.FC = () => {
  const experiences: ExperienceItem[] = [
    {
      company: "CognisGroup / Software Engineering",
      role: "Desenvolvedor Backend & Fullstack Senior",
      period: "2023 - Presente",
      location: "Remoto / Brasil",
      description:
        "Liderança no desenvolvimento de microserviços em Java 21 / Spring Boot 3 e sistemas web reativos de grande porte.",
      achievements: [
        "Arquitetura e implementação de APIs RESTful com Spring Security, OAuth2 e JWT",
        "Otimização de consultas relacionais PostgreSQL reduzindo o tempo de resposta em 40%",
        "Criação de pipelines CI/CD com Docker e GitHub Actions para deploy automatizado",
      ],
      techStack: ["Java 21", "Spring Boot 3", "Spring Data JPA", "PostgreSQL", "React", "Docker", "Tailwind CSS"],
    },
    {
      company: "Tech Systems Solutions",
      role: "Desenvolvedor Java / Spring",
      period: "2021 - 2023",
      location: "São Paulo, SP",
      description:
        "Desenvolvimento de aplicações corporativas, integração de gateways de pagamento e refatoração de sistemas legados.",
      achievements: [
        "Migração de monólito para arquitetura de microserviços com Spring Cloud",
        "Implementação de suíte de testes automatizados atingindo 85%+ de cobertura de código",
      ],
      techStack: ["Java 17", "Spring Boot", "MySQL", "Redis", "JUnit 5", "Mockito", "TypeScript"],
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="relative border-l-2 border-orange-500/40 pl-6 sm:pl-8 ml-2 sm:ml-4 space-y-8">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative group"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-orange-500 border-4 border-[#020308] group-hover:scale-125 transition-transform shadow-[0_0_12px_#f97316]" />

            {/* Experience Card */}
            <div className="p-6 rounded-2xl bg-[#0d091a]/80 border border-slate-800 hover:border-orange-500/50 backdrop-blur-md transition-all space-y-4 shadow-xl">
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="text-lg font-mono font-extrabold text-white group-hover:text-orange-300 transition-colors">
                    {exp.role}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-orange-400 mt-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{exp.company}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{exp.period}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
                {exp.description}
              </p>

              {/* Achievements */}
              <div className="space-y-2">
                {exp.achievements.map((ach, aIdx) => (
                  <div key={aIdx} className="flex items-start gap-2 text-xs text-slate-300 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <span>{ach}</span>
                  </div>
                ))}
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
                {exp.techStack.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-slate-700 text-slate-300 hover:border-orange-500/50 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
