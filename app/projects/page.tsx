"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
import { ExternalLink, Filter, ArrowRight, Github } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

const projects = [
  {
    id: "P-001",
    name: "Secure Certificate Verification System",
    desc: "A blockchain-anchored digital certificate platform for tamper-proof issuance and instant verification. Prevents credential fraud using cryptographic audit trails.",
    problem: "Fake academic certificates are rampant. Traditional systems are easily forged.",
    solution: "Certificates anchored to an immutable ledger with QR-based instant verification.",
    stack: ["Next.js", "Node.js", "MongoDB", "Smart Contracts", "JWT"],
    status: "released",
    category: "Web",
    color: "#22C55E",
    team: ["Dwarak", "Pranav Krishna", "Goutham"],
  },
  {
    id: "P-002",
    name: "IoT Device Authentication Network",
    desc: "Mutual TLS and hardware attestation framework ensuring only authenticated devices can join the network. Prevents rogue device attacks in IoT deployments.",
    problem: "IoT devices are easily spoofed or replaced with malicious nodes.",
    solution: "Hardware root-of-trust with device certificates and mutual TLS handshake.",
    stack: ["C/C++", "MQTT", "PKI", "Raspberry Pi", "OpenSSL"],
    status: "development",
    category: "IoT",
    color: "#00F5FF",
    team: ["Anto", "Kalaiarasan", "Deepak"],
  },
  {
    id: "P-003",
    name: "Micro-LLM AI Study Assistant",
    desc: "A local AI assistant running a quantized 1B parameter LLM on edge hardware. Students get intelligent study help without cloud dependency or data privacy risks.",
    problem: "Cloud AI assistants have latency, cost, and data privacy issues for students.",
    solution: "Quantized GGUF model running locally on Raspberry Pi with a web interface.",
    stack: ["Python", "GGUF", "llama.cpp", "FastAPI", "React"],
    status: "development",
    category: "AI",
    color: "#7C3AED",
    team: ["Sarvesh", "Goutham", "Dwarak"],
  },
  {
    id: "P-004",
    name: "CyberTrain Hacker Lab",
    desc: "A gamified cybersecurity training platform with CTF challenges, isolated Docker environments, automated flag validation, and a student leaderboard.",
    problem: "Most students lack access to safe, legal environments to practice hacking.",
    solution: "Containerized vulnerable apps with 20+ challenges and automated scoring.",
    stack: ["Docker", "Next.js", "Python", "PostgreSQL", "Redis"],
    status: "research",
    category: "Cybersecurity",
    color: "#FF3B3B",
    team: ["Deepak", "Dhanush", "Pranav Krishna"],
  },
  {
    id: "P-005",
    name: "Edge AI Inference Engine",
    desc: "Custom inference runtime optimizing transformer models for ARM microcontrollers. Achieves 5x speedup over vanilla llama.cpp on Raspberry Pi targets.",
    problem: "Existing LLM runtimes are not optimized for the constraints of edge hardware.",
    solution: "Custom kernel with ARM NEON intrinsics, layer fusing, and dynamic quantization.",
    stack: ["C++", "ARM NEON", "Python", "GGUF", "Raspberry Pi"],
    status: "research",
    category: "AI",
    color: "#7C3AED",
    team: ["Sarvesh", "Kalaiarasan"],
  },
  {
    id: "P-006",
    name: "Secure Digital Identity Platform",
    desc: "Privacy-preserving identity verification using zero-knowledge proofs. Users prove attributes (age, qualifications) without revealing underlying data.",
    problem: "Current identity systems require sharing excessive personal data.",
    solution: "ZK-SNARK based credential system allowing selective disclosure.",
    stack: ["Rust", "ZK-SNARKs", "Node.js", "React", "Blockchain"],
    status: "research",
    category: "Cybersecurity",
    color: "#FF3B3B",
    team: ["Dhanush", "Deepak", "Dwarak"],
  },
];

const CATEGORIES = ["All", "Web", "IoT", "AI", "Cybersecurity"];
const STATUSES = ["All", "released", "development", "research"];

export default function ProjectsPage() {
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<typeof projects[0] | null>(null);

  const filtered = projects.filter(
    (p) =>
      (catFilter === "All" || p.category === catFilter) &&
      (statusFilter === "All" || p.status === statusFilter)
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top, rgba(124,58,237,0.05) 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <span className="text-[#7C3AED] text-xs font-mono tracking-[0.3em] uppercase">BL4CKDOT / Projects</span>
            <h1 className="font-orbitron font-black text-4xl sm:text-6xl text-white mt-4 mb-6">
              What We <span className="gradient-text">Ship</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Real projects solving real problems. Every system here is built by students with production-grade engineering standards.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-black/80 backdrop-blur-lg border-b border-[#00F5FF]/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-600" />
            <span className="text-xs text-slate-600 font-mono">Category:</span>
            <div className="flex gap-1">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCatFilter(c)}
                  className={`text-xs px-3 py-1 rounded font-mono transition-all ${catFilter === c ? "bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/30" : "text-slate-500 hover:text-slate-300"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-mono">Status:</span>
            <div className="flex gap-1">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`text-xs px-3 py-1 rounded font-mono transition-all ${statusFilter === s ? "bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/30" : "text-slate-500 hover:text-slate-300"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj, i) => (
            <motion.div key={proj.id} variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true }} custom={i}
              onClick={() => setSelected(proj)}
              className="glass-panel rounded-xl p-6 space-y-4 cursor-pointer group hover:border-[#00F5FF]/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-slate-600">{proj.id}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-widest px-2 py-1 rounded font-mono"
                    style={{ color: proj.color, background: `${proj.color}15`, border: `1px solid ${proj.color}40` }}>
                    {proj.status}
                  </span>
                  <ExternalLink size={12} className="text-slate-700 group-hover:text-[#00F5FF] transition-colors" />
                </div>
              </div>
              <h3 className="font-space font-bold text-white group-hover:text-[#00F5FF] transition-colors leading-tight">
                {proj.name}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{proj.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {proj.stack.slice(0, 4).map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[#0F172A] text-slate-500 border border-slate-800 font-mono">
                    {t}
                  </span>
                ))}
                {proj.stack.length > 4 && (
                  <span className="text-[10px] text-slate-600 font-mono">+{proj.stack.length - 4}</span>
                )}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#00F5FF]/10">
                <span className="text-[10px] text-slate-600">Team: {proj.team.slice(0, 2).join(", ")}{proj.team.length > 2 ? ` +${proj.team.length - 2}` : ""}</span>
                <span className="text-xs text-[#00F5FF] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Details <ArrowRight size={10} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Project Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelected(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-panel rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ borderColor: `${selected.color}30` }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="text-[10px] font-mono text-slate-600">{selected.id}</span>
                <h2 className="font-orbitron font-black text-xl text-white mt-1">{selected.name}</h2>
              </div>
              <span className="text-[9px] uppercase tracking-widest px-2 py-1 rounded font-mono shrink-0"
                style={{ color: selected.color, background: `${selected.color}15`, border: `1px solid ${selected.color}40` }}>
                {selected.status}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-mono text-[#FF3B3B] tracking-widest uppercase mb-2">Problem</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{selected.problem}</p>
              </div>
              <div>
                <h3 className="text-xs font-mono text-[#22C55E] tracking-widest uppercase mb-2">Solution</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{selected.solution}</p>
              </div>
              <div>
                <h3 className="text-xs font-mono text-[#00F5FF] tracking-widest uppercase mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.stack.map((t) => (
                    <span key={t} className="text-xs px-3 py-1 rounded bg-[#0F172A] text-slate-300 border border-slate-700 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-mono text-[#7C3AED] tracking-widest uppercase mb-2">Team</h3>
                <div className="flex flex-wrap gap-2">
                  {selected.team.map((m) => (
                    <span key={m} className="text-xs px-3 py-1 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#00F5FF] text-black rounded-lg text-sm font-semibold">
                <Github size={14} /> View on GitHub
              </button>
              <button onClick={() => setSelected(null)}
                className="px-4 py-2 border border-slate-700 text-slate-400 rounded-lg text-sm hover:border-slate-500 transition-colors">
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
