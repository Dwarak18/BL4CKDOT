"use client";
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Stage = 1 | 2 | 3 | 4;

interface AnimNode {
  x: number; y: number;
  vx: number; vy: number;
  r: number; color: string;
  alpha: number; phase: number;
  cluster: number;
}

interface BgParticle {
  x: number; y: number;
  vx: number; vy: number;
  r: number; a: number;
}

const COLORS = ["#00F5FF", "#7C3AED", "#22C55E", "#F59E0B", "#FF3B3B"];

const STAGE_TEXT: Record<Stage, string> = {
  1: "Every innovation begins with a single idea.",
  2: "Ideas connect. Collaboration begins.",
  3: "A network of builders, thinkers, and innovators.",
  4: "The BL4CKDOT Innovation Ecosystem.",
};

export default function HeroAnimation({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState<Stage>(1);
  const [showCanvas, setShowCanvas] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  const stageRef = useRef<number>(1);
  const nodesRef = useRef<AnimNode[]>([]);
  const edgesRef = useRef<[number, number][]>([]);
  const bgRef = useRef<BgParticle[]>([]);
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const doneRef = useRef(false);

  const complete = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    cancelAnimationFrame(rafRef.current);
    setShowCanvas(false);
    setContentVisible(true);
    try { sessionStorage.setItem("bl4ck_hero_v2", "1"); } catch { /* ignore */ }
  };

  useEffect(() => {
    try {
      if (sessionStorage.getItem("bl4ck_hero_v2")) {
        doneRef.current = true;
        setShowCanvas(false);
        setContentVisible(true);
        return;
      }
    } catch { /* ignore */ }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const cx = W / 2;
    const cy = H / 2;

    // Initial single centre node
    nodesRef.current = [{
      x: cx, y: cy, vx: 1.3, vy: 0.75,
      r: 9, color: "#00F5FF",
      alpha: 0, phase: 0, cluster: 0,
    }];

    // Background ambient particles
    bgRef.current = Array.from({ length: 70 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.2 + 0.3, a: Math.random() * 0.18 + 0.04,
    }));

    // 5 cluster centres for stage 3
    const CC: [number, number][] = [
      [cx * 0.42, cy * 0.42], [cx * 0.42, cy * 1.58],
      [cx * 1.58, cy * 0.42], [cx * 1.58, cy * 1.58],
      [cx, cy * 0.85],
    ];

    function addEdges(idx: number) {
      const n = nodesRef.current[idx];
      nodesRef.current.forEach((o, i) => {
        if (i === idx) return;
        if ((n.x - o.x) ** 2 + (n.y - o.y) ** 2 < (W * 0.32) ** 2)
          edgesRef.current.push([i, idx]);
      });
    }

    function frame() {
      if (doneRef.current) return;
      rafRef.current = requestAnimationFrame(frame);

      const now = Date.now();
      const cs = stageRef.current;
      const nodes = nodesRef.current;
      const t = now / 1000;

      // Background
      ctx.fillStyle = "#070B14";
      ctx.fillRect(0, 0, W, H);

      // Subtle grid
      ctx.strokeStyle = "rgba(0,245,255,0.02)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 52) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 52) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Ambient particles
      bgRef.current.forEach(p => {
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,245,255,${p.a})`;
        ctx.fill();
      });

      // Stage 2 — spawn nodes
      if (cs === 2 && nodes.length < 22 && now - lastSpawnRef.current > 320) {
        lastSpawnRef.current = now;
        const ci = nodes.length % 5;
        const angle = Math.random() * Math.PI * 2;
        const dist = W * 0.16 + Math.random() * W * 0.26;
        nodes.push({
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 1.6,
          vy: (Math.random() - 0.5) * 1.6,
          r: 4 + Math.random() * 5,
          color: COLORS[ci],
          alpha: 0, phase: Math.random() * Math.PI * 2, cluster: ci,
        });
        addEdges(nodes.length - 1);
      }

      // Stage 3 — drift to clusters
      if (cs === 3) {
        const cnts = [0, 0, 0, 0, 0];
        nodes.forEach(n => {
          const ci = n.cluster % 5;
          const sa = (cnts[ci] / 4) * Math.PI * 2;
          const [ccx, ccy] = CC[ci];
          n.x += (ccx + Math.cos(sa) * 58 - n.x) * 0.03;
          n.y += (ccy + Math.sin(sa) * 58 - n.y) * 0.03;
          n.vx = 0; n.vy = 0;
          cnts[ci]++;
        });
      }

      // Stage 4 — sphere ring formation
      if (cs === 4) {
        const total = nodes.length;
        const R = Math.min(W, H) * 0.28;
        nodes.forEach((n, i) => {
          const a = (i / total) * Math.PI * 2;
          n.x += (cx + Math.cos(a) * R - n.x) * 0.058;
          n.y += (cy + Math.sin(a) * R - n.y) * 0.058;
        });
      }

      // Draw edges + energy pulses
      edgesRef.current.forEach(([a, b]) => {
        if (a >= nodes.length || b >= nodes.length) return;
        const na = nodes[a], nb = nodes[b];
        if (na.alpha < 0.05 || nb.alpha < 0.05) return;
        const g = ctx.createLinearGradient(na.x, na.y, nb.x, nb.y);
        g.addColorStop(0, na.color + "2A");
        g.addColorStop(1, nb.color + "2A");
        ctx.beginPath(); ctx.moveTo(na.x, na.y); ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = g; ctx.lineWidth = 1; ctx.stroke();
        // Pulse
        if (cs >= 2) {
          const pt = ((t * 0.52 + (a + b) * 0.31) % 1.0);
          const px = na.x + (nb.x - na.x) * pt;
          const py = na.y + (nb.y - na.y) * pt;
          ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = na.color + "BB"; ctx.fill();
        }
      });

      // Draw nodes
      nodes.forEach(n => {
        n.alpha = Math.min(1, n.alpha + 0.022);
        if (cs <= 2) {
          n.x += n.vx; n.y += n.vy;
          const P = 56;
          if (n.x < P || n.x > W - P) n.vx *= -1;
          if (n.y < P || n.y > H - P) n.vy *= -1;
          n.x = Math.max(P, Math.min(W - P, n.x));
          n.y = Math.max(P, Math.min(H - P, n.y));
        }
        const pulse = 1 + Math.sin(t * 2.4 + n.phase) * 0.16;
        const r = n.r * pulse;
        // Glow halo
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5.5);
        glow.addColorStop(0, n.color + "CC");
        glow.addColorStop(0.35, n.color + "44");
        glow.addColorStop(1, "transparent");
        ctx.globalAlpha = n.alpha;
        ctx.beginPath(); ctx.arc(n.x, n.y, r * 5.5, 0, Math.PI * 2);
        ctx.fillStyle = glow; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.color; ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    frame();

    const t1 = setTimeout(() => { stageRef.current = 2; setStage(2); }, 2400);
    const t2 = setTimeout(() => { stageRef.current = 3; setStage(3); }, 5000);
    const t3 = setTimeout(() => { stageRef.current = 4; setStage(4); }, 7400);
    const t4 = setTimeout(complete, 9300);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Hero content — always in DOM, fades in after animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: contentVisible ? 1 : 0 }}
        transition={{ duration: 1 }}
        style={{ pointerEvents: contentVisible ? "auto" : "none" }}
      >
        {children}
      </motion.div>

      {/* Canvas overlay — covers full section during animation */}
      <AnimatePresence>
        {showCanvas && (
          <motion.div
            className="absolute inset-0 z-50 overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <canvas
              ref={canvasRef}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            />

            {/* Stage narrative text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.p
                  key={stage}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.55 }}
                  className="font-orbitron text-base sm:text-xl text-[#00F5FF] tracking-widest text-center px-8 max-w-2xl"
                  style={{ textShadow: "0 0 24px rgba(0,245,255,0.55)" }}
                >
                  {STAGE_TEXT[stage]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Stage progress indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-none">
              {([1, 2, 3, 4] as Stage[]).map(s => (
                <div
                  key={s}
                  style={{
                    width: 28,
                    height: 2,
                    borderRadius: 2,
                    background: stage >= s ? "#00F5FF" : "rgba(0,245,255,0.15)",
                    boxShadow: stage >= s ? "0 0 8px #00F5FF" : "none",
                    transition: "all 0.4s ease",
                  }}
                />
              ))}
            </div>

            {/* Skip button */}
            <button
              onClick={complete}
              className="absolute top-6 right-6 font-mono text-[10px] tracking-widest text-slate-500 hover:text-[#00F5FF] border border-slate-700 hover:border-[#00F5FF]/40 px-3 py-1.5 rounded transition-all duration-200"
            >
              SKIP →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
