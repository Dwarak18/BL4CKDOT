"use client";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { FlaskConical, FileText, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

const papers = [
  {
    id: "BL4-R001",
    title: "Deploying Quantized LLMs on ARM Microcontrollers: A Practical Study",
    authors: ["Sarvesh", "Goutham", "Dwarak"],
    area: "AI / Edge Computing",
    status: "Draft",
    color: "#7C3AED",
    abstract: "We investigate the practical constraints and optimizations required to run 1-3B parameter quantized LLMs on Raspberry Pi 4 and similar ARM platforms. We present BL4CK-INFER, a custom inference runtime achieving 14 tokens/sec on Pi 4.",
  },
  {
    id: "BL4-R002",
    title: "Secure Firmware Architecture for Resource-Constrained IoT Devices",
    authors: ["Anto", "Kalaiarasan"],
    area: "IoT Security",
    status: "In Progress",
    color: "#00F5FF",
    abstract: "A systematic approach to implementing cryptographic attestation, secure boot, and over-the-air update authentication on ESP32 and similar microcontrollers with minimal performance overhead.",
  },
  {
    id: "BL4-R003",
    title: "Zero-Knowledge Credential Systems for Student Identity Verification",
    authors: ["Dhanush", "Deepak"],
    area: "Cryptography / Privacy",
    status: "Research",
    color: "#FF3B3B",
    abstract: "We propose a ZK-SNARK-based digital identity system enabling selective disclosure of academic credentials — provably demonstrating qualifications without exposing underlying personal data.",
  },
  {
    id: "BL4-R004",
    title: "Autonomous Vulnerability Detection Using LLM-Powered Agents",
    authors: ["Deepak", "Sarvesh", "Dhanush"],
    area: "AI Security",
    status: "Research",
    color: "#7C3AED",
    abstract: "Exploration of using instruction-tuned LLMs as autonomous security agents to scan source code for OWASP Top 10 vulnerability patterns in real-time CI/CD pipelines.",
  },
];

const areas = [
  { name: "Edge AI Systems", desc: "Inference optimization, quantization, and deployment on constrained devices." },
  { name: "IoT Security Firmware", desc: "Secure boot, attestation, encrypted OTA, and device certificate lifecycle." },
  { name: "micro-LLM Deployment", desc: "Training, fine-tuning, and serving small language models for real-world tasks." },
  { name: "Secure Digital Identity", desc: "ZK-proof based credentials, privacy-preserving authentication systems." },
  { name: "AI-Assisted Security", desc: "Using language models for automated vulnerability detection and threat analysis." },
  { name: "Network Security Protocols", desc: "Custom secure communication protocols for IoT and distributed systems." },
];

export default function ResearchPage() {
  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top, rgba(124,58,237,0.05) 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-3xl">
            <span className="text-[#7C3AED] text-xs font-mono tracking-[0.3em] uppercase">BL4CKDOT / Research</span>
            <h1 className="font-orbitron font-black text-4xl sm:text-6xl text-white mt-4 mb-6">
              Open <span className="gradient-text">Research</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Primary research conducted by BL4CKDOT across AI, IoT security, cryptography, and autonomous security systems. We publish findings openly to advance the field.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-16 bg-[#060B18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10">
            <h2 className="font-orbitron font-black text-2xl text-white">Research Areas</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {areas.map((area, i) => (
              <motion.div key={area.name} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass-panel rounded-xl p-5 space-y-2 hover:border-[#7C3AED]/30 transition-all">
                <div className="flex items-center gap-2">
                  <FlaskConical size={14} className="text-[#7C3AED]" />
                  <h3 className="font-space font-semibold text-white text-sm">{area.name}</h3>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{area.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Papers */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
          <span className="text-[#00F5FF] text-xs font-mono tracking-[0.3em] uppercase">Publications</span>
          <h2 className="font-orbitron font-black text-3xl text-white mt-3">Research Papers</h2>
        </motion.div>
        <div className="space-y-6">
          {papers.map((paper, i) => (
            <motion.div key={paper.id} variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true }} custom={i}
              className="glass-panel rounded-xl p-6 space-y-4 hover:border-[#00F5FF]/20 transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-[10px] text-slate-600">{paper.id}</span>
                    <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-mono"
                      style={{ color: paper.color, background: `${paper.color}15`, border: `1px solid ${paper.color}30` }}>
                      {paper.status}
                    </span>
                    <span className="text-[9px] text-slate-600 font-mono">{paper.area}</span>
                  </div>
                  <h3 className="font-space font-bold text-white text-base group-hover:text-[#00F5FF] transition-colors leading-snug">
                    {paper.title}
                  </h3>
                </div>
                <FileText size={18} className="text-slate-700 group-hover:text-[#00F5FF] transition-colors shrink-0" />
              </div>

              <p className="text-slate-500 text-sm leading-relaxed">{paper.abstract}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  {paper.authors.map((a) => (
                    <span key={a} className="text-[10px] px-2 py-0.5 rounded-full font-mono text-slate-500 border border-slate-800">
                      {a}
                    </span>
                  ))}
                </div>
                <button className="text-xs text-[#00F5FF] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read Draft <ArrowRight size={10} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
