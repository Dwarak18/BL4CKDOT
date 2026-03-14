"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Cpu, Brain, Wifi, Layers, FlaskConical, Zap, ArrowRight, Activity } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

const research = [
  { id: "R-01", title: "Edge AI Inference Optimization", status: "Active", color: "#7C3AED", desc: "Deploying quantized LLMs on microcontrollers with sub-100ms latency." },
  { id: "R-02", title: "IoT Security Firmware Hardening", status: "Active", color: "#00F5FF", desc: "Secure boot, cryptographic attestation, and OTA update security for embedded devices." },
  { id: "R-03", title: "micro-LLM on Constrained Hardware", status: "Active", color: "#22C55E", desc: "1B-3B parameter models running GGUF format on Raspberry Pi and ESP32 targets." },
  { id: "R-04", title: "Zero-Knowledge Digital Identity", status: "Research", color: "#FF3B3B", desc: "Privacy-preserving credential systems using ZK-SNARKs for secure identity." },
  { id: "R-05", title: "Autonomous Vulnerability Detection", status: "Research", color: "#7C3AED", desc: "AI agents that autonomously scan codebases for security vulnerabilities." },
];

const hardware = [
  { name: "Raspberry Pi Cluster", desc: "4-node compute cluster running containerized AI workloads and edge inference", icon: Cpu },
  { name: "ESP32 IoT Nodes", desc: "Custom PCB IoT sensor nodes with secure firmware and cloud telemetry", icon: Wifi },
  { name: "Arduino Security Lab", desc: "Hardware security research platform for firmware extraction and analysis", icon: Layers },
  { name: "AI Accelerator Board", desc: "Custom-built edge AI inference board with neural processing unit", icon: Brain },
];

export default function InnovationLabPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
            style={{ background: "radial-gradient(ellipse, rgba(0,245,255,0.05) 0%, transparent 70%)" }} />
        </div>

        {/* Animated circuit lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {[...Array(8)].map((_, i) => (
            <div key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-[#00F5FF] to-transparent"
              style={{
                top: `${10 + i * 12}%`,
                left: 0, right: 0,
                animation: `scan ${3 + i * 0.5}s linear infinite`,
                animationDelay: `${i * 0.4}s`,
                opacity: 0.3 - i * 0.02,
              }} />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-3xl">
            <span className="text-[#00F5FF] text-xs font-mono tracking-[0.3em] uppercase">
              BL4CKDOT / Innovation Lab
            </span>
            <h1 className="font-orbitron font-black text-4xl sm:text-6xl text-white mt-4 mb-6 leading-tight">
              The R&D<br /><span className="gradient-text">Innovation Lab</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              Our internal research and development environment. Hardware prototypes, AI model experiments, IoT security research, and the systems we build before they become products.
            </p>
            <div className="flex gap-4 mt-8">
              <Link href="#research" className="btn-cyber flex items-center gap-2 px-6 py-3 bg-[#00F5FF] text-black font-bold rounded-lg text-sm">
                <FlaskConical size={16} /> View Research
              </Link>
              <Link href="/innovation-lab/submissions" className="btn-cyber flex items-center gap-2 px-6 py-3 border border-[#22C55E]/40 text-[#22C55E] rounded-lg text-sm">
                <Zap size={14} /> Submit Innovation
              </Link>
              <Link href="/apprenticeship" className="btn-cyber flex items-center gap-2 px-6 py-3 border border-[#00F5FF]/40 text-[#00F5FF] rounded-lg text-sm">
                Join the Lab <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lab Status */}
      <section className="py-16 bg-[#060B18] border-y border-[#00F5FF]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Active Experiments", value: "12", color: "#00F5FF" },
              { label: "Hardware Prototypes", value: "6", color: "#7C3AED" },
              { label: "AI Models Trained", value: "23", color: "#22C55E" },
              { label: "Research Papers", value: "4", color: "#FF3B3B" },
            ].map((s) => (
              <motion.div key={s.label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="text-center p-6 glass-panel rounded-xl">
                <Activity size={20} className="mx-auto mb-2" style={{ color: s.color }} />
                <p className="font-orbitron font-black text-3xl" style={{ color: s.color }}>{s.value}</p>
                <p className="text-slate-600 text-xs tracking-widest uppercase mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hardware Lab */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
          <span className="text-[#00F5FF] text-xs font-mono tracking-[0.3em] uppercase">Physical Lab</span>
          <h2 className="font-orbitron font-black text-3xl text-white mt-3">Hardware Prototypes</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hardware.map((hw, i) => {
            const Icon = hw.icon;
            return (
              <motion.div key={hw.name} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass-panel rounded-xl p-6 space-y-4 hover:border-[#00F5FF]/30 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-[#00F5FF]/10 flex items-center justify-center group-hover:bg-[#00F5FF]/20 transition-colors">
                  <Icon size={24} className="text-[#00F5FF]" />
                </div>
                <h3 className="font-space font-bold text-white">{hw.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{hw.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-[10px] text-[#22C55E] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" /> Online
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="py-24 bg-[#060B18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
              <span className="text-[#7C3AED] text-xs font-mono tracking-[0.3em] uppercase">AI Division</span>
              <h2 className="font-orbitron font-black text-3xl text-white">
                micro-LLM<br /><span style={{ color: "#7C3AED" }}>Research Track</span>
              </h2>
              <p className="text-slate-400 leading-relaxed">
                We research deploying small, capable language models on constrained hardware —
                making AI accessible to edge devices without cloud dependency.
              </p>
              <div className="space-y-3">
                {["1B param model on Raspberry Pi 4", "GGUF quantization pipeline", "Custom inference server", "Edge AI chatbot prototype"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                    <span className="text-slate-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
              <div className="glass-panel rounded-xl p-6 font-mono text-sm space-y-2 border-[#7C3AED]/30"
                style={{ boxShadow: "0 0 30px rgba(124,58,237,0.1)" }}>
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#7C3AED]/20">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <span className="text-slate-500 text-xs">bl4ckdot-inference@edge:~$</span>
                </div>
                {[
                  { cmd: "$ load_model --path ./models/bl4ck-1b.gguf", color: "#00F5FF" },
                  { cmd: "Loading model... ████████████ 100%", color: "#22C55E" },
                  { cmd: "Model loaded in 2.3s (RAM: 847MB)", color: "#94a3b8" },
                  { cmd: "$ run_inference --prompt 'Explain IoT security'", color: "#00F5FF" },
                  { cmd: "Tokens/sec: 14.2 | Latency: 70ms", color: "#7C3AED" },
                  { cmd: "▶ Output: IoT security involves...", color: "#e2e8f0" },
                ].map((line, i) => (
                  <div key={i} style={{ color: line.color }}>{line.cmd}</div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Active Research */}
      <section id="research" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
          <span className="text-[#22C55E] text-xs font-mono tracking-[0.3em] uppercase">Lab Status</span>
          <h2 className="font-orbitron font-black text-3xl text-white mt-3">Active Research</h2>
        </motion.div>

        <div className="space-y-4">
          {research.map((r, i) => (
            <motion.div key={r.id} variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true }} custom={i}
              className="glass-panel rounded-xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-[#00F5FF]/20 transition-all group">
              <div className="flex items-center gap-4 flex-1">
                <span className="font-mono text-xs text-slate-600 w-12 shrink-0">{r.id}</span>
                <div>
                  <h3 className="font-space font-semibold text-white group-hover:text-[#00F5FF] transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">{r.desc}</p>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-mono shrink-0"
                style={{ color: r.color, background: `${r.color}15`, border: `1px solid ${r.color}40` }}>
                {r.status}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* IoT Layer showcase */}
      <section className="py-24 bg-[#060B18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-[#00F5FF] text-xs font-mono tracking-[0.3em] uppercase">Architecture</span>
            <h2 className="font-orbitron font-black text-3xl text-white mt-3">IoT System Stack</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { layer: "Physical Layer", items: ["Sensors", "Actuators", "Microcontrollers"], color: "#00F5FF" },
              { layer: "Edge Layer", items: ["Secure Gateway", "Local AI", "Protocol Bridge"], color: "#7C3AED" },
              { layer: "Cloud Layer", items: ["MQTT Broker", "Time-series DB", "Analytics API"], color: "#22C55E" },
            ].map((l, i) => (
              <motion.div key={l.layer} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass-panel rounded-xl p-6 text-center space-y-4">
                <div className="w-3 h-3 rounded-full mx-auto" style={{ background: l.color, boxShadow: `0 0 10px ${l.color}` }} />
                <h3 className="font-orbitron text-sm font-bold" style={{ color: l.color }}>{l.layer}</h3>
                <div className="space-y-2">
                  {l.items.map((item) => (
                    <div key={item} className="text-sm text-slate-500 border border-slate-800 rounded px-3 py-1.5">
                      {item}
                    </div>
                  ))}
                </div>
                {i < 2 && (
                  <Zap size={16} className="mx-auto text-slate-700" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
