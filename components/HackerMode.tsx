"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COMMANDS: Record<string, string[]> = {
  help: [
    "╔══════════════════════════════════════════════╗",
    "║         BL4CKDOT TERMINAL v2.0.4             ║",
    "╚══════════════════════════════════════════════╝",
    "",
    "Available commands:",
    "  help         → Show this message",
    "  projects     → List all BL4CKDOT projects",
    "  innovation   → Open innovation submission portal",
    "  apply        → Join apprenticeship program",
    "  research     → View research areas",
    "  terminal     → Advanced Linux terminal (auth required)",
    "  contact      → Contact information",
    "  clear        → Clear terminal",
    "  exit         → Close terminal",
  ],
  projects: [
    "► ACTIVE PROJECTS",
    "──────────────────────────────────────────────",
    " [1] Secure Certificate Verification System   RELEASED",
    " [2] IoT Device Authentication Network        DEV",
    " [3] AI Study Assistant (micro-LLM)            DEV",
    " [4] Cybersecurity Training Lab               RESEARCH",
    " [5] Edge AI Inference Engine                 RESEARCH",
    " [6] Secure Digital Identity Platform         DEV",
    "",
    "Type 'navigate /projects' to explore details.",
  ],
  innovation: [
    "► INNOVATION SUBMISSION PORTAL",
    "──────────────────────────────────────────────",
    " Submit ideas by audience:",
    "  • students",
    "  • innovators",
    "  • companies",
    "",
    " >> Redirecting to /innovation-lab/submissions ...",
  ],
  apply: [
    "► APPRENTICESHIP PROGRAM",
    "──────────────────────────────────────────────",
    " Tracks available:",
    "  • Cybersecurity Engineering",
    "  • AI Development",
    "  • IoT Engineering",
    "  • Fullstack Development",
    "",
    " Flow: Apply → Skill Test → Training → Apprenticeship",
    "",
    " >> Redirecting to /apprenticeship ...",
  ],
  research: [
    "► ACTIVE RESEARCH AREAS",
    "──────────────────────────────────────────────",
    " [R-01] Edge AI systems inference optimization",
    " [R-02] IoT security firmware hardening",
    " [R-03] micro-LLM deployment on constrained hardware",
    " [R-04] Secure digital identity via zero-knowledge proofs",
    " [R-05] Autonomous vulnerability detection agents",
    "",
    "Type 'navigate /research' to read full papers.",
  ],
  contact: [
    "► CONTACT BL4CKDOT",
    "──────────────────────────────────────────────",
    " Email:    contact@bl4ckdot.dev",
    " Discord:  discord.gg/bl4ckdot",
    " GitHub:   github.com/bl4ckdot",
    "",
    "Type 'navigate /contact' to use the secure terminal form.",
  ],
  terminal: [
    "► ADVANCED TERMINAL MODE",
    "──────────────────────────────────────────────",
    " Authenticated users can access sandbox Linux sessions.",
    " Stack: WebSocket + node-pty + Docker sandbox.",
    "",
    " Contact admin to enable server-side terminal access.",
  ],
  clear: [],
  exit: ["Closing terminal session..."],
};

export default function HackerMode() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ type: "input" | "output"; text: string }[]>([
    { type: "output", text: "BL4CKDOT TERMINAL — v2.0.4" },
    { type: "output", text: "Type 'help' for available commands." },
    { type: "output", text: "" },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "b") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    setCmdHistory((prev) => [trimmed, ...prev]);
    setHistIndex(-1);

    const lines: { type: "output"; text: string }[] = [
      { type: "output", text: `> ${cmd}` },
    ];

    if (trimmed === "clear") {
      setHistory([{ type: "output", text: "" }]);
      setInput("");
      return;
    }

    if (trimmed === "exit") {
      lines.push({ type: "output", text: "Session terminated." });
      setHistory((prev) => [...prev, ...lines]);
      setInput("");
      setTimeout(() => setOpen(false), 600);
      return;
    }

    if (trimmed.startsWith("navigate ")) {
      const path = trimmed.replace("navigate ", "");
      lines.push({ type: "output", text: `Navigating to ${path}...` });
      setHistory((prev) => [...prev, ...lines]);
      setInput("");
      setTimeout(() => { window.location.href = path; }, 500);
      return;
    }

    const response = COMMANDS[trimmed];
    if (response) {
      response.forEach((l) => lines.push({ type: "output", text: l }));
      if (trimmed === "innovation") {
        setTimeout(() => {
          window.location.href = "/innovation-lab/submissions";
        }, 450);
      }
    } else {
      lines.push({ type: "output", text: `command not found: ${trimmed}` });
      lines.push({ type: "output", text: "Type 'help' for available commands." });
    }

    lines.push({ type: "output", text: "" });
    setHistory((prev) => [...prev, ...lines]);
    setInput("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="w-full max-w-4xl h-[580px] bg-[#060B18] border border-[#00F5FF]/40 rounded-lg flex flex-col overflow-hidden"
            style={{ boxShadow: "0 0 40px rgba(0,245,255,0.15), 0 0 80px rgba(0,245,255,0.05)" }}
          >
            {/* Terminal header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0F172A] border-b border-[#00F5FF]/20">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF3B3B]" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
                </div>
                <span className="font-orbitron text-xs text-[#00F5FF] tracking-widest">
                  BL4CKDOT TERMINAL — CTRL+B to toggle
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-500 hover:text-[#00F5FF] text-xs tracking-widest font-mono transition-colors"
              >
                [ESC]
              </button>
            </div>

            {/* Scan line overlay */}
            <div className="absolute inset-0 scan-overlay pointer-events-none z-10 rounded-lg" />

            {/* Output */}
            <div
              ref={terminalRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-0.5"
            >
              {history.map((line, i) => (
                <div
                  key={i}
                  className={`leading-relaxed whitespace-pre-wrap ${
                    line.text.startsWith(">")
                      ? "text-[#00F5FF]"
                      : line.text.startsWith("►")
                      ? "text-[#7C3AED] font-semibold"
                      : line.text.startsWith("╔") || line.text.startsWith("║") || line.text.startsWith("╚") || line.text.startsWith("━") || line.text.startsWith("──")
                      ? "text-[#00F5FF]/60"
                      : "text-[#94a3b8]"
                  }`}
                >
                  {line.text || "\u00A0"}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-[#00F5FF]/20 flex items-center gap-3">
              <span className="text-[#00F5FF] font-mono text-sm">root@bl4ckdot:~$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    runCommand(input);
                  } else if (e.key === "ArrowUp") {
                    const newIdx = Math.min(histIndex + 1, cmdHistory.length - 1);
                    setHistIndex(newIdx);
                    setInput(cmdHistory[newIdx] || "");
                  } else if (e.key === "ArrowDown") {
                    const newIdx = Math.max(histIndex - 1, -1);
                    setHistIndex(newIdx);
                    setInput(newIdx === -1 ? "" : cmdHistory[newIdx]);
                  }
                }}
                className="flex-1 bg-transparent outline-none text-[#00F5FF] font-mono text-sm caret-[#00F5FF]"
                placeholder="type a command..."
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
