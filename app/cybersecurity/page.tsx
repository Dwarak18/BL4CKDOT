"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Shield, Eye, Bug, Lock, Radio, AlertTriangle, Target, Zap, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

const services = [
  {
    icon: Target,
    title: "Vulnerability Assessment",
    desc: "Systematic identification and classification of security vulnerabilities in applications, networks, and infrastructure.",
    tags: ["OWASP", "CVE Research", "Risk Scoring", "Remediation"],
  },
  {
    icon: Bug,
    title: "Penetration Testing",
    desc: "Authorized simulated attacks against systems to evaluate security controls and identify exploitable weaknesses.",
    tags: ["Web Apps", "Network", "Mobile", "API Security"],
  },
  {
    icon: Lock,
    title: "Secure Architecture Design",
    desc: "Security-first system design ensuring zero-trust principles, defense in depth, and threat modeling from the ground up.",
    tags: ["Zero Trust", "Threat Modeling", "Security Reviews", "SSDLC"],
  },
  {
    icon: Radio,
    title: "Threat Intelligence",
    desc: "Research into emerging attack vectors, malware analysis, and adversary tactics to proactively defend systems.",
    tags: ["IOC Analysis", "Malware Research", "OSINT", "TTPs"],
  },
  {
    icon: Eye,
    title: "Bug Bounty Research",
    desc: "Active participation in public bug bounty programs to find and responsibly disclose security vulnerabilities.",
    tags: ["HackerOne", "Bugcrowd", "Responsible Disclosure", "CVEs"],
  },
  {
    icon: Shield,
    title: "Security Tool Development",
    desc: "Building custom security tools, scanners, and automation frameworks for defensive and offensive security operations.",
    tags: ["Python", "Fuzzing", "SAST/DAST", "Automation"],
  },
];

const threatFeed = [
  { type: "CVE", id: "2026-1234", severity: "Critical", target: "IoT Firmware", color: "#FF3B3B" },
  { type: "RESEARCH", id: "BL4CK-007", severity: "High", target: "API Auth Bypass", color: "#FF3B3B" },
  { type: "PATCH", id: "SEC-2026-03", severity: "Medium", target: "JWT Validation", color: "#F59E0B" },
  { type: "ADVISORY", id: "ADV-089", severity: "Low", target: "XSS Vector", color: "#22C55E" },
  { type: "CVE", id: "2026-0981", severity: "High", target: "SQL Injection", color: "#FF3B3B" },
];

const ctfChallenges = [
  { name: "SQL Injection Dungeon", category: "Web", points: 100, difficulty: "Beginner" },
  { name: "XSS Breakout", category: "Web", points: 200, difficulty: "Intermediate" },
  { name: "API Auth Bypass", category: "API Security", points: 300, difficulty: "Advanced" },
  { name: "IOT Firmware Extract", category: "Hardware", points: 400, difficulty: "Expert" },
  { name: "Binary Exploitation", category: "PWN", points: 500, difficulty: "Expert" },
];

export default function CybersecurityPage() {
  return (
    <div className="min-h-screen">
      {/* Hero - Security Ops Center */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Scanning animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center top, rgba(255,59,59,0.06) 0%, transparent 60%)" }} />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF3B3B]/40 to-transparent animate-[scan_6s_linear_infinite]"
            style={{ boxShadow: "0 0 20px #FF3B3B" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-mono px-3 py-1 rounded-full border border-[#FF3B3B]/40 text-[#FF3B3B] bg-[#FF3B3B]/5 tracking-widest">
                SECURITY OPS CENTER — ACTIVE
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-[#22C55E] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                Threat monitoring online
              </span>
            </div>
            <h1 className="font-orbitron font-black text-4xl sm:text-6xl text-white leading-tight mb-6">
              Cybersecurity<br /><span style={{ color: "#FF3B3B", textShadow: "0 0 20px #FF3B3B" }}>Division</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Offensive security research, vulnerability assessment, and threat intelligence. We break systems to understand how to defend them.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Threat Feed Dashboard */}
      <section className="py-8 bg-[#060B18] border-y border-[#FF3B3B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={14} className="text-[#FF3B3B]" />
            <span className="text-xs font-mono text-[#FF3B3B] tracking-widest uppercase">Live Threat Intelligence Feed</span>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-max pb-2">
              {threatFeed.concat(threatFeed).map((t, i) => (
                <div key={i} className="glass-panel rounded-lg px-4 py-3 flex items-center gap-3 min-w-[240px]"
                  style={{ borderColor: `${t.color}30` }}>
                  <span className="text-[9px] font-mono text-slate-600 bg-[#0F172A] px-1.5 py-0.5 rounded">{t.type}</span>
                  <span className="font-mono text-xs text-slate-400">{t.id}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-mono"
                    style={{ color: t.color, background: `${t.color}15`, border: `1px solid ${t.color}30` }}>
                    {t.severity}
                  </span>
                  <span className="text-xs text-slate-500 truncate">{t.target}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
          <span className="text-[#FF3B3B] text-xs font-mono tracking-[0.3em] uppercase">Our Capabilities</span>
          <h2 className="font-orbitron font-black text-3xl text-white mt-3">Security Services</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div key={svc.title} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass-panel rounded-xl p-6 space-y-4 group hover:border-[#FF3B3B]/30 transition-all">
                <div className="w-12 h-12 rounded-lg bg-[#FF3B3B]/10 flex items-center justify-center group-hover:bg-[#FF3B3B]/20 transition-colors">
                  <Icon size={22} className="text-[#FF3B3B]" />
                </div>
                <h3 className="font-space font-bold text-white">{svc.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{svc.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {svc.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-[#FF3B3B]/5 text-[#FF3B3B]/70 border border-[#FF3B3B]/20 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Hacker Lab CTF */}
      <section className="py-24 bg-[#060B18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <span className="text-[#FF3B3B] text-xs font-mono tracking-[0.3em] uppercase">Hacker Lab</span>
              <h2 className="font-orbitron font-black text-3xl text-white">
                CTF Challenges &<br /><span style={{ color: "#FF3B3B" }}>Security Training</span>
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Practice real-world attack and defense scenarios in our sandboxed lab environment. Earn points, climb the leaderboard, and develop genuine security skills.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Web Exploitation", "Binary PWN", "Cryptography", "Forensics", "OSINT", "IoT Hacking"].map((cat) => (
                  <span key={cat} className="px-3 py-1.5 rounded-lg bg-[#FF3B3B]/5 border border-[#FF3B3B]/20 text-[#FF3B3B] text-xs font-mono">
                    {cat}
                  </span>
                ))}
              </div>
              <Link href="/apprenticeship"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF3B3B] text-white font-bold rounded-lg text-sm btn-cyber">
                <Zap size={14} /> Enter the Lab
              </Link>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#FF3B3B]/20">
                <span className="font-orbitron text-xs text-[#FF3B3B] tracking-widest">ACTIVE CHALLENGES</span>
                <span className="text-slate-600 text-xs font-mono">5 / 23 shown</span>
              </div>
              {ctfChallenges.map((challenge, i) => (
                <motion.div key={challenge.name} variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true }} custom={i}
                  className="flex items-center justify-between p-4 glass-panel rounded-lg hover:border-[#FF3B3B]/30 transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Target size={14} className="text-[#FF3B3B]/60 group-hover:text-[#FF3B3B] transition-colors" />
                    <div>
                      <p className="text-sm text-white font-medium group-hover:text-[#FF3B3B] transition-colors">
                        {challenge.name}
                      </p>
                      <p className="text-[10px] text-slate-600 font-mono">{challenge.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#22C55E]">+{challenge.points}pts</span>
                    <span className="text-[9px] px-2 py-0.5 rounded font-mono"
                      style={{
                        color: challenge.difficulty === "Expert" ? "#FF3B3B" : challenge.difficulty === "Advanced" ? "#F59E0B" : "#22C55E",
                        background: "rgba(0,0,0,0.3)",
                        border: `1px solid currentColor`,
                      }}>
                      {challenge.difficulty}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security Architecture Principles */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="font-orbitron font-black text-3xl text-white">Our Security Philosophy</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { principle: "Assume Breach", desc: "Design systems assuming adversaries are already inside your network. Minimize blast radius.", icon: "01" },
            { principle: "Shift Left", desc: "Security built into every phase of development — from design to deployment, not bolted on after.", icon: "02" },
            { principle: "Open Research", desc: "Responsible disclosure of findings. Sharing knowledge to make the ecosystem more secure for everyone.", icon: "03" },
          ].map((p, i) => (
            <motion.div key={p.principle} variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true }} custom={i}
              className="glass-panel rounded-xl p-8 space-y-4 text-center hover:border-[#FF3B3B]/30 transition-all">
              <span className="font-orbitron text-4xl font-black text-[#FF3B3B]/20">{p.icon}</span>
              <h3 className="font-orbitron font-bold text-white text-lg">{p.principle}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#060B18] border-t border-[#FF3B3B]/10">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-orbitron font-black text-3xl text-white">
            Join the Security<br /><span style={{ color: "#FF3B3B" }}>Research Team</span>
          </h2>
          <p className="text-slate-500">Apply for our cybersecurity apprenticeship track.</p>
          <Link href="/apprenticeship"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF3B3B] text-white font-bold rounded-lg btn-cyber">
            Apply Now <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
