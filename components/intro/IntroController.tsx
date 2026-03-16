"use client";
import { useEffect, useRef, useState } from "react";
import { Scene }        from "./Scene";
import { IntroText }    from "./ui/IntroText";
import { SystemLogs }   from "./ui/SystemLogs";
import { HomepageUI }   from "./ui/HomepageUI";
import { CodeRain }     from "./environment/CodeRain";
import { useIntroTimeline } from "@/hooks/useIntroTimeline";

export default function IntroController() {
  const { stateRef, stage, textContent, uiVisible, skipToEnd } =
    useIntroTimeline();

  // Track uiOpacity for HomepageUI fade (synced from stateRef via rAF)
  const [uiOpacity, setUiOpacity] = useState(0);
  const rafRef        = useRef<number>(0);
  const dissolveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dissolveStarted = useRef(false);

  const [overlayDone, setOverlayDone] = useState(false);

  useEffect(() => {
    function tick() {
      const o = stateRef.current.uiOpacity;
      setUiOpacity(o);

      // Once fully faded in, schedule overlay removal (only once)
      if (o >= 0.99 && !dissolveStarted.current) {
        dissolveStarted.current = true;
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

  if (overlayDone) return null;

  return (
    <div
      style={{
        position:      "fixed",
        inset:          0,
        zIndex:         50,
        pointerEvents:  "auto",
      }}
    >
      {/* z-0: Code rain canvas */}
      <CodeRain stateRef={stateRef} />

      {/* z-10: 3D Canvas */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
        <Scene stage={stage} stateRef={stateRef} />
      </div>

      {/* z-20: Cinematic text overlay */}
      <IntroText stage={stage} text={textContent} stateRef={stateRef} />

      {/* z-25: System logs (bottom-left) */}
      <SystemLogs />

      {/* z-30: Homepage UI overlay (fades in at end) */}
      <HomepageUI opacity={uiOpacity} />

      {/* z-40: Skip button (top-right) */}
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
            borderRadius:  8,
            color:          "rgba(255,255,255,0.4)",
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:       10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor:         "pointer",
            transition:    "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget;
            btn.style.color       = "rgba(255,255,255,0.8)";
            btn.style.borderColor = "rgba(0,245,255,0.4)";
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget;
            btn.style.color       = "rgba(255,255,255,0.4)";
            btn.style.borderColor = "rgba(255,255,255,0.12)";
          }}
        >
          Skip →
        </button>
      )}
    </div>
  );
}
