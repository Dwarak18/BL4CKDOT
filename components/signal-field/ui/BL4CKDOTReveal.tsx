"use client";
import { useEffect, useRef, useState } from "react";
import type { SignalPhaseState } from "@/hooks/useSignalFieldTimeline";

interface Props {
  stateRef: React.RefObject<SignalPhaseState>;
}

const LETTERS    = "BL4CKDOT".split("");
const LETTER_MS  = 60;   // stagger per letter
const TOTAL_ANIM = LETTERS.length * LETTER_MS + 400;  // ms until subtitle shows

export default function BL4CKDOTReveal({ stateRef }: Props) {
  const [opacity,     setOpacity]     = useState(0);
  const [showSub,     setShowSub]     = useState(false);
  const rafRef = useRef<number>(0);

  // Drive container opacity from GSAP stateRef
  useEffect(() => {
    const tick = () => {
      setOpacity(stateRef.current?.titleOpacity ?? 0);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stateRef]);

  // Subtitle appears after all letters are revealed
  useEffect(() => {
    if (opacity > 0.05 && !showSub) {
      const id = setTimeout(() => setShowSub(true), TOTAL_ANIM);
      return () => clearTimeout(id);
    }
  }, [opacity, showSub]);

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
      {/* Letter-by-letter BL4CKDOT */}
      <div
        style={{
          display:       "flex",
          letterSpacing: "0.4em",
          paddingLeft:   "0.4em", // compensate for letter-spacing on last char
        }}
      >
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            style={{
              fontFamily:    "'JetBrains Mono', monospace",
              fontSize:      "clamp(48px, 8vw, 96px)",
              fontWeight:     700,
              color:          "#ffffff",
              textShadow:
                "0 0 40px rgba(0,245,255,0.4), 0 0 80px rgba(0,245,255,0.15)",
              display:       "inline-block",
              opacity:        0,
              transform:     "translateY(10px)",
              animation:     `sfLetterAppear 0.4s ease-out ${i * LETTER_MS}ms forwards`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Separator */}
      <div
        style={{
          display:     "flex",
          alignItems:  "center",
          gap:          12,
          margin:      "20px 0 16px",
          opacity:      showSub ? 1 : 0,
          transition:  "opacity 0.5s ease",
        }}
      >
        <div style={{ width: 48, height: 1, background: "rgba(0,245,255,0.4)" }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00f5ff", boxShadow: "0 0 10px #00f5ff" }} />
        <div style={{ width: 48, height: 1, background: "rgba(0,245,255,0.4)" }} />
      </div>

      {/* Subtitle */}
      <p
        style={{
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:       11,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color:          "rgba(0,245,255,0.6)",
          margin:         0,
          opacity:        showSub ? 1 : 0,
          transition:    "opacity 0.5s ease",
        }}
      >
        Engineering the Future of Intelligent Systems
      </p>

      {/* Keyframe via <style> tag — avoids Tailwind/CSS module dependency */}
      <style>{`
        @keyframes sfLetterAppear {
          0%   { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0px);  }
        }
      `}</style>
    </div>
  );
}
