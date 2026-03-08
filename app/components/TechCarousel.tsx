import React from 'react'

const technologies = [
  { name: 'Java', icon: 'devicon-java-plain' },
  { name: 'Spring Boot', icon: 'devicon-spring-original' },
  { name: 'Next.js', icon: 'devicon-nextjs-plain' },
  { name: 'Tailwind', icon: 'devicon-tailwindcss-original' },
  { name: 'Docker', icon: 'devicon-docker-plain' },
  { name: 'Fedora', icon: 'devicon-fedora-plain' },
  { name: 'PostgreSQL', icon: 'devicon-postgresql-plain' },
];

export function TechCarousel() {
  return (
    <section id="tech" className="scroll-mt-20 overflow-hidden border-y border-zinc-900 bg-zinc-900/30 py-6 mb-20 relative">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10" />
      
      <div className="flex animate-infinite-scroll">
        {[...technologies, ...technologies].map((tech, index) => (
          <div key={index} className="flex items-center gap-3 text-zinc-600 hover:text-white transition-colors flex-none mx-8">
            <i className={`${tech.icon} colored text-2xl opacity-50`}></i>
            <span className="text-sm font-medium tracking-tight whitespace-nowrap">{tech.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}