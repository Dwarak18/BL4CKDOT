// ── Signal Field phase timeline (GSAP proxy → stateRef) ──────────────────────
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface SignalPhaseState {
  phase:        number;   // 0–5
  fieldOpacity: number;   // canvas element overall opacity
  nodeOpacity:  number;   // global gate for node rendering
  lineOpacity:  number;   // global gate for connection rendering
  pulseOpacity: number;   // global gate for pulse rendering
  textContent:  string;
  textOpacity:  number;
  titleOpacity: number;   // BL4CKDOT reveal
  uiOpacity:    number;   // homepage content
  originScale:  number;   // CSS origin dot scale (phase 1)
}

interface AnimProxy {
  fieldOpacity: number;
  nodeOpacity:  number;
  lineOpacity:  number;
  pulseOpacity: number;
  textOpacity:  number;
  titleOpacity: number;
  uiOpacity:    number;
  originScale:  number;
}

const PHASE_TEXT: Record<number, string> = {
  0: "",
  1: "Every connection begins here.",
  2: "Data flows where ideas connect.",
  3: "A network of builders, thinkers, innovators.",
  4: "The world's ideas, connected.",
  5: "Welcome to BL4CKDOT.",
};

export function useSignalFieldTimeline() {
  const [phase,        setPhase]       = useState(0);
  const [textContent,  setTextContent] = useState("");
  const [uiVisible,    setUiVisible]   = useState(false);

  const stateRef = useRef<SignalPhaseState>({
    phase:        0,
    fieldOpacity: 0,
    nodeOpacity:  0,
    lineOpacity:  0,
    pulseOpacity: 0,
    textContent:  "",
    textOpacity:  0,
    titleOpacity: 0,
    uiOpacity:    0,
    originScale:  0,
  });

  const tlRef    = useRef<gsap.core.Timeline | null>(null);
  const proxyRef = useRef<AnimProxy>({
    fieldOpacity: 0,
    nodeOpacity:  0,
    lineOpacity:  0,
    pulseOpacity: 0,
    textOpacity:  0,
    titleOpacity: 0,
    uiOpacity:    0,
    originScale:  0,
  });

  const changePhase = useCallback((p: number) => {
    stateRef.current.phase = p;
    setPhase(p);
    const text = PHASE_TEXT[p] ?? "";
    stateRef.current.textContent = text;
    setTextContent(text);
  }, []);

  const skipToEnd = useCallback(() => {
    if (tlRef.current) tlRef.current.seek(tlRef.current.duration());
  }, []);

  useEffect(() => {
    const proxy = proxyRef.current;

    // Sync proxy → stateRef on every GSAP tick (zero React re-renders)
    const tickerCb = () => {
      const s          = stateRef.current;
      s.fieldOpacity   = proxy.fieldOpacity;
      s.nodeOpacity    = proxy.nodeOpacity;
      s.lineOpacity    = proxy.lineOpacity;
      s.pulseOpacity   = proxy.pulseOpacity;
      s.textOpacity    = proxy.textOpacity;
      s.titleOpacity   = proxy.titleOpacity;
      s.uiOpacity      = proxy.uiOpacity;
      s.originScale    = proxy.originScale;
    };
    gsap.ticker.add(tickerCb);

    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    tlRef.current = tl;

    // ── Phase 0: void (0.6s) ─────────────────────────────────────────────
    tl.to(proxy, { duration: 0.6 })

    // ── Phase 1: origin dot (1.4s) ───────────────────────────────────────
      .call(() => changePhase(1))
      .to(proxy, { fieldOpacity: 1, duration: 0.4 })
      .to(proxy, { originScale: 1, duration: 0.5, ease: "elastic.out(1,0.5)" }, "-=0.3")
      .to(proxy, { nodeOpacity: 1, duration: 0.4 }, "-=0.4")
      .to(proxy, { textOpacity: 1, duration: 0.35 }, "-=0.2")
      .to(proxy, { duration: 0.55 })          // breathing pause

    // ── Phase 2: first spread (1.4s) ─────────────────────────────────────
      .call(() => changePhase(2))
      .to(proxy, { textOpacity: 0, duration: 0.2 })
      .to(proxy, { lineOpacity:  1, duration: 0.55 })
      .to(proxy, { pulseOpacity: 0.75, duration: 0.4 }, "-=0.3")
      .to(proxy, { textOpacity: 1, duration: 0.3 }, "-=0.25")
      .to(proxy, { duration: 0.35 })

    // ── Phase 3: field awakens (1.8s) ────────────────────────────────────
      .call(() => changePhase(3))
      .to(proxy, { textOpacity: 0, duration: 0.2 })
      .to(proxy, { textOpacity: 1, duration: 0.3 })
      .to(proxy, { duration: 1.3 })           // nodes and lines spawn over this

    // ── Phase 4: full flow (1.6s) ────────────────────────────────────────
      .call(() => changePhase(4))
      .to(proxy, { textOpacity: 0, duration: 0.2 })
      .to(proxy, { textOpacity: 1, duration: 0.3 })
      .to(proxy, { duration: 1.1 })

    // ── Phase 5: reveal (2.5s) ───────────────────────────────────────────
      .call(() => changePhase(5))
      .to(proxy, { textOpacity: 0, duration: 0.25 })
      .to(proxy, { fieldOpacity: 0.6, duration: 0.5 })
      .to(proxy, { textOpacity: 1, duration: 0.5 }, "-=0.3")
      .to(proxy, { duration: 1.2 })
      .to(proxy, { textOpacity: 0, duration: 0.4 })
      .to(proxy, { uiOpacity: 1, duration: 0.8 })
      .call(() => setUiVisible(true));

    return () => {
      gsap.ticker.remove(tickerCb);
      tl.kill();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { stateRef, phase, textContent, uiVisible, skipToEnd };
}
