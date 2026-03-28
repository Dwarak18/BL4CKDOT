"use client";
import { useEffect, useRef } from "react";
import { getBezierControlPoint, getBezierPoint, drawBezierLine } from "@/utils/bezierPath";
import { updatePulses } from "@/utils/signalPulse";
import { hexToRgba } from "@/utils/colorSystem";
import type { FieldData } from "@/hooks/useSignalField";
import type { SignalPhaseState } from "@/hooks/useSignalFieldTimeline";

interface Props {
  stateRef:  React.RefObject<SignalPhaseState>;
  fieldRef:  React.RefObject<FieldData>;
  initField: (w: number, h: number) => void;
}

const DRAW_DURATION_MS = 300;   // ms to animate a connection drawing on
const NODE_FADE_MS     = 400;   // ms for a node to fade in

export default function SignalCanvas({ stateRef, fieldRef, initField }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const lastMsRef = useRef<number>(-1);
  const timeMsRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Sizing ───────────────────────────────────────────────────────────
    const setSize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    initField(canvas.width, canvas.height);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setSize();
        initField(canvas.width, canvas.height);
      }, 200);
    };
    window.addEventListener("resize", onResize);

    // ── Main rAF loop ────────────────────────────────────────────────────
    const loop = (nowMs: number) => {
      const last  = lastMsRef.current;
      const delta = last === -1 ? 0 : Math.min((nowMs - last) / 1000, 0.05);
      lastMsRef.current = nowMs;
      timeMsRef.current += delta;

      // Update canvas CSS opacity from stateRef (no React re-render)
      canvas.style.opacity = String(stateRef.current?.fieldOpacity ?? 0);

      const ctx = canvas.getContext("2d");
      if (ctx) drawFrame(ctx, canvas.width, canvas.height, timeMsRef.current, nowMs, delta);

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, [initField, stateRef]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Draw frame ─────────────────────────────────────────────────────────────
  function drawFrame(
    ctx:   CanvasRenderingContext2D,
    w:     number,
    h:     number,
    t:     number,    // elapsed seconds (for bezier breathing)
    nowMs: number,    // current timestamp (for draw-on / reveal progress)
    delta: number,    // frame delta seconds
  ) {
    const s     = stateRef.current;
    const field = fieldRef.current;
    if (!s || !field || field.nodes.length === 0) return;

    // 1. CLEAR
    ctx.clearRect(0, 0, w, h);

    // 2. BACKGROUND — subtle radial gradient (not pure black)
    const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.8);
    bg.addColorStop(0, "#0A1628");
    bg.addColorStop(1, "#070B14");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // 3. CAMERA DRIFT — wrap all drawing in a single save/restore
    ctx.save();
    ctx.translate(
      Math.sin(t * 0.08) * 15,
      Math.cos(t * 0.06) * 10,
    );

    const { nodes, connections } = field;

    // 4. CONNECTIONS (bezier curves with draw-on animation)
    for (let ci = 0; ci < connections.length; ci++) {
      const conn = connections[ci];
      if (conn.drawStart === -1) continue;

      const drawProgress = Math.min(1, (nowMs - conn.drawStart) / DRAW_DURATION_MS);
      if (drawProgress <= 0) continue;

      const p0 = nodes[conn.from];
      const p1 = nodes[conn.to];
      if (!p0 || !p1) continue;

      const cp = getBezierControlPoint(p0, p1, t, conn.cpOffset, conn.cpSign);

      // No shadowBlur on lines — opacity only (spec rule)
      ctx.strokeStyle = hexToRgba(conn.color, drawProgress * s.lineOpacity * 0.40);
      ctx.lineWidth   = conn.weight;
      drawBezierLine(ctx, p0, p1, cp, drawProgress);
    }

    // 5. SIGNAL PULSES (update t values, then draw)
    updatePulses(field.pulses, delta);
    for (let pi = 0; pi < field.pulses.length; pi++) {
      const pulse = field.pulses[pi];
      const conn  = connections[pulse.connectionIdx];
      if (!conn || conn.drawStart === -1) continue;

      const p0 = nodes[conn.from];
      const p1 = nodes[conn.to];
      if (!p0 || !p1) continue;

      const cp    = getBezierControlPoint(p0, p1, t, conn.cpOffset, conn.cpSign);
      const pos   = getBezierPoint(p0, p1, cp, pulse.t);
      const fade  = Math.sin(pulse.t * Math.PI);       // fade in/out at ends
      const alpha = fade * s.pulseOpacity * 0.85;
      if (alpha < 0.01) continue;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pulse.radius, 0, Math.PI * 2);
      ctx.fillStyle   = hexToRgba(pulse.color, alpha);
      ctx.shadowColor = pulse.color;
      ctx.shadowBlur  = 8;    // MAX 8px per spec
      ctx.fill();
      ctx.shadowBlur  = 0;    // ALWAYS reset immediately
    }

    // 6. NODES
    for (let ni = 0; ni < nodes.length; ni++) {
      const node = nodes[ni];
      if (node.revealAt === -1) continue;

      const revealAlpha = Math.min(1, (nowMs - node.revealAt) / NODE_FADE_MS);
      const alpha       = revealAlpha * s.nodeOpacity * 0.8;
      if (alpha < 0.01) continue;

      // Breathing: radius oscillates — position is FIXED
      const r = node.baseRadius + Math.sin(t * node.breathFreq + node.breathPhase) * 1.5;

      ctx.beginPath();
      ctx.arc(node.x, node.y, Math.max(0.5, r), 0, Math.PI * 2);
      ctx.fillStyle   = hexToRgba(node.color, alpha);
      ctx.shadowColor = node.color;
      ctx.shadowBlur  = 10;   // MAX 10px per spec
      ctx.fill();
      ctx.shadowBlur  = 0;    // ALWAYS reset immediately

      // Hub nodes: outer accent ring
      if (node.connectivity >= 4) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 3, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(node.color, alpha * 0.25);
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }

    ctx.restore();
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
        opacity:        0,  // updated imperatively in the rAF loop
      }}
    />
  );
}
