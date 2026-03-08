import type { Metadata } from "next";
import { Orbitron, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import HackerMode from "@/components/HackerMode";
import BL4CKBOT from "@/components/BL4CKBOT";
import DataStreams from "@/components/DataStreams";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BL4CKDOT — Engineering the Future of Intelligent Systems",
  description:
    "BL4CKDOT is a student-driven innovation company focused on IoT engineering, AI systems, micro-LLM research, cybersecurity, and digital engineering.",
  keywords: ["BL4CKDOT", "IoT", "AI", "Cybersecurity", "Micro-LLM", "Innovation"],
  openGraph: {
    title: "BL4CKDOT — Engineering the Future",
    description: "AI • Cybersecurity • IoT • Micro-LLM • Innovation Labs",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${orbitron.variable} ${spaceGrotesk.variable} ${inter.variable} antialiased bg-black text-slate-200 overflow-x-hidden`}
      >
        <div className="cyber-grid fixed inset-0 pointer-events-none z-0" />
        <DataStreams />
        <Navigation />
        <main className="relative z-10">{children}</main>
        <HackerMode />
        <BL4CKBOT />
      </body>
    </html>
  );
}
