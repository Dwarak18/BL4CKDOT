"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const bootLines = [
  { text: "INITIALIZING BL4CKDOT OS v2.0.4...", delay: 0, color: "#00F5FF" },
  { text: "[ OK ] Loading kernel modules", delay: 300, color: "#22C55E" },
  { text: "[ OK ] Mounting secure filesystem", delay: 600, color: "#22C55E" },
  { text: "Loading AI module........................", delay: 900, color: "#e2e8f0" },
  { text: "[ ONLINE ] AI Engine v3.1 — micro-LLM ready", delay: 1400, color: "#22C55E" },
  { text: "Loading IoT module.......................", delay: 1700, color: "#e2e8f0" },
  { text: "[ ONLINE ] IoT Network — 247 devices connected", delay: 2200, color: "#22C55E" },
  { text: "Loading Cybersecurity engine.............", delay: 2500, color: "#e2e8f0" },
  { text: "[ ONLINE ] Threat Intelligence active", delay: 3000, color: "#22C55E" },
  { text: "Loading Innovation Lab...................", delay: 3300, color: "#e2e8f0" },
  { text: "[ ONLINE ] Research systems nominal", delay: 3800, color: "#22C55E" },
  { text: "Authenticating session...................", delay: 4100, color: "#e2e8f0" },
  { text: "[ ACCESS GRANTED ]", delay: 4600, color: "#00F5FF" },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", delay: 4900, color: "#7C3AED" },
  { text: "WELCOME TO BL4CKDOT — ENGINEERING THE FUTURE", delay: 5200, color: "#00F5FF" },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", delay: 5400, color: "#7C3AED" },
];

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if boot was already shown this session
    const booted = sessionStorage.getItem("bl4ckdot_booted");
    if (booted) {
      onComplete();
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    bootLines.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
      }, bootLines[i].delay);
      timers.push(t);
    });

    // After last line + 800ms, fade out
    const lastDelay = bootLines[bootLines.length - 1].delay + 800;
    timers.push(
      setTimeout(() => {
        setDone(true);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            sessionStorage.setItem("bl4ckdot_booted", "1");
            onComplete();
          }, 700);
        }, 400);
      }, lastDelay)
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        >
          {/* Scan lines */}
          <div className="absolute inset-0 scan-overlay pointer-events-none" />

          {/* CRT effect edges */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 70%, rgba(0,0,0,0.8) 100%)"
            }}
          />

          <div className="relative w-full max-w-3xl px-6 py-8">
            {/* Header */}
            <div className="mb-6 border border-[#00F5FF]/30 rounded p-4 bg-[#00F5FF]/5">
              <p className="font-orbitron text-[#00F5FF] text-sm tracking-[0.3em] mb-1">
                BL4CKDOT SYSTEMS
              </p>
              <p className="font-mono text-slate-500 text-xs">
                BIOS v2.0.4 — Secure Boot Active — All modules encrypted
              </p>
            </div>

            {/* Boot lines */}
            <div className="font-mono text-sm space-y-1 min-h-[300px]">
              {bootLines.map((line, i) => (
                visibleLines.includes(i) && (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: line.color }}
                    className="leading-relaxed"
                  >
                    {line.text}
                  </motion.div>
                )
              ))}
              {/* Blinking cursor */}
              {!done && (
                <span className="inline-block w-2 h-4 bg-[#00F5FF] animate-[blink_1s_step-end_infinite]" />
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-6 h-1 bg-[#0F172A] rounded overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00F5FF] to-[#7C3AED]"
                initial={{ width: "0%" }}
                animate={{ width: done ? "100%" : `${(visibleLines.length / bootLines.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
