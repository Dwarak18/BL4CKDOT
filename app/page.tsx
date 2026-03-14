"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import HeroAnimation from "@/components/HeroAnimation";
import ParticleBackground from "@/components/ParticleBackground";
import Footer from "@/components/Footer";
import InnovationRadar from "@/components/InnovationRadar";
import { ArrowRight, ChevronDown, Lightbulb, Microscope, Network, CircuitBoard, Rocket, Zap } from "lucide-react";

const NetworkSphere = dynamic(() => import("@/components/NetworkSphere3D"), { ssr: false });

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const timeline = [
  { year: "2026", title: "BL4CKDOT founded", desc: "Founded as a student innovation initiative." },
  { year: "2027", title: "Innovation platform launch", desc: "Idea submission and mentorship ecosystem launched." },
  { year: "2028", title: "First AI + IoT prototypes", desc: "Real products shipped through research-driven engineering." },
  { year: "2029", title: "Research partnerships", desc: "Strategic collaborations with research organizations." },
  { year: "2030", title: "Incubation scale-up", desc: "Expanded into a full technology incubation network." },
];

export default function HomePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <ParticleBackground />

      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
        <HeroAnimation>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-64px)]">
              <div className="space-y-8 py-12 lg:py-0 max-w-xl">
                <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/5 text-[#00F5FF] text-xs font-mono tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] animate-pulse" />
                    INNOVATION ECOSYSTEM
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                  className="font-orbitron font-black text-white leading-[1.14] tracking-[0.02em]"
                  style={{ fontSize: "clamp(2.1rem, 5vw, 3.8rem)" }}
                >
                  Engineering the Future
                  <br />
                  of Intelligent Systems
                </motion.h1>

                <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="text-slate-400 text-lg leading-[1.6] max-w-lg">
                  AI • Cybersecurity • IoT • Micro-LLM • Innovation Labs
                </motion.p>

                <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="flex flex-wrap gap-4">
                  <Link
                    href="/innovation-lab"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#22D3EE] text-black font-semibold rounded-xl text-sm shadow-[0_0_26px_rgba(34,211,238,0.24)]"
                  >
                    <Zap size={16} /> Explore Innovation Lab
                  </Link>
                  <Link
                    href="/build-with-us"
                    className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#22D3EE]/40 text-[#22D3EE] rounded-xl text-sm hover:shadow-[0_0_24px_rgba(34,211,238,0.18)]"
                  >
                    <ArrowRight size={16} /> Build With BL4CKDOT
                  </Link>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative h-[430px] lg:h-[620px] flex items-center justify-center"
              >
                <NetworkSphere />
              </motion.div>
            </div>
          </div>

          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-700">
            <span className="text-[10px] tracking-widest uppercase">Scroll to explore</span>
            <ChevronDown size={18} />
          </motion.div>
        </HeroAnimation>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-24"
        style={{ background: "#0A0F1E" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-[#8B5CF6] text-xs font-mono tracking-[0.3em] uppercase">Idea → Reality</span>
            <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white mt-3 tracking-[0.02em]">From Idea to System</h2>
          </motion.div>
          <div className="flex flex-col md:flex-row items-center justify-between">
            {[
              { step: "01", label: "Idea", color: "#22D3EE", icon: Lightbulb },
              { step: "02", label: "Research", color: "#38BDF8", icon: Microscope },
              { step: "03", label: "Mentorship", color: "#8B5CF6", icon: Network },
              { step: "04", label: "Prototype", color: "#22C55E", icon: CircuitBoard },
              { step: "05", label: "Product", color: "#F59E0B", icon: Rocket },
            ].map((item, i, arr) => (
              <div key={item.step} className="flex items-center">
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="flex flex-col items-center text-center w-28 space-y-2 my-4 md:my-0">
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.2 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: `${item.color}14`, border: `1px solid ${item.color}44`, boxShadow: `0 0 22px ${item.color}24` }}
                  >
                    <item.icon size={24} style={{ color: item.color }} />
                  </motion.div>
                  <div className="font-mono text-[9px] tracking-widest" style={{ color: item.color }}>{item.step}</div>
                  <div className="font-orbitron font-bold text-white text-xs tracking-wider">{item.label}</div>
                </motion.div>
                {i < arr.length - 1 && <div className="hidden md:block w-10 h-px mx-1" style={{ background: `linear-gradient(to right, ${item.color}50, ${arr[i + 1].color}50)` }} />}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-5">
              <span className="text-[#00F5FF] text-xs font-mono tracking-[0.3em] uppercase">Live Scan</span>
              <h2 className="font-orbitron font-black text-3xl text-white tracking-[0.02em]">Innovation Radar</h2>
              <p className="text-slate-500 leading-[1.6]">
                Real-time scan of active BL4CKDOT projects, research experiments, and IoT prototypes.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} className="flex justify-center">
              <InnovationRadar />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24" style={{ background: "#0A0F1E" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="text-[#FF3B3B] text-xs font-mono tracking-[0.3em] uppercase">Why BL4CKDOT</span>
            <h2 className="font-orbitron font-black text-3xl text-white mt-3 tracking-[0.02em]">Innovation-First vs Traditional Delivery</h2>
          </motion.div>
          <div className="glass-panel rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-6 py-4 font-mono text-[10px] text-slate-600 uppercase tracking-widest">Aspect</th>
                  <th className="px-6 py-4 font-mono text-[10px] text-slate-600 uppercase tracking-widest text-center">Traditional Firms</th>
                  <th className="px-6 py-4 font-orbitron text-[10px] text-[#22D3EE] uppercase tracking-widest text-center">BL4CKDOT</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Approach", "Client-service cycles", "Innovation-first ecosystem"],
                  ["Research", "Low investment", "Research-driven engineering"],
                  ["Mentorship", "Rare", "Student mentorship platform"],
                  ["Incubation", "Limited", "Idea incubation pipeline"],
                  ["Collaboration", "Closed", "Open collaboration network"],
                ].map((row, i) => (
                  <tr key={String(row[0])} className={`border-b border-slate-800/60 ${i % 2 === 0 ? "bg-[#0F172A]/30" : ""}`}>
                    <td className="px-6 py-3 text-slate-300">{row[0]}</td>
                    <td className="px-6 py-3 text-center text-slate-500">{row[1]}</td>
                    <td className="px-6 py-3 text-center text-[#22D3EE]">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 rounded-xl border border-[#22D3EE]/20 bg-[#050914]/70 p-5">
            <p className="text-xs font-mono tracking-widest text-[#22D3EE] uppercase">Real Scenario</p>
            <p className="text-slate-400 text-sm leading-[1.6] mt-2">
              A startup founder has an IoT idea but no engineering team. Traditional firms charge for isolated delivery. BL4CKDOT researches the concept, builds prototypes, collaborates with students, and grows an open innovation ecosystem around the product.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 bg-[#060B18]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <span className="text-[#22D3EE] text-xs font-mono tracking-[0.3em] uppercase">Vision</span>
            <h2 className="font-orbitron font-black text-3xl text-white mt-3 tracking-[0.02em]">Innovation Timeline</h2>
          </motion.div>
          <div className="relative pl-8 border-l border-[#22D3EE]/15 space-y-8">
            {timeline.map((item, i) => (
              <motion.div key={item.year} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="relative">
                <div className="absolute -left-[2.4rem] w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(34,211,238,0.14)", border: "1px solid rgba(34,211,238,0.5)" }}>
                  <div className="w-2 h-2 rounded-full bg-[#22D3EE]" />
                </div>
                <div className="glass-panel rounded-xl p-5 space-y-1.5 border border-[#22D3EE]/15">
                  <span className="font-orbitron font-black text-xl text-[#22D3EE]">{item.year}</span>
                  <h3 className="font-space font-bold text-white">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-[1.6]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}
