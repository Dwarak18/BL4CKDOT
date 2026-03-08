"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Cpu, Shield, Globe, Zap } from "lucide-react";

const STEPS = [
  {
    id: 1,
    tag: "Origin",
    title: "A Single Dot",
    body: "It begins with one idea. One student. One spark of intent to build something real.",
    visual: "dot",
  },
  {
    id: 2,
    tag: "Network",
    title: "Expanding Into a Network",
    body: "The dot connects. Students link. Problems and solutions form an emergent web.",
    visual: "network",
  },
  {
    id: 3,
    tag: "Intelligence",
    title: "AI Systems Emerge",
    body: "Neural pathways activate. Micro-LLMs run at the edge. Intelligence without the cloud.",
    visual: "ai",
  },
  {
    id: 4,
    tag: "IoT",
    title: "Devices Come Online",
    body: "Firmware flashes. Sensors wake. The physical world becomes a programmable layer.",
    visual: "iot",
  },
  {
    id: 5,
    tag: "Security",
    title: "The Shield Activates",
    body: "Vulnerabilities found. Defenses harden. Security is engineered into every layer.",
    visual: "cyber",
  },
  {
    id: 6,
    tag: "Ecosystem",
    title: "BL4CKDOT Universe",
    body: "A living innovation lab. Research. Products. Students. All connected. All building.",
    visual: "ecosystem",
  },
];

// ── Step visuals ──────────────────────────────────────────────────────────────

function DotVisual() {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <motion.div
        className="relative"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div
          className="w-5 h-5 rounded-full bg-[#00F5FF]"
          style={{ boxShadow: "0 0 30px #00F5FF, 0 0 60px rgba(0,245,255,0.5)" }}
        />
      </motion.div>
      {[60, 100, 145].map((r, i) => (
        <motion.div
          key={r}
          className="absolute rounded-full border border-[#00F5FF]/20"
          style={{ width: r * 2, height: r * 2, marginTop: 0 }}
          animate={{ scale: [1, 1.02, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 + i * 0.4, delay: i * 0.3 }}
        />
      ))}
    </div>
  );
}

function NetworkVisual() {
  const R = 88;
  const cx = 140;
  const cy = 140;
  const nodeAngles = [0, 60, 120, 180, 240, 300];
  return (
    <div className="flex items-center justify-center w-full h-full">
      <motion.svg
        width="280"
        height="280"
        viewBox="0 0 280 280"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {nodeAngles.map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const nx = cx + R * Math.cos(rad);
          const ny = cy + R * Math.sin(rad);
          return (
            <motion.line
              key={`l${i}`}
              x1={cx} y1={cy} x2={nx} y2={ny}
              stroke="#00F5FF" strokeOpacity="0.3" strokeWidth="1"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          );
        })}
        {nodeAngles.map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const nx = cx + R * Math.cos(rad);
          const ny = cy + R * Math.sin(rad);
          return (
            <motion.circle
              key={`n${i}`} cx={nx} cy={ny} r="5"
              fill="#00F5FF" fillOpacity="0.7"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
              style={{ filter: "drop-shadow(0 0 4px #00F5FF)" }}
            />
          );
        })}
        <circle cx={cx} cy={cy} r="7" fill="#00F5FF" style={{ filter: "drop-shadow(0 0 8px #00F5FF)" }} />
      </motion.svg>
    </div>
  );
}

function AIVisual() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="w-28 h-28 rounded-2xl flex items-center justify-center"
          style={{
            background: "radial-gradient(circle at 40% 40%, rgba(124,58,237,0.4), rgba(6,11,24,0.9))",
            border: "1px solid rgba(124,58,237,0.5)",
            boxShadow: "0 0 40px rgba(124,58,237,0.4), inset 0 0 20px rgba(124,58,237,0.1)",
          }}
        >
          <Brain size={52} className="text-[#7C3AED]" style={{ filter: "drop-shadow(0 0 10px #7C3AED)" }} />
        </div>
        {/* Orbiting rings */}
        <motion.div
          className="absolute inset-0 rounded-full border border-[#7C3AED]/20"
          style={{ width: 160, height: 160, top: -16, left: -16 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
        />
        <motion.div
          className="absolute border border-[#00F5FF]/10 rounded-full"
          style={{ width: 200, height: 200, top: -36, left: -36 }}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
}

function IoTVisual() {
  const icons = [
    { Icon: Cpu,   color: "#00F5FF", angle: 0   },
    { Icon: Zap,   color: "#22C55E", angle: 72  },
    { Icon: Globe, color: "#F59E0B", angle: 144 },
    { Icon: Cpu,   color: "#7C3AED", angle: 216 },
    { Icon: Zap,   color: "#FF3B3B", angle: 288 },
  ];
  const R = 90;
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative w-[220px] h-[220px]">
        {icons.map(({ Icon, color, angle }, i) => {
          const rad = ((angle - 90) * Math.PI) / 180;
          const x = 110 + R * Math.cos(rad) - 16;
          const y = 110 + R * Math.sin(rad) - 16;
          return (
            <motion.div
              key={i}
              className="absolute w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                left: x,
                top: y,
                background: `${color}15`,
                border: `1px solid ${color}40`,
                boxShadow: `0 0 12px ${color}30`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Icon size={16} style={{ color }} />
            </motion.div>
          );
        })}
        {/* Center core */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.3)", boxShadow: "0 0 20px rgba(0,245,255,0.2)" }}
        >
          <div className="w-3 h-3 rounded-full bg-[#00F5FF]" style={{ boxShadow: "0 0 10px #00F5FF" }} />
        </div>
      </div>
    </div>
  );
}

function CyberVisual() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="w-32 h-32 flex items-center justify-center rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,59,59,0.15), rgba(6,11,24,0.9))",
            border: "1px solid rgba(255,59,59,0.4)",
            boxShadow: "0 0 50px rgba(255,59,59,0.3)",
          }}
        >
          <Shield size={56} className="text-[#FF3B3B]" style={{ filter: "drop-shadow(0 0 12px #FF3B3B)" }} />
        </div>
        {/* Scan line */}
        <motion.div
          className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF3B3B] to-transparent"
          animate={{ top: ["15%", "85%", "15%"] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
}

function EcosystemVisual() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
      <motion.div
        className="font-orbitron font-black text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-white text-3xl">BL4CK</span>
        <span
          className="text-3xl"
          style={{
            color: "#00F5FF",
            textShadow: "0 0 20px #00F5FF, 0 0 40px rgba(0,245,255,0.5)",
          }}
        >
          DOT
        </span>
      </motion.div>
      <motion.div
        className="flex gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {["AI", "IoT", "Cyber", "Research"].map((t, i) => (
          <motion.span
            key={t}
            className="text-[10px] font-mono px-2 py-1 rounded border"
            style={{ color: ["#7C3AED", "#00F5FF", "#FF3B3B", "#22C55E"][i], borderColor: ["#7C3AED40", "#00F5FF40", "#FF3B3B40", "#22C55E40"][i] }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            {t}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

const VISUALS: Record<string, React.ReactNode> = {
  dot:       <DotVisual />,
  network:   <NetworkVisual />,
  ai:        <AIVisual />,
  iot:       <IoTVisual />,
  cyber:     <CyberVisual />,
  ecosystem: <EcosystemVisual />,
};

// ── Main component ────────────────────────────────────────────────────────────

export default function ScrollStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect          = el.getBoundingClientRect();
      const scrolled      = -rect.top;
      const scrollable    = el.offsetHeight - window.innerHeight;
      const progress      = Math.max(0, Math.min(1, scrolled / scrollable));
      const newStep       = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
      setStep(newStep);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const current = STEPS[step];

  return (
    <section ref={sectionRef} className="relative" style={{ height: `${STEPS.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* Ambient glow bg */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700"
          style={{ background: `radial-gradient(ellipse at center, rgba(0,245,255,0.03) 0%, transparent 65%)` }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 w-full grid md:grid-cols-2 gap-16 items-center">
          {/* Text side */}
          <div className="space-y-6">
            {/* Step indicators */}
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className="h-0.5 flex-1 rounded-full transition-all duration-500"
                  style={{
                    background: i <= step ? "#00F5FF" : "rgba(255,255,255,0.08)",
                    boxShadow: i === step ? "0 0 8px rgba(0,245,255,0.6)" : "none",
                  }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <span className="font-mono text-[10px] tracking-[0.3em] text-[#00F5FF] uppercase">
                  {String(current.id).padStart(2, "0")} / {current.tag}
                </span>
                <h2 className="font-orbitron font-black text-white leading-tight"
                  style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
                  {current.title}
                </h2>
                <p className="text-slate-400 text-base leading-relaxed max-w-sm">
                  {current.body}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Scroll hint */}
            <p className="font-mono text-[9px] text-slate-700 tracking-widest uppercase">
              Scroll to continue →
            </p>
          </div>

          {/* Visual side */}
          <div className="relative h-[280px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                className="w-full h-full"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.08 }}
                transition={{ duration: 0.45 }}
              >
                {VISUALS[current.visual]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
