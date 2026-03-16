"use client";
import { useEffect, useRef, useState } from "react";
import type { IntroStage } from "@/hooks/useIntroTimeline";
import { STAGE_COLORS } from "@/hooks/useIntroTimeline";
import type { MutableRefObject } from "react";
import type { AnimValues } from "@/hooks/useIntroTimeline";

const STAGES_ORDER: IntroStage[] = [
  "stage1_birth",
  "stage2_nodes",
  "stage3_network",
  "stage4_sphere",
  "stage5_ecosystem",
];

interface Props {
  stage:      IntroStage;
  text:       string;
  stateRef:   MutableRefObject<AnimValues>;
}

export function IntroText({ stage, text, stateRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null!);
  const [opacity, setOpacity] = useState(0);
  const [translateY, setTranslateY] = useState(12);
  const lastText = useRef("");
  const rafRef   = useRef<number>(0);

  // Sync textOpacity from stateRef via rAF (no gsap import needed here)
  useEffect(() => {
    function tick() {
      const o = stateRef.current.textOpacity;
      // Animate toward target
      setOpacity(o);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stateRef]);

  // Slide-in on text change
  useEffect(() => {
    if (text !== lastText.current) {
      lastText.current = text;
      setTranslateY(12);
      const timer = setTimeout(() => setTranslateY(0), 16);
      return () => clearTimeout(timer);
    }
  }, [text]);

  if (stage === "homepage" || stage === "idle") return null;

  const color      = STAGE_COLORS[stage];
  const stageIndex = STAGES_ORDER.indexOf(stage);

  return (
    <div
      ref={containerRef}
      style={{
        position:    "fixed",
        bottom:      "8rem",
        left:        "50%",
        transform:   `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        transition:  "transform 0.5s ease",
        zIndex:       20,
        pointerEvents: "none",
        textAlign:   "center",
      }}
    >
      {/* Decorative line row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ width: 32, height: 1, background: color, opacity: 0.6 }} />
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
        <div style={{ width: 32, height: 1, background: color, opacity: 0.6 }} />
      </div>

      {/* Main text */}
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize:   13,
          fontWeight: 400,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color,
          textShadow: `0 0 30px ${color}60`,
          margin:     0,
          maxWidth:   480,
        }}
      >
        {text}
      </p>

      {/* Stage dot indicator */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14 }}>
        {STAGES_ORDER.map((s, i) => {
          const isActive = i === stageIndex;
          return (
            <div
              key={s}
              style={{
                width:        isActive ? 20 : 6,
                height:       6,
                borderRadius: 3,
                background:   isActive ? color : "rgba(255,255,255,0.2)",
                boxShadow:    isActive ? `0 0 8px ${color}80` : "none",
                transition:   "width 0.3s ease, background 0.3s ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
