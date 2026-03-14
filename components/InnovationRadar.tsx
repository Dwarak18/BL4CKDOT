"use client";
import { useEffect, useRef, useState } from "react";

interface Blip {
  label: string;
  angleDeg: number;
  dist: number; // 0–1 fraction of maxR
  color: string;
}

const DEFAULT_BLIPS: Blip[] = [
  { label: "IoT Prototype",    angleDeg: 42,  dist: 0.62, color: "#00F5FF" },
  { label: "AI Model Training",angleDeg: 118, dist: 0.40, color: "#7C3AED" },
  { label: "Security Scan",    angleDeg: 205, dist: 0.75, color: "#FF3B3B" },
  { label: "Edge Deploy",      angleDeg: 295, dist: 0.52, color: "#22C55E" },
  { label: "ZK Research",      angleDeg: 258, dist: 0.30, color: "#F59E0B" },
];

export default function InnovationRadar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blips, setBlips] = useState<Blip[]>(DEFAULT_BLIPS);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/radar/activity");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && Array.isArray(data.blips) && data.blips.length > 0) {
          setBlips(data.blips);
        }
      } catch {
        // keep default fallback blips when backend is unavailable
      }
    };
    load();
    const interval = setInterval(load, 7000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 260;
    canvas.width  = SIZE;
    canvas.height = SIZE;
    const CX   = SIZE / 2;
    const CY   = SIZE / 2;
    const maxR = CX - 16;

    let sweep = 0;
    let raf: number;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, SIZE, SIZE);

      // ── Rings ──────────────────────────────────────────
      for (let r = 1; r <= 4; r++) {
        ctx.beginPath();
        ctx.arc(CX, CY, maxR * (r / 4), 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,245,255,0.08)";
        ctx.lineWidth   = 1;
        ctx.stroke();
      }

      // ── Cross-hair lines ───────────────────────────────
      ctx.strokeStyle = "rgba(0,245,255,0.07)";
      ctx.lineWidth   = 0.5;
      [[CX, 15, CX, SIZE - 15], [15, CY, SIZE - 15, CY]].forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      });

      // ── Sweep trail ────────────────────────────────────
      const trailLen = Math.PI * 0.55;
      const segments = 28;
      for (let k = 0; k < segments; k++) {
        const a0 = sweep - trailLen * ((k + 1) / segments);
        const a1 = sweep - trailLen * (k / segments);
        ctx.beginPath();
        ctx.moveTo(CX, CY);
        ctx.arc(CX, CY, maxR, a0, a1);
        ctx.closePath();
        ctx.fillStyle = `rgba(0,245,255,${((1 - k / segments) * 0.22)})`;
        ctx.fill();
      }

      // ── Sweep line ─────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(CX, CY);
      ctx.lineTo(CX + maxR * Math.cos(sweep), CY + maxR * Math.sin(sweep));
      ctx.strokeStyle = "rgba(0,245,255,0.8)";
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      // ── Blips ──────────────────────────────────────────
      blips.forEach((blip) => {
        const θ = (blip.angleDeg * Math.PI) / 180;
        const r = blip.dist * maxR;
        const x = CX + r * Math.cos(θ);
        const y = CY + r * Math.sin(θ);

        // How recently did the sweep pass this blip?
        let diff = ((sweep - θ) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const freshness = Math.max(0, 1 - diff / (Math.PI * 1.5));
        const alpha     = 0.35 + freshness * 0.65;
        const radius    = 3 + freshness * 2;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = blip.color;
        ctx.globalAlpha = alpha;
        ctx.fill();

        if (freshness > 0.5) {
          ctx.beginPath();
          ctx.arc(x, y, radius + 4 * freshness, 0, Math.PI * 2);
          ctx.strokeStyle = blip.color;
          ctx.lineWidth   = 0.8;
          ctx.globalAlpha = freshness * 0.5;
          ctx.stroke();
        }

        ctx.globalAlpha = 1;
      });

      // ── Center dot ─────────────────────────────────────
      ctx.beginPath();
      ctx.arc(CX, CY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#00F5FF";
      ctx.globalAlpha = 1;
      ctx.fill();

      sweep += 0.018;
      if (sweep > Math.PI * 2) sweep -= Math.PI * 2;
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [blips]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        style={{
          borderRadius: "50%",
          boxShadow: "0 0 30px rgba(0,245,255,0.08), inset 0 0 30px rgba(0,0,0,0.5)",
          border: "1px solid rgba(0,245,255,0.12)",
        }}
      />
      {/* Detection log */}
      <div className="space-y-1.5 w-full max-w-[260px]">
        {blips.map((b) => (
          <div key={b.label} className="flex items-center gap-2 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: b.color, boxShadow: `0 0 6px ${b.color}` }} />
            <span className="text-slate-600 tracking-wider uppercase">{b.label}</span>
            <span className="ml-auto text-slate-800">DETECTED</span>
          </div>
        ))}
      </div>
    </div>
  );
}
