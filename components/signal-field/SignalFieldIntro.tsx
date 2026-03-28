"use client";
import { useRef, useState, useEffect } from "react";
import { useSignalFieldTimeline } from "@/hooks/useSignalFieldTimeline";
import GlobeCanvas     from "./GlobeCanvas";
import PhaseText       from "./ui/PhaseText";
import HomepageContent from "./ui/HomepageContent";

// ── Master controller: BL4CKDOT Globe intro ───────────────────────────────────
// Pure Canvas 2D — no WebGL, no Three.js

export default function SignalFieldIntro() {
  const { stateRef, phase, textContent, uiVisible, skipToEnd } =
    useSignalFieldTimeline();

  // Track uiOpacity via rAF — no React state spam
  const [uiOpacity,   setUiOpacity]   = useState(0);
  const [overlayDone, setOverlayDone] = useState(false);
  const rafRef           = useRef<number>(0);
  const dissolveTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dissolveStarted  = useRef(false);

  // Sync uiOpacity from stateRef (rAF, zero re-renders)
  useEffect(() => {
    const tick = () => {
      const o = stateRef.current?.uiOpacity ?? 0;
      setUiOpacity(o);
      if (o >= 0.99 && !dissolveStarted.current) {
        dissolveStarted.current = true;
        dissolveTimer.current   = setTimeout(() => setOverlayDone(true), 1200);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (dissolveTimer.current) clearTimeout(dissolveTimer.current);
    };
  }, [stateRef]);

  if (overlayDone) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: "auto" }}>

      {/* Scan lines (CSS) — visible in phase 0 before canvas appears */}
      <div
        aria-hidden
        style={{
          position:      "absolute",
          inset:          0,
          zIndex:         1,
          pointerEvents: "none",
          overflow:      "hidden",
        }}
      >
        {[0, 33, 67].map((pct, i) => (
          <div
            key={i}
            style={{
              position:   "absolute",
              left:        0,
              right:       0,
              height:      2,
              background: "rgba(0,245,255,0.04)",
              top:        `${pct}%`,
              animation:  `sfScanLine ${12 + i * 4}s linear infinite`,
              animationDelay: `${-i * 3}s`,
            }}
          />
        ))}
        <style>{`
          @keyframes sfScanLine {
            0%   { transform: translateY(0); opacity: 0.04; }
            50%  { opacity: 0.07; }
            100% { transform: translateY(100vh); opacity: 0.04; }
          }
        `}</style>
      </div>

      {/* z-0: Globe canvas — grows from single dot into wire sphere */}
      <GlobeCanvas stateRef={stateRef} />

      {/* z-20: Cinematic phase text (phases 1–4) */}
      <PhaseText stateRef={stateRef} phase={phase} text={textContent} />

      {/* z-30: Homepage content fades in */}
      <HomepageContent opacity={uiOpacity} />

      {/* z-40: Skip button (hidden once UI is fully showing) */}
      {!uiVisible && (
        <button
          onClick={skipToEnd}
          style={{
            position:      "fixed",
            top:            24,
            right:          24,
            zIndex:         40,
            padding:       "8px 18px",
            background:    "rgba(255,255,255,0.04)",
            border:        "1px solid rgba(255,255,255,0.12)",
            borderRadius:   8,
            color:          "rgba(255,255,255,0.4)",
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:       10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor:         "pointer",
            transition:    "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color       = "rgba(255,255,255,0.8)";
            e.currentTarget.style.borderColor = "rgba(0,245,255,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color       = "rgba(255,255,255,0.4)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
          }}
        >
          Skip →
        </button>
      )}
    </div>
  );
}
