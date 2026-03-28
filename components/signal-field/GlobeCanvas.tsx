"use client";
import { useEffect, useRef } from "react";
import type { SignalPhaseState } from "@/hooks/useSignalFieldTimeline";

interface Props {
  stateRef: React.RefObject<SignalPhaseState>;
}

// ── Globe geometry — built once at module load ────────────────────────────────
const LAT_DEGS  = [-72, -48, -24, 0, 24, 48, 72];
const LON_COUNT = 16;
const R         = 170;
const FOCAL     = 420;

function ease(t: number) { return t < 0.5 ? 2*t*t : 1 - (-2*t+2)**2/2; }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function lerp(a: number, b: number, t: number) { return a + (b-a)*t; }

interface GlobeNode { x:number; y:number; z:number; stagger:number; latIdx:number; lonIdx:number; }
interface GlobeEdge { a:number; b:number; isLat:boolean; }

const NODES: GlobeNode[] = [];
const EDGES: GlobeEdge[] = [];
const IDX:   number[][]  = []; // IDX[latIdx][lonIdx] → node index

for (let li = 0; li < LAT_DEGS.length; li++) {
  const lat = LAT_DEGS[li] * Math.PI / 180;
  IDX.push([]);
  for (let lo = 0; lo < LON_COUNT; lo++) {
    const lon = (lo / LON_COUNT) * 2 * Math.PI;
    // Equatorial nodes (latIdx=3) appear first, polar last; small longitude spiral
    const stagger = (Math.abs(LAT_DEGS[li]) / 90) * 0.25 + (lo / LON_COUNT) * 0.08;
    IDX[li].push(NODES.length);
    NODES.push({
      x: R * Math.cos(lat) * Math.cos(lon),
      y: R * Math.sin(lat),
      z: R * Math.cos(lat) * Math.sin(lon),
      stagger,
      latIdx: li,
      lonIdx: lo,
    });
  }
}

// Latitude edges (horizontal rings)
for (let li = 0; li < LAT_DEGS.length; li++)
  for (let lo = 0; lo < LON_COUNT; lo++)
    EDGES.push({ a: IDX[li][lo], b: IDX[li][(lo+1) % LON_COUNT], isLat: true });

// Longitude edges (vertical arcs)
for (let lo = 0; lo < LON_COUNT; lo++)
  for (let li = 0; li < LAT_DEGS.length - 1; li++)
    EDGES.push({ a: IDX[li][lo], b: IDX[li+1][lo], isLat: false });

const MAX_STAGGER  = 0.33; // max stagger value — normalization denominator
const PULSE_COLORS = ['#00f5ff', '#7C3AED', '#22C55E', '#F59E0B', '#8B5CF6'];

interface Pulse { edge:number; t:number; speed:number; color:string; }

// ─────────────────────────────────────────────────────────────────────────────
export default function GlobeCanvas({ stateRef }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const lastMsRef  = useRef<number>(-1);
  const elapsedRef = useRef<number>(0);
  const rotYRef    = useRef<number>(0);
  const pulsesRef  = useRef<Pulse[]>(
    Array.from({ length: 24 }, (_, i) => ({
      edge:  Math.floor(i * EDGES.length / 24),
      t:     i / 24,
      speed: 0.12 + (i % 7) * 0.018,
      color: PULSE_COLORS[i % PULSE_COLORS.length],
    }))
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 200); };
    window.addEventListener("resize", onResize);

    const loop = (now: number) => {
      const last  = lastMsRef.current;
      const delta = last === -1 ? 0 : Math.min((now - last) / 1000, 0.05);
      lastMsRef.current  = now;
      elapsedRef.current += delta;

      const s = stateRef.current;
      canvas.style.opacity = String(s?.fieldOpacity ?? 0);

      const ctx = canvas.getContext("2d");
      if (ctx && s) drawFrame(ctx, canvas.width, canvas.height, s, delta);

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, [stateRef]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Draw frame (called from rAF — refs are always current) ─────────────────
  function drawFrame(
    ctx:   CanvasRenderingContext2D,
    w:     number,
    h:     number,
    s:     SignalPhaseState,
    delta: number,
  ) {
    ctx.clearRect(0, 0, w, h);

    // Background radial gradient
    const bg = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h) * 0.75);
    bg.addColorStop(0, "#0A1628");
    bg.addColorStop(1, "#070B14");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const elapsed = elapsedRef.current;

    // Globe center shifts right as homepage content fades in
    const uiP     = clamp(s.uiOpacity, 0, 1);
    const centerX = lerp(w / 2, w * 0.72, ease(uiP));
    const centerY = h / 2;

    // ── Phase 1: Origin dot (driven by originScale) ────────────────────────
    const dotScale = clamp(s.originScale, 0, 1);
    if (dotScale > 0.01) {
      const dotR  = dotScale * 5;
      const ringT = (elapsed * 0.7) % 1;
      const ringR = dotR + ringT * 60;
      const ringA = (1 - ringT) * 0.35 * dotScale;

      // Expanding pulse ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,245,255,${ringA})`;
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Core dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, dotR, 0, Math.PI * 2);
      ctx.fillStyle   = "#00f5ff";
      ctx.shadowColor = "#00f5ff";
      ctx.shadowBlur  = 22;
      ctx.fill();
      ctx.shadowBlur  = 0;
    }

    // Globe growth is controlled by lineOpacity (animates 0→1 in phase 2+)
    const growRaw = clamp(s.lineOpacity, 0, 1);
    if (growRaw < 0.01) return;

    // Slow Y-axis rotation
    rotYRef.current += 0.0008;
    const rotY = rotYRef.current;

    // ── Project all nodes ──────────────────────────────────────────────────
    type Proj = { sx:number; sy:number; rz:number; depthA:number; np:number; };
    const proj: Proj[] = new Array(NODES.length);

    for (let i = 0; i < NODES.length; i++) {
      const n  = NODES[i];
      // Each node has its own growth progress (staggered)
      const np = clamp((growRaw - n.stagger) / (1 - MAX_STAGGER), 0, 1);
      const p  = ease(np);

      // Lerp from origin (0,0,0) to sphere position
      const nx = lerp(0, n.x, p);
      const ny = lerp(0, n.y, p);
      const nz = lerp(0, n.z, p);

      // Y-axis rotation matrix
      const rx = nx * Math.cos(rotY) + nz * Math.sin(rotY);
      const ry = ny;
      const rz = -nx * Math.sin(rotY) + nz * Math.cos(rotY);

      // Perspective projection
      const scale  = FOCAL / (FOCAL + rz);
      // Depth fade: back of globe (rz > 0) is dimmer
      const depthA = clamp(0.5 + (R - rz) / (2 * R) * 0.5, 0.2, 1.0);

      proj[i] = {
        sx:     centerX + rx * scale,
        sy:     centerY - ry * scale, // flip Y (y↑ in 3D → y↑ on canvas)
        rz,
        depthA,
        np,
      };
    }

    // ── Draw edges ─────────────────────────────────────────────────────────
    for (let ei = 0; ei < EDGES.length; ei++) {
      const e  = EDGES[ei];
      const pa = proj[e.a];
      const pb = proj[e.b];
      if (pa.np < 0.02 || pb.np < 0.02) continue;

      const edgeProgress = Math.min(pa.np, pb.np);
      const depthFade    = (pa.depthA + pb.depthA) / 2;
      const baseOpacity  = (e.isLat ? 0.35 : 0.20) * depthFade * edgeProgress;

      ctx.beginPath();
      ctx.moveTo(pa.sx, pa.sy);
      ctx.lineTo(pb.sx, pb.sy);
      ctx.strokeStyle = `rgba(0,245,255,${baseOpacity})`;
      ctx.lineWidth   = 0.8;
      ctx.stroke();
    }

    // ── Draw pulse signals ─────────────────────────────────────────────────
    if (s.pulseOpacity > 0.01) {
      const pulses = pulsesRef.current;
      for (let pi = 0; pi < pulses.length; pi++) {
        const pulse = pulses[pi];
        pulse.t += pulse.speed * delta;
        if (pulse.t >= 1) {
          pulse.t    = 0;
          pulse.edge = Math.floor(Math.random() * EDGES.length);
        }
        const e  = EDGES[pulse.edge];
        const pa = proj[e.a];
        const pb = proj[e.b];
        if (pa.np < 0.5 || pb.np < 0.5) continue;

        const t   = pulse.t;
        const px  = lerp(pa.sx, pb.sx, t);
        const py  = lerp(pa.sy, pb.sy, t);
        const fd  = Math.sin(t * Math.PI) * s.pulseOpacity;
        const dA  = (pa.depthA + pb.depthA) / 2;

        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle   = pulse.color;
        ctx.globalAlpha = fd * dA * 0.85;
        ctx.shadowColor = pulse.color;
        ctx.shadowBlur  = 8;
        ctx.fill();
        ctx.shadowBlur  = 0;
        ctx.globalAlpha = 1;
      }
    }

    // ── Draw nodes (on top of edges) ───────────────────────────────────────
    for (let i = 0; i < NODES.length; i++) {
      const p = proj[i];
      if (p.np < 0.02) continue;

      const n     = NODES[i];
      // Hub nodes: equatorial ring, every 4th longitude
      const isHub = n.latIdx === 3 && n.lonIdx % 4 === 0;
      const r     = isHub ? 3.5 : 2;
      const color = isHub ? "#ffffff" : "#00f5ff";

      ctx.beginPath();
      ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
      ctx.fillStyle   = color;
      ctx.globalAlpha = p.np * p.depthA * 0.85;
      ctx.shadowColor = color;
      ctx.shadowBlur  = isHub ? 10 : 4;
      ctx.fill();
      ctx.shadowBlur  = 0;
      ctx.globalAlpha = 1;
    }
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "fixed",
        inset:          0,
        zIndex:         0,
        display:       "block",
        pointerEvents: "none",
        opacity:        0, // driven imperatively in rAF loop
      }}
    />
  );
}
