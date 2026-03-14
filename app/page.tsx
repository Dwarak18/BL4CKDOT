"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import HeroAnimation from "@/components/HeroAnimation";
import ParticleBackground from "@/components/ParticleBackground";
import Footer from "@/components/Footer";
import ScrollStory from "@/components/ScrollStory";
import InnovationRadar from "@/components/InnovationRadar";
import {
  Cpu, Shield, Brain, Code2, ArrowRight, ExternalLink,
  ChevronDown, Zap, Globe, Lock, Activity, Lightbulb, Microscope, Network, CircuitBoard, Rocket
} from "lucide-react";

const NetworkSphere = dynamic(() => import("@/components/NetworkSphere3D"), { ssr: false });

const pillars = [
  {
    icon: Cpu,
    title: "IoT Systems",
    color: "#00F5FF",
    borderColor: "rgba(0,245,255,0.3)",
    glowColor: "rgba(0,245,255,0.15)",
    tags: ["Secure Firmware", "Edge Computing", "Device Auth", "Embedded Security"],
    desc: "Engineering connected intelligence — from microcontrollers to cloud-integrated device networks.",
    href: "/innovation-lab",
  },
  {
    icon: Brain,
    title: "Artificial Intelligence",
    color: "#7C3AED",
    borderColor: "rgba(124,58,237,0.3)",
    glowColor: "rgba(124,58,237,0.15)",
    tags: ["micro-LLM", "Automation Agents", "Data Intelligence", "Edge AI"],
    desc: "Building small, powerful AI models that run at the edge. Research-first, production-ready.",
    href: "/innovation-lab#ai",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    color: "#FF3B3B",
    borderColor: "rgba(255,59,59,0.3)",
    glowColor: "rgba(255,59,59,0.15)",
    tags: ["Vulnerability Assessment", "Penetration Testing", "Bug Bounty", "Security Architecture"],
    desc: "Offensive research to build better defenses. We find vulnerabilities before adversaries do.",
    href: "/cybersecurity",
  },
  {
    icon: Code2,
    title: "Digital Engineering",
    color: "#22C55E",
    borderColor: "rgba(34,197,94,0.3)",
    glowColor: "rgba(34,197,94,0.15)",
    tags: ["Web Applications", "Mobile Apps", "Automation", "Cloud Infrastructure"],
    desc: "Full-stack development with production standards. Real products, not just prototypes.",
    href: "/products",
  },
];

const projects = [
  {
    name: "Secure Certificate Verification",
    desc: "Blockchain-anchored certificate issuance and verification system with tamper-proof audit trails.",
    stack: ["Node.js", "Smart Contracts", "MongoDB", "Next.js"],
    status: "released" as const,
    color: "#22C55E",
  },
  {
    name: "IoT Auth Network",
    desc: "Mutual TLS and hardware attestation protocol for authenticated IoT device communication.",
    stack: ["C/C++", "MQTT", "PKI", "Raspberry Pi"],
    status: "development" as const,
    color: "#00F5FF",
  },
  {
    name: "Micro-LLM Assistant",
    desc: "Student AI assistant running a quantized 1B parameter model on edge hardware.",
    stack: ["Python", "GGUF", "llama.cpp", "FastAPI"],
    status: "development" as const,
    color: "#7C3AED",
  },
  {
    name: "CyberTrain Lab",
    desc: "Gamified hacking lab with CTF challenges, automated flag validation, and progress tracking.",
    stack: ["Docker", "Next.js", "Python", "PostgreSQL"],
    status: "research" as const,
    color: "#FF3B3B",
  },
];

const stats = [
  { value: "8+", label: "Core Team" },
  { value: "12+", label: "Projects" },
  { value: "4", label: "Research Tracks" },
  { value: "∞", label: "Possibilities" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export default function HomePage() {
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <ParticleBackground />

          {/* HERO */}
          <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
            <HeroAnimation>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)" }} />
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)" }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-64px)]">
                <div className="space-y-8 py-12 lg:py-0">
                  <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/5 text-[#00F5FF] text-xs font-mono tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] animate-pulse" />
                      STUDENT-DRIVEN INNOVATION COMPANY
                    </span>
                  </motion.div>

                  <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
                    className="font-orbitron font-black leading-tight"
                    style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                    <span className="text-white">Engineering the</span><br />
                    <span className="gradient-text">Future of</span><br />
                    <span className="text-white">Intelligent Systems</span>
                  </motion.h1>

                  <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
                    className="text-slate-400 text-lg max-w-xl">
                    AI&nbsp;•&nbsp;Cybersecurity&nbsp;•&nbsp;IoT&nbsp;•&nbsp;Micro-LLM&nbsp;•&nbsp;Innovation Labs
                  </motion.p>

                  <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="flex flex-wrap gap-4">
                    <Link href="/innovation-lab"
                      className="btn-cyber flex items-center gap-2 px-6 py-3 bg-[#22D3EE] text-black font-semibold rounded-lg text-sm tracking-wide">
                      <Zap size={16} />Explore Innovation Lab
                    </Link>
                    <Link href="/apprenticeship"
                      className="btn-cyber flex items-center gap-2 px-6 py-3 border border-[#8B5CF6]/60 text-[#8B5CF6] rounded-lg text-sm tracking-wide hover:border-[#8B5CF6]">
                      <ArrowRight size={16} />Build With BL4CKDOT
                    </Link>
                  </motion.div>

                  <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
                    className="grid grid-cols-4 gap-4 pt-4">
                    {stats.map((s) => (
                      <div key={s.label} className="text-center">
                        <p className="font-orbitron font-black text-2xl text-[#00F5FF]">{s.value}</p>
                        <p className="text-[10px] text-slate-600 tracking-widest uppercase mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </motion.div>

                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="relative h-[400px] lg:h-[600px] flex items-center justify-center">
                  <NetworkSphere />
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-[300px] h-[300px] rounded-full border border-[#00F5FF]/10 animate-[spin_20s_linear_infinite]" />
                    <div className="absolute w-[240px] h-[240px] rounded-full border border-[#7C3AED]/10 animate-[spin_15s_linear_infinite_reverse]" />
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-700">
              <span className="text-[10px] tracking-widest uppercase">Scroll to explore</span>
              <ChevronDown size={18} />
            </motion.div>
            </HeroAnimation>
          </section>

          {/* INNOVATION PILLARS */}
          <section className="relative z-10 py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-center mb-16">
              <span className="text-[#00F5FF] text-xs font-mono tracking-[0.3em] uppercase">Core Domains</span>
              <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white mt-3">Innovation Pillars</h2>
              <p className="text-slate-500 mt-4 max-w-xl mx-auto">
                Four interconnected verticals defining BL4CKDOT&apos;s research and engineering agenda.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((p, i) => {
                const Icon = p.icon;
                const expanded = hoveredPillar === i;
                return (
                  <motion.div key={p.title} variants={fadeUp} initial="hidden" whileInView="visible"
                    viewport={{ once: true }} custom={i}
                    onMouseEnter={() => setHoveredPillar(i)}
                    onMouseLeave={() => setHoveredPillar(null)}
                    className="relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
                    style={{
                      background: expanded ? `linear-gradient(135deg, ${p.glowColor}, rgba(15,23,42,0.9))` : "rgba(15,23,42,0.6)",
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${expanded ? p.borderColor : "rgba(255,255,255,0.06)"}`,
                      boxShadow: expanded ? `0 0 30px ${p.glowColor}` : "none",
                      transform: expanded ? "translateY(-8px)" : "translateY(0)",
                    }}>
                    <div className="p-6 space-y-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ background: p.glowColor, boxShadow: `0 0 15px ${p.glowColor}` }}>
                        <Icon size={24} style={{ color: p.color }} />
                      </div>
                      <h3 className="font-orbitron font-bold text-base text-white">{p.title}</h3>
                      <p className={`text-slate-400 text-sm leading-relaxed transition-all duration-300 ${expanded ? "opacity-100 max-h-24" : "opacity-0 max-h-0 overflow-hidden"}`}>
                        {p.desc}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {p.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-mono"
                            style={{ background: p.glowColor, color: p.color, border: `1px solid ${p.borderColor}` }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link href={p.href} className="flex items-center gap-1 text-xs font-semibold transition-colors"
                        style={{ color: p.color }}>
                        Explore <ArrowRight size={12} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* BUILD WITH US */}
          <section id="build-with-us" className="relative z-10 py-24" style={{ background: "#0A0F1E" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="text-center mb-14">
                <span className="text-[#22D3EE] text-xs font-mono tracking-[0.3em] uppercase">Collaboration</span>
                <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white mt-3">Build the Future With BL4CKDOT</h2>
                <p className="text-slate-500 mt-4 max-w-xl mx-auto">We work with students, innovators, and companies to turn ideas into real systems.</p>
              </motion.div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: "For Students",   color: "#22D3EE", icon: "🎓", title: "Learn. Build. Ship.",    href: "/apprenticeship", cta: "Join Apprenticeship",   desc: "Join training tracks in AI, IoT, Cybersecurity, or Full-Stack. Work on real projects alongside experienced engineers." },
                  { label: "For Innovators", color: "#8B5CF6", icon: "💡", title: "Idea to Prototype.",    href: "/contact",        cta: "Submit an Idea",        desc: "Submit your idea. Collaborate with BL4CKDOT engineers to research, prototype, and validate it into a real system." },
                  { label: "For Companies",  color: "#22C55E", icon: "🏢", title: "Partner With Us.",     href: "/contact",        cta: "Partner With BL4CKDOT", desc: "Get advanced AI, IoT, and cybersecurity systems built by a research-driven team. Innovation, not just development." },
                ].map((card, i) => (
                  <motion.div key={card.label} variants={fadeUp} initial="hidden" whileInView="visible"
                    viewport={{ once: true }} custom={i}
                    className="rounded-2xl p-7 space-y-4 border transition-all duration-300"
                    style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(20px)", borderColor: `${card.color}20` }}
                    whileHover={{ y: -6 }}>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{card.icon}</span>
                      <span className="text-[9px] uppercase tracking-widest font-mono px-2 py-1 rounded-full border"
                        style={{ color: card.color, borderColor: `${card.color}40`, background: `${card.color}10` }}>
                        {card.label}
                      </span>
                    </div>
                    <h3 className="font-orbitron font-bold text-white text-lg">{card.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
                    <Link href={card.href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                      style={{ color: card.color }}>
                      {card.cta} <ArrowRight size={14} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* SCROLL STORY */}
          <ScrollStory />

          {/* FROM IDEA TO REALITY */}
          <section className="relative z-10 py-24" style={{ background: "#0A0F1E" }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="text-center mb-16">
                <span className="text-[#8B5CF6] text-xs font-mono tracking-[0.3em] uppercase">0 → 1</span>
                <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white mt-3">From Idea to Reality</h2>
                <p className="text-slate-500 mt-4 max-w-lg mx-auto">
                  People bring ideas. BL4CKDOT provides the research, mentorship, and engineering to turn them into real systems.
                </p>
              </motion.div>
              <div className="flex flex-col md:flex-row items-center justify-between">
                {[
                  { step: "01", label: "Idea",       color: "#22D3EE", icon: Lightbulb },
                  { step: "02", label: "Research",   color: "#38BDF8", icon: Microscope },
                  { step: "03", label: "Mentorship", color: "#8B5CF6", icon: Network },
                  { step: "04", label: "Prototype",  color: "#22C55E", icon: CircuitBoard },
                  { step: "05", label: "Product",    color: "#F59E0B", icon: Rocket },
                ].map((item, i, arr) => (
                  <div key={item.step} className="flex items-center">
                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible"
                      viewport={{ once: true }} custom={i}
                      className="flex flex-col items-center text-center w-28 space-y-2 my-4 md:my-0">
                      <motion.div
                        animate={{ scale: [1, 1.06, 1], boxShadow: [`0 0 12px ${item.color}30`, `0 0 24px ${item.color}55`, `0 0 12px ${item.color}30`] }}
                        transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.2 }}
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ background: `${item.color}15`, border: `1px solid ${item.color}40`, boxShadow: `0 0 20px ${item.color}20` }}>
                        <item.icon size={24} style={{ color: item.color }} />
                      </motion.div>
                      <div className="font-mono text-[9px] tracking-widest" style={{ color: item.color }}>{item.step}</div>
                      <div className="font-orbitron font-bold text-white text-xs tracking-wider">{item.label}</div>
                    </motion.div>
                    {i < arr.length - 1 && (
                      <div className="hidden md:block w-10 h-px mx-1 flex-shrink-0"
                        style={{ background: `linear-gradient(to right, ${item.color}50, ${arr[i + 1].color}50)` }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PROJECT SHOWCASE */}
          <section className="relative z-10 py-24 bg-[#060B18]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="text-center mb-16">
                <span className="text-[#7C3AED] text-xs font-mono tracking-[0.3em] uppercase">What We Build</span>
                <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white mt-3">Active Projects</h2>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {projects.map((proj, i) => (
                  <motion.div key={proj.name} variants={fadeUp} initial="hidden" whileInView="visible"
                    viewport={{ once: true }} custom={i}
                    className="glass-panel rounded-xl p-6 space-y-4 hover:border-[#00F5FF]/30 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-widest px-2 py-1 rounded font-mono font-semibold"
                        style={{ color: proj.color, background: `${proj.color}15`, border: `1px solid ${proj.color}40` }}>
                        {proj.status}
                      </span>
                      <ExternalLink size={14} className="text-slate-700 group-hover:text-[#00F5FF] transition-colors" />
                    </div>
                    <h3 className="font-space font-bold text-white text-base group-hover:text-[#00F5FF] transition-colors">
                      {proj.name}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{proj.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.stack.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[#0F172A] text-slate-500 border border-slate-800 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                    <Link href="/projects" className="text-xs text-[#00F5FF] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details <ArrowRight size={10} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-10">
                <Link href="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#00F5FF]/30 text-[#00F5FF] rounded-lg text-sm hover:bg-[#00F5FF]/5 transition-all font-semibold">
                  View All Projects <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>

          {/* INNOVATION RADAR */}
          <section className="relative z-10 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-5">
                  <span className="text-[#00F5FF] text-xs font-mono tracking-[0.3em] uppercase">Live Scan</span>
                  <h2 className="font-orbitron font-black text-3xl text-white">Innovation Radar</h2>
                  <p className="text-slate-500 leading-relaxed">
                    Real-time scan of BL4CKDOT&apos;s active research domain. Each blip represents an active project or research initiative currently in progress across our lab.
                  </p>
                  <div className="space-y-3 pt-2">
                    {["IoT Prototype — Hardware in active dev loop","AI Model Training — Edge LLM optimization","Security Scan — CVE research & exploit analysis","Edge Deploy — Production firmware push","ZK Research — Zero-knowledge proof system"].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 font-mono text-xs text-slate-500">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#00F5FF] shrink-0" style={{ boxShadow: "0 0 6px #00F5FF" }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                  className="flex justify-center">
                  <InnovationRadar />
                </motion.div>
              </div>
            </div>
          </section>

          {/* ABOUT */}
          <section id="about" className="relative z-10 py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
                <span className="text-[#00F5FF] text-xs font-mono tracking-[0.3em] uppercase">Our Mission</span>
                <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white leading-tight">
                  Where Students Build<br /><span className="gradient-text">Real Technology</span>
                </h2>
                <p className="text-slate-400 text-base leading-relaxed">
                  BL4CKDOT is more than a startup — it&apos;s an innovation lab where students turn ideas into systems. We don&apos;t just learn about AI and cybersecurity. We build it, break it, and ship it.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  {["Open Research", "Real Projects", "Production Code", "Security First"].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-lg bg-[#00F5FF]/5 border border-[#00F5FF]/20 text-[#00F5FF] text-xs font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href="/apprenticeship"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#7C3AED] text-white rounded-lg text-sm font-semibold hover:bg-[#7C3AED]/80 transition-colors btn-cyber">
                  Start Your Journey <ArrowRight size={14} />
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                className="grid grid-cols-2 gap-4">
                {[
                  { icon: Brain, title: "AI Research", desc: "Micro-LLM systems and edge AI deployment" },
                  { icon: Shield, title: "Security Lab", desc: "VAPT, bug bounty, and CTF challenges" },
                  { icon: Cpu, title: "IoT Lab", desc: "Hardware prototyping and firmware security" },
                  { icon: Globe, title: "Digital Lab", desc: "Full-stack products and automation systems" },
                  { icon: Lock, title: "Zero Trust", desc: "Security-first architecture in everything" },
                  { icon: Activity, title: "Innovation Feed", desc: "Continuous research and live project updates" },
                ].map((f) => {
                  const FIcon = f.icon;
                  return (
                    <div key={f.title} className="glass-panel rounded-xl p-4 space-y-2 hover:border-[#00F5FF]/30 transition-all">
                      <FIcon size={20} className="text-[#00F5FF]" />
                      <h4 className="font-space font-semibold text-white text-sm">{f.title}</h4>
                      <p className="text-slate-600 text-xs leading-relaxed">{f.desc}</p>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* COMPARISON TABLE */}
          <section className="relative z-10 py-24" style={{ background: "#0A0F1E" }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="text-center mb-12">
                <span className="text-[#FF3B3B] text-xs font-mono tracking-[0.3em] uppercase">Why BL4CKDOT</span>
                <h2 className="font-orbitron font-black text-3xl text-white mt-3">BL4CKDOT vs Traditional Firms</h2>
              </motion.div>
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="glass-panel rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left px-6 py-4 font-mono text-[10px] text-slate-600 uppercase tracking-widest">Feature</th>
                      <th className="px-6 py-4 font-mono text-[10px] text-slate-600 uppercase tracking-widest text-center">Traditional Firms</th>
                      <th className="px-6 py-4 font-orbitron text-[10px] text-[#22D3EE] uppercase tracking-widest text-center">BL4CKDOT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Innovation Lab",           "✗", "✓"],
                      ["Student Mentorship",        "✗", "✓"],
                      ["Idea Incubator",             "✗", "✓"],
                      ["Active Research Projects",  "Rare", "✓"],
                      ["Open Source Work",          "✗", "✓"],
                      ["Edge AI / IoT Systems",     "✗", "✓"],
                      ["Cybersecurity Research",    "✗", "✓"],
                    ].map(([feature, trad, bl4ck], i) => (
                      <tr key={String(feature)} className={`border-b border-slate-800/50 ${i % 2 === 0 ? "bg-[#0F172A]/20" : ""}`}>
                        <td className="px-6 py-3 text-slate-300">{String(feature)}</td>
                        <td className="px-6 py-3 text-center">
                          {trad === "✗"
                            ? <span className="text-[#FF3B3B] font-bold">✗</span>
                            : <span className="text-yellow-500 text-xs font-mono">{trad}</span>}
                        </td>
                        <td className="px-6 py-3 text-center text-[#22C55E] font-bold">{bl4ck}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </div>
          </section>

          {/* INNOVATION TIMELINE */}
          <section className="relative z-10 py-24 bg-[#060B18]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="text-center mb-14">
                <span className="text-[#22D3EE] text-xs font-mono tracking-[0.3em] uppercase">Vision</span>
                <h2 className="font-orbitron font-black text-3xl text-white mt-3">Innovation Timeline</h2>
              </motion.div>
              <div className="relative pl-8 border-l border-[#22D3EE]/15 space-y-8">
                {[
                  { year: "2026", now: true,  color: "#22D3EE", label: "BL4CKDOT Founded",        desc: "Lab established. First team assembled. Research tracks launched across AI, IoT, and Cybersecurity." },
                  { year: "2027", now: false, color: "#8B5CF6", label: "First Innovation Lab",    desc: "Physical lab opens. IoT + AI research tools deployed. First apprenticeship cohort ships real systems." },
                  { year: "2028", now: false, color: "#22C55E", label: "AI + IoT Products Launch", desc: "BL4CK-CERT, IoT Shield, and BL4CKBOT reach production. Student-built products go live." },
                  { year: "2029+",now: false, color: "#F59E0B", label: "BL4CKDOT Ecosystem",      desc: "Open innovation platform. Student-built products. Community-driven research at scale." },
                ].map((item, i) => (
                  <motion.div key={item.year} variants={fadeUp} initial="hidden" whileInView="visible"
                    viewport={{ once: true }} custom={i} className="relative">
                    <div className="absolute -left-[2.4rem] w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: `${item.color}20`, border: `1px solid ${item.color}50`,
                        boxShadow: item.now ? `0 0 14px ${item.color}50` : "none" }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                    </div>
                    <div className="glass-panel rounded-xl p-5 space-y-1.5" style={{ borderColor: `${item.color}20` }}>
                      <div className="flex items-center gap-3">
                        <span className="font-orbitron font-black text-xl" style={{ color: item.color }}>{item.year}</span>
                        {item.now && <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30">NOW</span>}
                      </div>
                      <h3 className="font-space font-bold text-white">{item.label}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA BAND */}
          <section className="relative z-10 py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF]/5 via-[#7C3AED]/10 to-[#00F5FF]/5" />
            <div className="absolute inset-0 border-y border-[#00F5FF]/10" />
            <div className="relative max-w-4xl mx-auto px-4 text-center space-y-6">
              <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="font-orbitron font-black text-3xl sm:text-5xl text-white">
                Ready to Build the Future?
              </motion.h2>
              <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                className="text-slate-400 text-lg">
                Join BL4CKDOT&apos;s apprenticeship and work on real AI, IoT, and cybersecurity systems.
              </motion.p>
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
                className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/apprenticeship" className="btn-cyber px-8 py-4 bg-[#00F5FF] text-black font-bold rounded-lg text-sm tracking-wide">
                  Apply for Apprenticeship
                </Link>
                <Link href="/projects" className="btn-cyber px-8 py-4 border border-[#00F5FF]/40 text-[#00F5FF] rounded-lg text-sm tracking-wide hover:bg-[#00F5FF]/5">
                  Explore Our Work
                </Link>
              </motion.div>
            </div>
          </section>

          <Footer />
    </motion.div>
  );
}
