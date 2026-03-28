"use client";

import { useEffect, useRef, useState } from "react";
import GlobeCanvas from "./GlobeCanvas";
import IntroText from "./ui/IntroText";
import BL4CKDOTReveal from "./ui/BL4CKDOTReveal";
import HomepageContent from "./ui/HomepageContent";
import YouLabel from "./ui/YouLabel";
import { useFirstVisit } from "@/hooks/useFirstVisit";
import { useCanvasSize } from "@/hooks/useCanvasSize";
import { useIntroTimeline } from "@/hooks/useIntroTimeline";

interface OriginMarker {
  x: number;
  y: number;
  visible: boolean;
}

export default function IntroGlobe() {
  const { ready, isFirstVisit } = useFirstVisit();
  const size = useCanvasSize();
  const [overlayDone, setOverlayDone] = useState(false);
  const [youPosition, setYouPosition] = useState<OriginMarker | null>(null);
  const originScreenRef = useRef<OriginMarker>({ x: 0, y: 0, visible: false });

  const { stateRef, phase, textContent, uiVisible, completed, skipToEnd } =
    useIntroTimeline({
      active: ready && isFirstVisit && !overlayDone,
    });

  useEffect(() => {
    if (!ready || !isFirstVisit || overlayDone) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFirstVisit, overlayDone, ready]);

  useEffect(() => {
    if (!completed) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setOverlayDone(true);
      document.body.style.overflow = "";
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, [completed]);

  useEffect(() => {
    if (phase === 9 && originScreenRef.current.visible) {
      setYouPosition({ ...originScreenRef.current });
    }
  }, [phase, uiVisible]);

  if (!ready) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9500,
          background: "#070B14",
          pointerEvents: "none",
        }}
      />
    );
  }

  if (!isFirstVisit || overlayDone) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9500,
        overflow: "hidden",
        background: "#070B14",
      }}
    >
      <GlobeCanvas
        stateRef={stateRef}
        size={size}
        originScreenRef={originScreenRef}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(90deg, rgba(7,11,20,0.86) 0%, rgba(7,11,20,0.52) 48%, rgba(7,11,20,0.08) 72%, rgba(7,11,20,0) 100%)",
          opacity: uiVisible ? 0 : 1,
          transition: "opacity 0.8s ease",
        }}
      />

      <HomepageContent visible={uiVisible} />
      <IntroText phase={phase} text={textContent} />
      <BL4CKDOTReveal phase={phase} />
      <YouLabel phase={phase} position={youPosition} />

      {phase < 9 && (
        <button
          onClick={skipToEnd}
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            zIndex: 6,
            padding: "9px 16px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.52)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Skip
        </button>
      )}
    </div>
  );
}
