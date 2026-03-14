"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

type TerminalLine = { text: string; color?: string };

const PROMPTS = [
  "Enter your name:",
  "Enter your email:",
  "Enter message subject:",
  "Enter your message:",
];

export default function ContactPage() {
  const [phase, setPhase] = useState<"input" | "sent">("input");
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [values, setValues] = useState<string[]>([]);
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: "BL4CKDOT SECURE COMMS — v2.0.4", color: "#00F5FF" },
    { text: "End-to-end encrypted terminal", color: "#22C55E" },
    { text: "──────────────────────────────────", color: "#00F5FF" },
    { text: "" },
    { text: "Establishing secure session...", color: "#94a3b8" },
    { text: "[✔] TLS handshake complete", color: "#22C55E" },
    { text: "[✔] Identity verification passed", color: "#22C55E" },
    { text: "" },
    { text: PROMPTS[0], color: "#7C3AED" },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  useEffect(() => {
    termRef.current?.scrollTo({ top: termRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newValues = [...values, input.trim()];
    const addLines: TerminalLine[] = [{ text: `> ${input}`, color: "#00F5FF" }];

    if (step < PROMPTS.length - 1) {
      addLines.push({ text: "" });
      addLines.push({ text: PROMPTS[step + 1], color: "#7C3AED" });
      setValues(newValues);
      setLines((prev) => [...prev, ...addLines]);
      setStep(step + 1);
      setInput("");
    } else {
      // Final step - send
      const [name, email, subject, message] = newValues;
      addLines.push({ text: "" });
      addLines.push({ text: "Encrypting message...", color: "#94a3b8" });
      addLines.push({ text: "Transmitting to BL4CKDOT secure relay...", color: "#94a3b8" });
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, subject, message }),
        });
        if (!res.ok) throw new Error("Failed");
      } catch {
        addLines.push({ text: "[!] Transmission error. Retry shortly.", color: "#FF3B3B" });
        setValues(newValues);
        setLines((prev) => [...prev, ...addLines]);
        setInput("");
        return;
      }
      addLines.push({ text: "" });
      addLines.push({ text: "────────────────────────────────────────", color: "#7C3AED" });
      addLines.push({ text: "✔ MESSAGE TRANSMITTED TO BL4CKDOT", color: "#22C55E" });
      addLines.push({ text: "✔ Reference: #BL4CK-" + Math.floor(1000 + Math.random() * 9000), color: "#22C55E" });
      addLines.push({ text: "We will respond within 24 hours.", color: "#94a3b8" });
      addLines.push({ text: "────────────────────────────────────────", color: "#7C3AED" });
      setValues(newValues);
      setLines((prev) => [...prev, ...addLines]);
      setInput("");
      setPhase("sent");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top, rgba(0,245,255,0.04) 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-[#00F5FF] text-xs font-mono tracking-[0.3em] uppercase">Get In Touch</span>
            <h1 className="font-orbitron font-black text-4xl sm:text-6xl text-white mt-4 mb-6">
              Secure <span className="gradient-text">Contact</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Reach BL4CKDOT through our encrypted terminal interface. No forms. No fluff.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terminal */}
      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#060B18",
            border: "1px solid rgba(0,245,255,0.25)",
            boxShadow: "0 0 40px rgba(0,245,255,0.08), 0 0 80px rgba(0,0,0,0.6)",
          }}>
          {/* Window bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-[#0F172A] border-b border-[#00F5FF]/15">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF3B3B]" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
            </div>
            <span className="font-orbitron text-[10px] text-[#00F5FF] tracking-widest">
              BL4CKDOT-SECURE-TERMINAL
            </span>
            <span className="text-[10px] font-mono text-slate-600">128-bit AES</span>
          </div>

          {/* Scan overlay */}
          <div className="relative">
            <div className="absolute inset-0 scan-overlay pointer-events-none z-10 opacity-30" />

            {/* Output */}
            <div ref={termRef} className="p-6 font-mono text-sm space-y-0.5 min-h-[300px] max-h-[400px] overflow-y-auto">
              {lines.map((line, i) => (
                <div key={i} style={{ color: line.color || "#94a3b8" }} className="leading-relaxed">
                  {line.text || "\u00A0"}
                </div>
              ))}
            </div>

            {/* Input area */}
            {phase === "input" && (
              <form onSubmit={handleSubmit}
                className="px-6 pb-6 flex items-center gap-3 border-t border-[#00F5FF]/10 pt-4">
                <span className="text-[#00F5FF] font-mono text-sm">root@bl4ckdot:~$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-[#00F5FF] font-mono text-sm caret-[#00F5FF]"
                  placeholder=""
                  autoComplete="off"
                  spellCheck={false}
                />
                <button type="submit"
                  className="text-[10px] font-mono text-[#00F5FF]/50 hover:text-[#00F5FF] transition-colors border border-[#00F5FF]/20 px-2 py-1 rounded">
                  SEND
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Progress indicator */}
        {phase === "input" && (
          <div className="mt-4 flex justify-center gap-2">
            {PROMPTS.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i <= step ? "w-8 bg-[#00F5FF]" : "w-4 bg-slate-800"}`} />
            ))}
          </div>
        )}
      </section>

      {/* Contact info */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { label: "Email", value: "contact@bl4ckdot.dev", icon: "✉" },
            { label: "Discord", value: "discord.gg/bl4ckdot", icon: "◈" },
            { label: "GitHub", value: "github.com/bl4ckdot", icon: "⌥" },
          ].map((info) => (
            <div key={info.label} className="glass-panel rounded-xl p-6 text-center space-y-3 hover:border-[#00F5FF]/30 transition-all">
              <span className="text-2xl text-[#00F5FF]">{info.icon}</span>
              <p className="font-orbitron text-xs text-slate-500 tracking-widest uppercase">{info.label}</p>
              <p className="font-mono text-sm text-white">{info.value}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
