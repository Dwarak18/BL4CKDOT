"use client";
import { useEffect, useRef, useState } from "react";
import { usePhaseTimeline } from "@/hooks/usePhaseTimeline";
import { useNodeSpawner }   from "@/hooks/useNodeSpawner";
import ScanLines            from "./environment/ScanLines";
import HyperlinkCanvas      from "./Canvas";
import PhaseText            from "./PhaseText";
import NodeLabels           from "./NodeLabels";
import IdentityReveal       from "./IdentityReveal";
import HomepageContent      from "./HomepageContent";

// ── Master controller for the BL4CKDOT Hyperlink-World intro animation ───────
// Phases 0-6 defined in constants/introConfig.ts & hooks/usePhaseTimeline.ts

export default function HyperlinkIntro() {
  const { stateRef, phase, textContent, labelsVisible, uiVisible, skipToEnd } =
    usePhaseTimeline();
  const { nodes, connections } = useNodeSpawner(phase);

  // Track uiOpacity for HomepageContent fade (rAF — no React setState spam)
  const [uiOpacity, setUiOpacity] = useState(0);
  const [overlayDone, setOverlayDone] = useState(false);
  const rafRef          = useRef<number>(0);
  const dissolveTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dissolveStarted = useRef(false);

  useEffect(() => {
    function tick() {
      const o = stateRef.current.uiOpacity;
      setUiOpacity(o);

      if (o >= 0.99 && !dissolveStarted.current) {
        dissolveStarted.current = true;
        // Give homepage UI a moment to be fully opaque, then remove overlay
        dissolveTimer.current = setTimeout(() => setOverlayDone(true), 1200);
      }

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (dissolveTimer.current) clearTimeout(dissolveTimer.current);
    };
  }, [stateRef]);

  // Once the intro overlay is done, unmount everything
  if (overlayDone) return null;

  return (
    <div
      style={{
        position:      "fixed",
        inset:          0,
        zIndex:         50,
        pointerEvents: "auto",
      }}
    >
      {/* z-1: Scan lines (2D canvas overlay) */}
      <ScanLines />

      {/* z-10: 3-D canvas (R3F) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
        <HyperlinkCanvas
          stateRef={stateRef}
          nodes={nodes}
          connections={connections}
          phase={phase}
        />
      </div>

      {/* z-20: Cinematic phase text (phases 1–4) */}
      <PhaseText stateRef={stateRef} phase={phase} text={textContent} />

      {/* z-22: Hub node labels (phase 4+) */}
      {labelsVisible && <NodeLabels nodes={nodes} />}

      {/* z-25: BL4CKDOT identity reveal (phase 5) */}
      {phase >= 5 && phase < 6 && <IdentityReveal stateRef={stateRef} />}

      {/* z-30: Homepage content slides in (phase 6) */}
      <HomepageContent opacity={uiOpacity} />

      {/* z-40: Skip button (hidden once UI is showing) */}
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
