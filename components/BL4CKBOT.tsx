"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

type Message = { role: "user" | "bot"; text: string };

const RESPONSES: { patterns: string[]; reply: string }[] = [
  {
    patterns: ["project", "build", "make", "create"],
    reply:
      "BL4CKDOT builds:\n• Secure Certificate Verification Systems\n• IoT Device Authentication Networks\n• AI Study Assistants powered by micro-LLM\n• Cybersecurity Training Labs\n• Edge AI Inference Engines\n\nCheck /projects for full details.",
  },
  {
    patterns: ["join", "apprenticeship", "apply", "intern", "student"],
    reply:
      "To join BL4CKDOT's apprenticeship:\n1. Visit /apprenticeship and create an account\n2. Complete the skill assessment test\n3. Choose your track: Cybersecurity, AI, IoT, or Fullstack\n4. Train → Build → Ship\n\nWe accept passionate students at all levels!",
  },
  {
    patterns: ["iot", "device", "hardware", "firmware", "embedded"],
    reply:
      "BL4CKDOT IoT research focuses on:\n• Secure firmware development\n• Edge computing architectures\n• Device authentication protocols\n• Embedded AI systems\n• IoT network security hardening",
  },
  {
    patterns: ["cybersecurity", "security", "hack", "pentest", "vulnerability", "vapt"],
    reply:
      "Our Cybersecurity Division specializes in:\n• Vulnerability Assessment & Penetration Testing\n• Bug bounty research programs\n• Secure architecture design\n• Threat intelligence systems\n• Security tool development\n\nVisit /cybersecurity for our full ops center.",
  },
  {
    patterns: ["ai", "llm", "model", "intelligence", "machine learning", "ml"],
    reply:
      "BL4CKDOT AI systems include:\n• micro-LLM research and deployment\n• Automation agents for workflows\n• Edge AI inference optimization\n• Data intelligence pipelines\n• AI-powered security tools",
  },
  {
    patterns: ["team", "member", "who", "founder"],
    reply:
      "The BL4CKDOT team:\n• Dwarak — Lead Architect\n• Sarvesh — AI Engineer\n• Anto — IoT Specialist\n• Deepak — Cybersecurity Analyst\n• Pranav Krishna — Fullstack Dev\n• Goutham — ML Researcher\n• Kalaiarasan — Embedded Systems\n• Dhanush — Security Researcher",
  },
  {
    patterns: ["contact", "reach", "email", "talk", "connect"],
    reply:
      "Reach BL4CKDOT:\n• Terminal contact: /contact\n• Email: contact@bl4ckdot.dev\n• GitHub: github.com/bl4ckdot\n• Or use CTRL+B for the terminal interface!",
  },
  {
    patterns: ["research", "lab", "innovation", "r&d"],
    reply:
      "Active BL4CKDOT research:\n• Edge AI systems on constrained hardware\n• IoT security firmware\n• micro-LLM deployment strategies\n• Zero-knowledge proof identity systems\n• Autonomous vulnerability detection agents\n\nVisit /research for publications.",
  },
  {
    patterns: ["hello", "hi", "hey", "greet", "what are you"],
    reply:
      "Hey! I'm BL4CKBOT, BL4CKDOT's AI assistant powered by our micro-LLM research.\n\nI can tell you about:\n• Our projects & research\n• How to join the apprenticeship\n• Cybersecurity & AI work\n• Team members\n\nWhat would you like to know?",
  },
  {
    patterns: ["product", "tool", "software"],
    reply:
      "BL4CKDOT product line:\n• Secure Certificate Verification (Released)\n• IoT Auth Network (Beta)\n• AI Study Assistant (Dev)\n• CyberTrain Lab Platform (Dev)\n\nVisit /products for full details.",
  },
];

function getReply(input: string): string {
  const lower = input.toLowerCase();
  for (const { patterns, reply } of RESPONSES) {
    if (patterns.some((p) => lower.includes(p))) return reply;
  }
  return "I'm not sure about that yet — my training is ongoing! 🤖\n\nTry asking about:\n• projects • apprenticeship • cybersecurity\n• AI / IoT research • team • contact";
}

export default function BL4CKBOT() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Welcome to BL4CKDOT.\nWhere ideas become real systems.\n\nI'm DOT — your AI guide. Ask me about our projects, research, or how to join the team.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setTyping(true);
    setTimeout(() => {
      const reply = getReply(text);
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
      setTyping(false);
    }, 800 + Math.random() * 400);
  };

  // Subtle scroll-follow
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const orbLift = Math.min(scrollY * 0.04, 36);

  return (
    <>
      {/* ── Floating Orb ──────────────────────────────────────── */}
      <div
        className="fixed bottom-6 right-6 z-[8000] select-none"
        style={{ transform: `translateY(-${orbLift}px)`, transition: "transform 0.15s ease-out" }}
      >
        {/* Tooltip */}
        {!open && (
          <div className="absolute bottom-full right-0 mb-2 font-mono text-[9px] text-[#7C3AED] bg-black/80 px-2 py-1 rounded border border-[#7C3AED]/30 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
            BL4CKBOT
          </div>
        )}

        <motion.div
          className="relative w-[56px] h-[56px] cursor-pointer group"
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          aria-label="Open DOT"
        >
          {/* Outermost ping rings */}
          {!open && (
            <>
              <span className="absolute inset-0 rounded-full animate-ping"
                style={{ background: "rgba(124,58,237,0.25)", animationDuration: "2s" }} />
              <span className="absolute inset-1 rounded-full animate-ping"
                style={{ background: "rgba(0,245,255,0.12)", animationDuration: "2.6s", animationDelay: "0.5s" }} />
            </>
          )}

          {/* Spinning accent ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-[#00F5FF]/30"
            animate={{ rotate: open ? 0 : 360 }}
            transition={{ repeat: open ? 0 : Infinity, duration: 6, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-1 rounded-full border border-[#7C3AED]/20"
            animate={{ rotate: open ? 0 : -360 }}
            transition={{ repeat: open ? 0 : Infinity, duration: 9, ease: "linear" }}
          />

          {/* Core orb */}
          <div
            className="absolute inset-2 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: "radial-gradient(circle at 38% 32%, #9F7AEA, #7C3AED 55%, #2D1D6E)",
              boxShadow: "0 0 18px rgba(124,58,237,0.9), 0 0 35px rgba(0,245,255,0.25), inset 0 0 12px rgba(0,245,255,0.1)",
            }}
          >
            {open
              ? <X size={18} className="text-white" />
              : (
                /* Digital eyes */
                <div className="flex gap-[3px] items-center">
                  <span className="block w-[6px] h-[4px] rounded-sm bg-[#00F5FF]"
                    style={{ boxShadow: "0 0 6px #00F5FF, 0 0 12px rgba(0,245,255,0.8)" }} />
                  <span className="block w-[6px] h-[4px] rounded-sm bg-[#00F5FF]"
                    style={{ boxShadow: "0 0 6px #00F5FF, 0 0 12px rgba(0,245,255,0.8)" }} />
                </div>
              )
            }
          </div>

          {/* Live indicator dot */}
          {!open && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#22C55E] border-2 border-black"
              style={{ boxShadow: "0 0 6px #22C55E" }} />
          )}
        </motion.div>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-[8000] w-[360px] h-[480px] flex flex-col rounded-xl overflow-hidden"
            style={{
              background: "rgba(6,11,24,0.97)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(124,58,237,0.4)",
              boxShadow: "0 0 30px rgba(124,58,237,0.2), 0 25px 60px rgba(0,0,0,0.6)",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#7C3AED]/20 border-b border-[#7C3AED]/30">
              {/* Mini orb avatar */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "radial-gradient(circle at 38% 32%, #9F7AEA, #7C3AED 55%, #2D1D6E)",
                  boxShadow: "0 0 10px rgba(124,58,237,0.7)",
                }}>
                <div className="flex gap-[2px] items-center">
                  <span className="block w-[4px] h-[3px] rounded-sm bg-[#00F5FF]" style={{ boxShadow: "0 0 4px #00F5FF" }} />
                  <span className="block w-[4px] h-[3px] rounded-sm bg-[#00F5FF]" style={{ boxShadow: "0 0 4px #00F5FF" }} />
                </div>
              </div>
              <div>
                <p className="font-orbitron text-sm text-[#8B5CF6] font-bold">DOT</p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] inline-block" />
                  AI Navigator Online
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto text-slate-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-[#7C3AED]/40 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <MessageCircle size={12} className="text-[#7C3AED]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/30 rounded-tr-none"
                        : "bg-[#0F172A] text-slate-300 border border-[#7C3AED]/20 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#7C3AED]/40 flex items-center justify-center">
                    <MessageCircle size={12} className="text-[#7C3AED]" />
                  </div>
                  <div className="bg-[#0F172A] border border-[#7C3AED]/20 rounded-xl rounded-tl-none px-3 py-2 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-[#7C3AED]/20 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask BL4CKBOT..."
                className="flex-1 bg-[#0F172A] border border-[#7C3AED]/30 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-[#7C3AED]/60 transition-colors"
              />
              <button
                onClick={send}
                className="w-9 h-9 rounded-lg bg-[#7C3AED] flex items-center justify-center hover:bg-[#7C3AED]/80 transition-colors flex-shrink-0"
              >
                <Send size={14} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
