import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { PHASE_DURATIONS, PHASE_TEXT } from "@/constants/introConfig";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface PhaseState {
  phase:           number;   // 0–6
  phaseProgress:   number;   // 0–1 within current phase
  globalProgress:  number;   // 0–1 total animation

  // Phase 1
  dotOpacity:      number;
  dotScale:        number;
  dotPosition:     THREE.Vector3;

  // Phase 2–3
  networkOpacity:  number;

  // Phase 4
  worldMapOpacity: number;
  labelsVisible:   boolean;

  // Phase 5
  collapseProgress: number;
  sphereOpacity:    number;
  titleOpacity:     number;

  // Phase 6
  sphereTargetX:   number;
  uiOpacity:       number;

  // Text
  textContent:     string;
  textOpacity:     number;
}

interface AnimProxy {
  dotOpacity:       number;
  dotScale:         number;
  dotX:             number;
  dotY:             number;
  networkOpacity:   number;
  worldMapOpacity:  number;
  collapseProgress: number;
  sphereOpacity:    number;
  titleOpacity:     number;
  sphereTargetX:    number;
  uiOpacity:        number;
  textOpacity:      number;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function usePhaseTimeline() {
  const [phase,       setPhase]       = useState(0);
  const [textContent, setTextContent] = useState("");
  const [labelsVisible, setLabelsVisible] = useState(false);
  const [uiVisible,   setUiVisible]   = useState(false);

  const stateRef = useRef<PhaseState>({
    phase:           0,
    phaseProgress:   0,
    globalProgress:  0,
    dotOpacity:      0,
    dotScale:        0,
    dotPosition:     new THREE.Vector3(0, 0, 0),
    networkOpacity:  0,
    worldMapOpacity: 0,
    labelsVisible:   false,
    collapseProgress:0,
    sphereOpacity:   0,
    titleOpacity:    0,
    sphereTargetX:   0,
    uiOpacity:       0,
    textContent:     "",
    textOpacity:     0,
  });

  const tlRef    = useRef<gsap.core.Timeline | null>(null);
  const proxyRef = useRef<AnimProxy>({
    dotOpacity:       0,
    dotScale:         0,
    dotX:             0,
    dotY:             0,
    networkOpacity:   0,
    worldMapOpacity:  0,
    collapseProgress: 0,
    sphereOpacity:    0,
    titleOpacity:     0,
    sphereTargetX:    0,
    uiOpacity:        0,
    textOpacity:      0,
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

    // Total duration for globalProgress calculation
    const totalDuration = Object.values(PHASE_DURATIONS).reduce((a, b) => a + b, 0);

    // Sync proxy → stateRef every ticker frame (zero React re-renders)
    const tickerCb = () => {
      const s = stateRef.current;
      s.dotOpacity       = proxy.dotOpacity;
      s.dotScale         = proxy.dotScale;
      s.dotPosition.set(proxy.dotX, proxy.dotY, 0);
      s.networkOpacity   = proxy.networkOpacity;
      s.worldMapOpacity  = proxy.worldMapOpacity;
      s.collapseProgress = proxy.collapseProgress;
      s.sphereOpacity    = proxy.sphereOpacity;
      s.titleOpacity     = proxy.titleOpacity;
      s.sphereTargetX    = proxy.sphereTargetX;
      s.uiOpacity        = proxy.uiOpacity;
      s.textOpacity      = proxy.textOpacity;
      if (tlRef.current) {
        s.globalProgress = Math.min(1, tlRef.current.time() / totalDuration);
      }
    };
    gsap.ticker.add(tickerCb);

    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    tlRef.current = tl;

    // ── Phase 0: Void (0.5s) ────────────────────────────────────────────
    tl.to(proxy, { duration: PHASE_DURATIONS[0] })

    // ── Phase 1: Origin dot (1.3s) ──────────────────────────────────────
      .call(() => changePhase(1))
      .to(proxy, {
        dotOpacity: 1,
        dotScale:   1,
        duration:   0.6,
        ease:       "elastic.out(1, 0.5)",
      })
      .to(proxy, { textOpacity: 1, duration: 0.4 }, "-=0.3")
      .to(proxy, { duration: 0.3 }) // breathing pause

    // ── Phase 2: First connections (1.4s) ────────────────────────────────
      .call(() => changePhase(2))
      .to(proxy, { textOpacity: 0, duration: 0.25 })
      .to(proxy, { networkOpacity: 1, duration: 0.5 })
      .to(proxy, { textOpacity: 1, duration: 0.35 }, "-=0.2")
      // Dot drifts during phase 2 (visiting positions)
      .to(proxy, { dotX: -2.8, dotY: 1.2, duration: 0.3, ease: "power1.inOut" }, "-=0.6")
      .to(proxy, { dotX: 2.6,  dotY: -0.8, duration: 0.25 })
      .to(proxy, { dotX: -1.0, dotY: -2.4, duration: 0.25 })
      .to(proxy, { dotX: 3.2,  dotY: 1.8,  duration: 0.2 })
      .to(proxy, { dotX: -3.0, dotY: -1.0, duration: 0.2 })

    // ── Phase 3: Hyperlink explosion (1.8s) ──────────────────────────────
      .call(() => changePhase(3))
      .to(proxy, { textOpacity: 0, duration: 0.2 })
      .to(proxy, { textOpacity: 1, duration: 0.3 })
      .to(proxy, { duration: 1.3 }) // nodes spawn over this window

    // ── Phase 4: World grid reveal (1.2s) ────────────────────────────────
      .call(() => { changePhase(4); setLabelsVisible(true); stateRef.current.labelsVisible = true; })
      .to(proxy, { textOpacity: 0, duration: 0.2 })
      .to(proxy, { worldMapOpacity: 0.06, duration: 0.7 })
      .to(proxy, { textOpacity: 1, duration: 0.35 }, "-=0.35")

    // ── Phase 5: Identity reveal (1.6s) ──────────────────────────────────
      .call(() => changePhase(5))
      .to(proxy, { textOpacity: 0, duration: 0.2 })
      .to(proxy, { collapseProgress: 1, duration: 1.0, ease: "power3.inOut" })
      .to(proxy, { sphereOpacity: 1, duration: 0.4 }, "-=0.5")
      .to(proxy, { titleOpacity: 1, duration: 0.5 }, "-=0.3")

    // ── Phase 6: Homepage transition (1.2s) ──────────────────────────────
      .call(() => changePhase(6))
      .to(proxy, { titleOpacity: 0, duration: 0.3 })
      .to(proxy, { sphereTargetX: 3.2, duration: 1.0, ease: "power2.inOut" })
      .to(proxy, { uiOpacity: 1, duration: 0.7 }, "-=0.5")
      .call(() => setUiVisible(true));

    return () => {
      gsap.ticker.remove(tickerCb);
      tl.kill();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { stateRef, phase, textContent, labelsVisible, uiVisible, skipToEnd };
}
