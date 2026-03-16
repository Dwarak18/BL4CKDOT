import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

export type IntroStage =
  | "idle"
  | "stage1_birth"
  | "stage2_nodes"
  | "stage3_network"
  | "stage4_sphere"
  | "stage5_ecosystem"
  | "homepage";

/** Mutable proxy: GSAP animates these directly  */
interface AnimProxy {
  dotOpacity:     number;
  dotScale:       number;
  networkOpacity: number;
  sphereProgress: number;
  uiOpacity:      number;
  textOpacity:    number;
}

/** What the 3D scene reads every frame (via stateRef.current) */
export interface AnimValues extends AnimProxy {
  stage: IntroStage;
}

// ──────────────────────────────────────────────────────────────────────────────
// Stage color map (used by IntroText)
// ──────────────────────────────────────────────────────────────────────────────

export const STAGE_COLORS: Record<IntroStage, string> = {
  idle:             "#00f5ff",
  stage1_birth:     "#00f5ff",
  stage2_nodes:     "#bf5fff",
  stage3_network:   "#39ff14",
  stage4_sphere:    "#ffffff",
  stage5_ecosystem: "#00f5ff",
  homepage:         "#00f5ff",
};

// ──────────────────────────────────────────────────────────────────────────────
// Hook
// ──────────────────────────────────────────────────────────────────────────────

export function useIntroTimeline() {
  const [stage,       setStage]       = useState<IntroStage>("idle");
  const [textContent, setTextContent] = useState("");
  const [uiVisible,   setUiVisible]   = useState(false);

  /** The "live" values — always up to date, read in useFrame without causing re-renders */
  const stateRef = useRef<AnimValues>({
    stage:          "idle",
    dotOpacity:     0,
    dotScale:       0,
    networkOpacity: 0,
    sphereProgress: 0,
    uiOpacity:      0,
    textOpacity:    0,
  });

  const tlRef     = useRef<gsap.core.Timeline | null>(null);
  const proxyRef  = useRef<AnimProxy>({
    dotOpacity:     0,
    dotScale:       0,
    networkOpacity: 0,
    sphereProgress: 0,
    uiOpacity:      0,
    textOpacity:    0,
  });

  const changeStage = useCallback((s: IntroStage) => {
    stateRef.current.stage = s;
    setStage(s);
  }, []);

  const changeText = useCallback((t: string) => {
    setTextContent(t);
  }, []);

  const skipToEnd = useCallback(() => {
    if (tlRef.current) tlRef.current.seek(tlRef.current.duration());
  }, []);

  useEffect(() => {
    const proxy = proxyRef.current;

    // Sync proxy → stateRef every ticker tick
    const tickerCb = () => {
      stateRef.current.dotOpacity     = proxy.dotOpacity;
      stateRef.current.dotScale       = proxy.dotScale;
      stateRef.current.networkOpacity = proxy.networkOpacity;
      stateRef.current.sphereProgress = proxy.sphereProgress;
      stateRef.current.uiOpacity      = proxy.uiOpacity;
      stateRef.current.textOpacity    = proxy.textOpacity;

      if (proxy.uiOpacity > 0.05 && !stateRef.current.stage.includes("homepage")) {
        // handled via stage callback
      }
    };
    gsap.ticker.add(tickerCb);

    // ── Build the timeline ──────────────────────────────────────────────────
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    tlRef.current = tl;

    // Stage 1 – Idea Birth
    tl.call(() => { changeStage("stage1_birth"); changeText("Every system begins with a single idea."); })
      .to(proxy, { dotOpacity: 1, dotScale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" })
      .to(proxy, { textOpacity: 1, duration: 0.5 }, "-=0.3")
      .to(proxy, { dotOpacity: 0.8, duration: 0.4, ease: "sine.inOut", repeat: 1, yoyo: true })

    // Stage 2 – Node Creation
      .call(() => { changeStage("stage2_nodes"); changeText("Ideas connect. Collaboration begins."); })
      .to(proxy, { textOpacity: 0, duration: 0.3 })
      .to(proxy, { networkOpacity: 1, duration: 0.8 })
      .to(proxy, { textOpacity: 1, duration: 0.4 }, "-=0.4")

    // Stage 3 – Network Expansion
      .call(() => { changeStage("stage3_network"); changeText("A network of builders, thinkers, and innovators."); })
      .to(proxy, { textOpacity: 0, duration: 0.3 })
      .to(proxy, { textOpacity: 1, duration: 0.4 })

    // Stage 4 – Sphere Formation
      .call(() => { changeStage("stage4_sphere"); changeText("Welcome to BL4CKDOT."); })
      .to(proxy, { textOpacity: 0, duration: 0.3 })
      .to(proxy, { sphereProgress: 1, duration: 1.6, ease: "power3.inOut" })
      .to(proxy, { textOpacity: 1, duration: 0.5 }, "-=0.6")

    // Stage 5 – Ecosystem
      .call(() => { changeStage("stage5_ecosystem"); changeText("Engineering the future of intelligent systems."); })
      .to(proxy, { textOpacity: 0, duration: 0.3 })
      .to(proxy, { textOpacity: 1, duration: 0.4 })

    // Homepage transition (add 0.4s pause, then change stage)
      .to(proxy, { duration: 0.4 })
      .call(() => { changeStage("homepage"); })
      .to(proxy, { textOpacity: 0, duration: 0.3 })
      .to(proxy, { uiOpacity: 1, duration: 0.8 })
      .call(() => setUiVisible(true));

    return () => {
      gsap.ticker.remove(tickerCb);
      tl.kill();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { stateRef, stage, textContent, uiVisible, skipToEnd };
}
