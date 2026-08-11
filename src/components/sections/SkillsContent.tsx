"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Server, Layout, Database, Wrench, Code2, ShieldCheck, Terminal, Cpu } from "lucide-react";

interface SkillCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  skills: { name: string; level: number; tag: string; description: string }[];
}

export const SkillsContent: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("backend");

  const categories: SkillCategory[] = [
    {
      id: "backend",
      name: "Backend & Core",
      icon: <Server className="w-5 h-5 text-cyan-400" />,
      skills: [
        { name: "Java 21 / 17", level: 95, tag: "Expert", description: "Records, Virtual Threads, Pattern Matching, Stream API" },
        { name: "Spring Boot 3", level: 92, tag: "Expert", description: "REST APIs, Dependency Injection, Auto-configuration, Actuator" },
        { name: "Spring Security", level: 88, tag: "Advanced", description: "OAuth2, JWT Authentication, RBAC, WebSecurityConfig" },
        { name: "Spring Data JPA / Hibernate", level: 90, tag: "Expert", description: "ORM Mappings, JPQL, Criteria API, Query optimization" },
        { name: "Microservices", level: 85, tag: "Advanced", description: "Feign, Eureka, OpenFeign, Resilience4j, API Gateway" },
        { name: "Testes (JUnit 5 / Mockito)", level: 88, tag: "Advanced", description: "Unit tests, Integration tests, Testcontainers, TDD" },
      ],
    },
    {
      id: "frontend",
      name: "Frontend & UI",
      icon: <Layout className="w-5 h-5 text-purple-400" />,
      skills: [
        { name: "React 19", level: 88, tag: "Advanced", description: "Custom Hooks, Context API, Performance, Component Architecture" },
        { name: "Next.js 16 (App Router)", level: 85, tag: "Advanced", description: "Server Components, Server Actions, SSR, Dynamic Routes" },
        { name: "TypeScript", level: 86, tag: "Advanced", description: "Strict Typing, Generics, Interfaces, Utility Types" },
        { name: "Tailwind CSS v4", level: 90, tag: "Expert", description: "Modern Styling, Responsive Layouts, Custom Themes, Glassmorphism" },
        { name: "Framer Motion", level: 82, tag: "Intermediate", description: "3D Animations, Micro-interactions, Layout Transitions" },
      ],
    },
    {
      id: "database",
      name: "Database & Cache",
      icon: <Database className="w-5 h-5 text-emerald-400" />,
      skills: [
        { name: "PostgreSQL", level: 90, tag: "Expert", description: "Complex Queries, Indexing, Transactions, Migrations (Flyway/Liquibase)" },
        { name: "MySQL", level: 85, tag: "Advanced", description: "Database Design, Stored Procedures, Optimization" },
        { name: "Redis", level: 80, tag: "Intermediate", description: "Caching strategy, Session storage, Pub/Sub messaging" },
        { name: "MongoDB", level: 75, tag: "Intermediate", description: "Document Store, Aggregations, NoSQL Architecture" },
      ],
    },
    {
      id: "devops",
      name: "DevOps & Tools",
      icon: <Wrench className="w-5 h-5 text-orange-400" />,
      skills: [
        { name: "Docker & Compose", level: 88, tag: "Advanced", description: "Multi-stage builds, Containerization, Microservice orchestration" },
        { name: "Git & GitHub Actions", level: 90, tag: "Expert", description: "Gitflow, CI/CD Pipelines, Code Review workflows" },
        { name: "Nginx", level: 80, tag: "Intermediate", description: "Reverse Proxy, Load Balancing, SSL/TLS Setup" },
        { name: "Linux / Bash", level: 85, tag: "Advanced", description: "Server Administration, Shell Scripting, Process Management" },
        { name: "Maven / Gradle", level: 90, tag: "Expert", description: "Dependency Management, Build Lifecycle, Plugin Configuration" },
      ],
    },
  ];

  const currentCat = categories.find((c) => c.id === activeCategory) || categories[0];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Category Selection Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border text-sm font-mono transition-all cursor-pointer ${
                isActive
                  ? "bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 font-bold scale-105"
                  : "bg-[#091122]/60 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200"
              }`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {currentCat.skills.map((skill, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-[#080d19]/80 border border-slate-800/80 hover:border-cyan-500/40 transition-all group backdrop-blur-md relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400 opacity-70 group-hover:opacity-100 transition-opacity" />
                <h3 className="font-mono text-sm font-extrabold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {skill.name}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                {skill.tag}
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono mb-3 leading-relaxed">
              {skill.description}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 0.8, delay: index * 0.08, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full"
              />
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-[10px] font-mono text-slate-500">{skill.level}% Competência</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
