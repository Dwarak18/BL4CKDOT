"use client";
import { useEffect, useRef, useState } from "react";
import type { SignalPhaseState } from "@/hooks/useSignalFieldTimeline";

const PHASE_COLORS: Record<number, string> = {
  1: "#00f5ff",
  2: "#bf5fff",
  3: "#39ff14",
  4: "#00f5ff",
};

interface Props {
  stateRef: React.RefObject<SignalPhaseState>;
  phase:    number;
  text:     string;
}

export default function PhaseText({ stateRef, phase, text }: Props) {
  const [opacity,    setOpacity]    = useState(0);
  const [translateY, setTranslateY] = useState(12);
  const rafRef   = useRef<number>(0);
  const lastText = useRef("");

  // Sync textOpacity from GSAP stateRef every frame (no re-render spam)
  useEffect(() => {
    const tick = () => {
      setOpacity(stateRef.current?.textOpacity ?? 0);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stateRef]);

  // Slide-in when text changes
  useEffect(() => {
    if (text !== lastText.current && text) {
      lastText.current = text;
      setTranslateY(12);
      const id = setTimeout(() => setTranslateY(0), 16);
      return () => clearTimeout(id);
    }
  }, [text]);

  if (phase < 1 || phase > 4 || !text) return null;

  const color = PHASE_COLORS[phase] ?? "#00f5ff";

  return (
    <div
      style={{
        position:      "fixed",
        bottom:         "8rem",
        left:           "50%",
        transform:     `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        transition:    "transform 0.5s ease",
        zIndex:         20,
        pointerEvents: "none",
        textAlign:     "center",
      }}
    >
      {/* Decorative row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ width: 32, height: 1, background: color, opacity: 0.6 }} />
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
        <div style={{ width: 32, height: 1, background: color, opacity: 0.6 }} />
      </div>

      <p
        style={{
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:       13,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color,
          textShadow:    `0 0 30px ${color}60`,
          margin:         0,
          maxWidth:       480,
        }}
      >
        {text}
      </p>

      {/* Phase progress dots */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14 }}>
        {[1, 2, 3, 4].map((p) => {
          const active = p === phase;
          return (
            <div
              key={p}
              style={{
                width:        active ? 20 : 6,
                height:       6,
                borderRadius: 3,
                background:   active ? color : "rgba(255,255,255,0.2)",
                boxShadow:    active ? `0 0 8px ${color}80` : "none",
                transition:   "width 0.3s ease, background 0.3s ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
