import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Felipe | Desenvolvedor Java Spring Boot & Fullstack",
  description: "Portfólio interativo de Felipe - Desenvolvedor especialista em Java 21, Spring Boot 3, APIs REST, Microsserviços e Next.js.",
  keywords: ["Felipe", "Java", "Spring Boot", "Next.js", "React", "Developer Portfolio", "Backend Engineer"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100">{children}</body>
    </html>
  );
}
