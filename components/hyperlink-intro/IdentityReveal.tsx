"use client";
import { useEffect, useRef, useState } from "react";
import type { PhaseState } from "@/hooks/usePhaseTimeline";

interface Props {
  stateRef: React.RefObject<PhaseState>;
}

export default function IdentityReveal({ stateRef }: Props) {
  const [opacity, setOpacity] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    function tick() {
      setOpacity(stateRef.current?.titleOpacity ?? 0);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stateRef]);

  if (opacity <= 0.01) return null;

  return (
    <div
      style={{
        position:       "fixed",
        inset:           0,
        zIndex:          25,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        pointerEvents:  "none",
        opacity,
      }}
    >
      {/* BL4CKDOT wordmark */}
      <h1
        style={{
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      "clamp(2.8rem, 8vw, 5.5rem)",
          fontWeight:     700,
          letterSpacing: "0.3em",
          color:          "#00f5ff",
          textShadow:
            "0 0 40px rgba(0,245,255,0.7), 0 0 80px rgba(0,245,255,0.3), 0 0 120px rgba(0,245,255,0.1)",
          margin:         0,
          textTransform: "uppercase",
          lineHeight:     1,
        }}
      >
        BL4CKDOT
      </h1>

      {/* Decorative separator */}
      <div
        style={{
          display:        "flex",
          alignItems:     "center",
          gap:             12,
          margin:         "20px 0 16px",
        }}
      >
        <div style={{ width: 48, height: 1, background: "rgba(0,245,255,0.4)" }} />
        <div
          style={{
            width:        6,
            height:       6,
            borderRadius: "50%",
            background:   "#00f5ff",
            boxShadow:    "0 0 10px #00f5ff",
          }}
        />
        <div style={{ width: 48, height: 1, background: "rgba(0,245,255,0.4)" }} />
      </div>

      {/* Subtitle */}
      <p
        style={{
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:       11,
          letterSpacing: "0.28em",
          color:          "rgba(255,255,255,0.55)",
          textTransform: "uppercase",
          margin:         0,
        }}
      >
        Engineering the Future of Intelligent Systems
      </p>
    </div>
  );
}
