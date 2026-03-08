"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Lock, Unlock, AlertTriangle, ShieldAlert, Eye } from "lucide-react";

const VAULT_PASSWORD = "bl4ckroot";

const classifiedItems = [
  {
    id: "CLASSIFIED-001",
    code: "PHANTOM-RECON",
    label: "Autonomous Network Mapper",
    level: "RESTRICTED",
    color: "#FF3B3B",
    desc: "Passive OS fingerprinting and topology discovery tool using crafted timing analysis. Does NOT send probe packets.",
    stack: ["Python", "Scapy", "AsyncIO"],
  },
  {
    id: "CLASSIFIED-002",
    code: "GHOST-SHELL",
    label: "Encrypted P2P Messaging Node",
    level: "SECRET",
    color: "#FF3B3B",
    desc: "Zero-knowledge end-to-end encrypted mesh communication using noise protocol framework. No central authority, no message metadata.",
    stack: ["Rust", "Noise Protocol", "libsodium"],
  },
  {
    id: "CLASSIFIED-003",
    code: "BL4CK-ORACLE",
    label: "LLM Security Reasoning Engine",
    level: "INTERNAL",
    color: "#7C3AED",
    desc: "In-house fine-tuned LLM for automated security advisory reasoning — trained on CVE datasets, NIST guidance, and internal pen-test reports.",
    stack: ["Python", "PyTorch", "GGUF"],
  },
  {
    id: "CLASSIFIED-004",
    code: "IOT-SPECTRAL",
    label: "Signal Anomaly Detection System",
    level: "INTERNAL",
    color: "#7C3AED",
    desc: "RF side-channel anomaly detector for unauthorized device discovery on 2.4GHz/5GHz bands using ML-based pattern classification.",
    stack: ["C", "RTL-SDR", "TensorFlow Lite"],
  },
  {
    id: "CLASSIFIED-005",
    code: "ZEROPROOF-ID",
    label: "ZK Credential Verification Engine",
    level: "EXPERIMENTAL",
    color: "#00F5FF",
    desc: "Live implementation of a Groth16 ZK-SNARK prover for academic credential verification. Integrates with BL4CK-CERT. Pending audit.",
    stack: ["Rust", "Bellman", "Solidity"],
  },
  {
    id: "CLASSIFIED-006",
    code: "MICRO-SAGE",
    label: "1B-Parameter On-Device Chatbot",
    level: "EXPERIMENTAL",
    color: "#00F5FF",
    desc: "Fully offline 1B parameter GGUF model running on Raspberry Pi 5. Power-optimized transformer inference with custom kv-cache management.",
    stack: ["C++", "llama.cpp", "ARM NEON"],
  },
];

const BOOT_LINES = [
  { delay: 0, text: "root@bl4ckdot-vault:~ # sudo mount /dev/vault" },
  { delay: 400, text: "Mounting encrypted partition... [OK]" },
  { delay: 800, text: "Loading AES-256-GCM keys... [OK]" },
  { delay: 1200, text: "Verifying integrity hash... [OK]" },
  { delay: 1600, text: "VAULT ACCESS READY. Awaiting authentication.\n" },
];

export default function RootPage() {
  const [phase, setPhase] = useState<"boot" | "lock" | "unlock" | "inside">("boot");
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [matrixCanvas, setMatrixCanvas] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Boot lines animation
  useEffect(() => {
    if (phase !== "boot") return;
    BOOT_LINES.forEach(({ delay, text }) => {
      setTimeout(() => setBootLines((prev) => [...prev, text]), delay);
    });
    setTimeout(() => setPhase("lock"), 2400);
  }, [phase]);

  // Focus input on lock phase
  useEffect(() => {
    if (phase === "lock") {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [phase]);

  // Matrix rain canvas
  useEffect(() => {
    if (!matrixCanvas || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.floor(canvas.width / 16);
    const drops: number[] = Array(cols).fill(1);
    const chars = "01アイウエオカキクケコBL4CKDOT#@$%&";

    const tick = setInterval(() => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00F5FF22";
      ctx.font = "13px monospace";
      drops.forEach((y, x) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = x % 5 === 0 ? "#00F5FF44" : "#00F5FF18";
        ctx.fillText(ch, x * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[x] = 0;
        drops[x]++;
      });
    }, 60);
    return () => clearInterval(tick);
  }, [matrixCanvas]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === VAULT_PASSWORD) {
      setPhase("unlock");
      setTimeout(() => {
        setPhase("inside");
        setMatrixCanvas(true);
      }, 1800);
    } else {
      setShake(true);
      setAttempt((a) => a + 1);
      setPassword("");
      setTimeout(() => setShake(false), 500);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Matrix canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: matrixCanvas ? 1 : 0, transition: "opacity 1s" }} />

      <AnimatePresence mode="wait">
        {/* BOOT phase */}
        {phase === "boot" && (
          <motion.div key="boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="relative z-10 font-mono text-sm text-[#00F5FF] max-w-xl w-full px-4">
            <div className="bg-black border border-[#00F5FF]/20 rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-[#00F5FF]/10 bg-[#060B18]">
                <div className="w-3 h-3 rounded-full bg-[#FF3B3B]/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-[#22C55E]/60" />
                <span className="text-[10px] text-slate-600 ml-auto">BL4CKDOT VAULT v1.0</span>
              </div>
              <div className="p-6 space-y-1 min-h-[180px]">
                {bootLines.map((l, i) => (
                  <p key={i} className="text-[#00F5FF] text-xs">{l}</p>
                ))}
                <span className="inline-block w-2 h-4 bg-[#00F5FF] animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}

        {/* LOCK phase */}
        {phase === "lock" && (
          <motion.div key="lock" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} className="relative z-10 max-w-sm w-full px-4">
            <div className="bg-[#060B18] border border-[#FF3B3B]/30 rounded-2xl overflow-hidden">
              <div className="flex flex-col items-center py-8 px-6 space-y-6">
                <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                  <ShieldAlert size={40} className="text-[#FF3B3B]" />
                </motion.div>
                <div className="text-center">
                  <p className="font-orbitron font-black text-white text-xl mb-1">VAULT ACCESS</p>
                  <p className="font-mono text-[10px] text-[#FF3B3B] tracking-[0.2em]">RESTRICTED ZONE — AUTHORIZED ONLY</p>
                </div>

                {attempt > 0 && (
                  <div className="flex items-center gap-2 text-[#FF3B3B] text-xs font-mono bg-[#FF3B3B]/10 border border-[#FF3B3B]/20 rounded px-3 py-2">
                    <AlertTriangle size={12} /> ACCESS DENIED — ATTEMPT {attempt}
                  </div>
                )}

                <motion.form onSubmit={handleUnlock} className="w-full space-y-3"
                  animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.3 }}>
                  <div className="flex items-center gap-2 border border-[#FF3B3B]/30 rounded-lg px-3 py-2 bg-black/40 focus-within:border-[#FF3B3B]/60">
                    <Lock size={14} className="text-[#FF3B3B]/60" />
                    <input ref={inputRef} type="password" placeholder="Vault passphrase..."
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="bg-transparent flex-1 text-[#FF3B3B] font-mono text-sm outline-none placeholder-[#FF3B3B]/20 tracking-widest" />
                  </div>
                  <button type="submit"
                    className="w-full py-2 rounded-lg font-orbitron text-xs tracking-widest text-black bg-[#FF3B3B] hover:bg-[#FF3B3B]/80 transition-colors">
                    AUTHENTICATE
                  </button>
                </motion.form>
                <p className="font-mono text-[9px] text-slate-700 text-center">
                  [Hint: The darkest root is also the site's name]
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* UNLOCK animation */}
        {phase === "unlock" && (
          <motion.div key="unlock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="relative z-10 text-center space-y-4">
            <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }} transition={{ duration: 1 }}>
              <Unlock size={48} className="text-[#22C55E] mx-auto" />
            </motion.div>
            <p className="font-orbitron text-[#22C55E] font-black text-xl tracking-widest">ACCESS GRANTED</p>
            <p className="font-mono text-xs text-slate-600">Decrypting vault contents...</p>
          </motion.div>
        )}

        {/* INSIDE vault */}
        {phase === "inside" && (
          <motion.div key="inside" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="relative z-10 w-full max-w-6xl px-4 sm:px-6 py-16 min-h-screen">
            {/* Header */}
            <div className="mb-12 text-center">
              <motion.div className="flex items-center justify-center gap-3 mb-4"
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <Eye size={20} className="text-[#00F5FF]" />
                <span className="font-mono text-[10px] text-[#00F5FF] tracking-[0.5em]">BL4CKDOT RESEARCH VAULT — CLASSIFIED</span>
                <Eye size={20} className="text-[#00F5FF]" />
              </motion.div>
              <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                className="font-orbitron font-black text-4xl sm:text-5xl text-white">
                INTERNAL <span style={{ color: "#00F5FF" }}>PROJECTS</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="text-slate-500 text-sm mt-4 font-mono max-w-xl mx-auto">
                Experimental and classified R&amp;D projects not listed on the public site. Shared internally for research and development continuity.
              </motion.p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {classifiedItems.map((item, i) => (
                <motion.div key={item.id}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
                  className="group relative rounded-xl p-5 space-y-4 overflow-hidden border transition-all cursor-default"
                  style={{ background: "#060B18", borderColor: `${item.color}20` }}
                  whileHover={{ borderColor: item.color + "60", y: -4 }}>
                  {/* Scan line */}
                  <motion.div className="absolute inset-x-0 h-px pointer-events-none"
                    style={{ background: `linear-gradient(to right, transparent, ${item.color}60, transparent)` }}
                    animate={{ top: ["10%", "90%", "10%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />

                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-[9px] text-slate-700">{item.id}</p>
                      <p className="font-mono font-bold text-sm mt-1" style={{ color: item.color }}>{item.code}</p>
                    </div>
                    <span className="text-[8px] uppercase tracking-widest px-2 py-0.5 rounded font-mono border"
                      style={{ color: item.color, borderColor: `${item.color}30`, background: `${item.color}10` }}>
                      {item.level}
                    </span>
                  </div>

                  <h3 className="font-space font-bold text-white text-sm leading-snug">{item.label}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {item.stack.map((s) => (
                      <span key={s} className="text-[9px] px-2 py-0.5 rounded font-mono text-slate-600 border border-slate-800">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `radial-gradient(ellipse at center, ${item.color}04, transparent 70%)` }} />
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
              className="mt-16 text-center font-mono text-[10px] text-slate-800">
              VAULT ENTRY LOGGED — SESSION ID: {Math.random().toString(36).substring(2, 10).toUpperCase()} — {new Date().toISOString()}
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
              className="text-center mt-2">
              <a href="/" className="font-mono text-[10px] text-slate-700 hover:text-[#00F5FF] transition-colors">
                ← EXIT VAULT
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
