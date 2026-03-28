"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { INTRO_TEXT, PHASE_DURATIONS } from "@/constants/introGlobeConfig";
import type { IntroPhaseState } from "@/components/intro-globe/types";

interface IntroProxy {
  scanlineProgress: number;
  dotOpacity: number;
  dotScale: number;
  dotTravelProgress: number;
  guideOpacity: number;
  foundNodeOpacity: number;
  firstLineVisible: number;
  firstFlash: number;
  firstSignalProgress: number;
  clusterReveal: number;
  otherClustersReveal: number;
  bridgeReveal: number;
  webReveal: number;
  morphProgress: number;
  sceneScale: number;
  globeDim: number;
  titleOpacity: number;
  labelOpacity: number;
  globeOffsetProgress: number;
  globeScale: number;
  uiOpacity: number;
  leftCurtainOpacity: number;
  youLabelOpacity: number;
  textOpacity: number;
}

interface UseIntroTimelineOptions {
  active: boolean;
}

export type IntroStage =
  | "idle"
  | "stage1_birth"
  | "stage2_nodes"
  | "stage3_network"
  | "stage4_sphere"
  | "stage5_ecosystem"
  | "homepage";

export interface AnimValues extends IntroPhaseState {
  stage: IntroStage;
  fieldOpacity: number;
  nodeOpacity: number;
  lineOpacity: number;
  pulseOpacity: number;
  networkOpacity: number;
  worldMapOpacity: number;
  sphereProgress: number;
  collapseProgress: number;
  originScale: number;
  sphereTargetX: number;
}

export const STAGE_COLORS: Record<IntroStage, string> = {
  idle: "#00f5ff",
  stage1_birth: "#00f5ff",
  stage2_nodes: "#00f5ff",
  stage3_network: "#00f5ff",
  stage4_sphere: "#a0c4ff",
  stage5_ecosystem: "#39ff14",
  homepage: "#ffffff",
};

function phaseToStage(phase: number): IntroStage {
  if (phase <= 0) {
    return "idle";
  }
  if (phase === 1) {
    return "stage1_birth";
  }
  if (phase === 2) {
    return "stage2_nodes";
  }
  if (phase <= 5) {
    return "stage3_network";
  }
  if (phase <= 7) {
    return "stage4_sphere";
  }
  if (phase === 8) {
    return "stage5_ecosystem";
  }
  return "homepage";
}

const INITIAL_PROXY: IntroProxy = {
  scanlineProgress: 0,
  dotOpacity: 0,
  dotScale: 0,
  dotTravelProgress: 0,
  guideOpacity: 0,
  foundNodeOpacity: 0,
  firstLineVisible: 0,
  firstFlash: 0,
  firstSignalProgress: 0,
  clusterReveal: 0,
  otherClustersReveal: 0,
  bridgeReveal: 0,
  webReveal: 0,
  morphProgress: 0,
  sceneScale: 1,
  globeDim: 1,
  titleOpacity: 0,
  labelOpacity: 0,
  globeOffsetProgress: 0,
  globeScale: 1,
  uiOpacity: 0,
  leftCurtainOpacity: 1,
  youLabelOpacity: 0,
  textOpacity: 0,
};

const INITIAL_STATE: AnimValues = {
  phase: 0,
  stage: "idle",
  scanlineProgress: 0,
  dotOpacity: 0,
  dotScale: 0,
  dotTravelProgress: 0,
  guideOpacity: 0,
  foundNodeOpacity: 0,
  firstLineVisible: 0,
  firstFlash: 0,
  firstSignalProgress: 0,
  clusterReveal: 0,
  otherClustersReveal: 0,
  bridgeReveal: 0,
  webReveal: 0,
  morphProgress: 0,
  sceneScale: 1,
  globeDim: 1,
  titleOpacity: 0,
  labelOpacity: 0,
  globeOffsetProgress: 0,
  globeScale: 1,
  uiOpacity: 0,
  leftCurtainOpacity: 1,
  youLabelOpacity: 0,
  textContent: "",
  textOpacity: 0,
  fieldOpacity: 0,
  nodeOpacity: 0,
  lineOpacity: 0,
  pulseOpacity: 0,
  networkOpacity: 0,
  worldMapOpacity: 0,
  sphereProgress: 0,
  collapseProgress: 0,
  originScale: 0,
  sphereTargetX: 0,
};

function createPhaseTimeline(
  duration: number,
  build: (timeline: gsap.core.Timeline) => void,
): gsap.core.Timeline {
  const anchor = { value: 0 };
  const timeline = gsap.timeline();
  timeline.to(anchor, { value: 1, duration, ease: "none" }, 0);
  build(timeline);
  return timeline;
}

export function useIntroTimeline(
  options: UseIntroTimelineOptions = { active: true },
) {
  const { active } = options;
  const [phase, setPhase] = useState(0);
  const [stage, setStage] = useState<IntroStage>("idle");
  const [textContent, setTextContent] = useState("");
  const [uiVisible, setUiVisible] = useState(false);
  const [completed, setCompleted] = useState(false);

  const stateRef = useRef<AnimValues>(INITIAL_STATE);
  const proxyRef = useRef<IntroProxy>(INITIAL_PROXY);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const syncProxyToState = useCallback(() => {
    const proxy = proxyRef.current;
    const state = stateRef.current;
    const networkOpacity = Math.max(
      proxy.foundNodeOpacity,
      proxy.clusterReveal,
      proxy.otherClustersReveal,
      proxy.webReveal,
    );

    state.scanlineProgress = proxy.scanlineProgress;
    state.fieldOpacity = Math.max(proxy.dotOpacity, proxy.morphProgress, proxy.uiOpacity);
    state.dotOpacity = proxy.dotOpacity;
    state.dotScale = proxy.dotScale;
    state.dotTravelProgress = proxy.dotTravelProgress;
    state.guideOpacity = proxy.guideOpacity;
    state.foundNodeOpacity = proxy.foundNodeOpacity;
    state.nodeOpacity = Math.max(proxy.dotOpacity, proxy.clusterReveal, proxy.otherClustersReveal);
    state.firstLineVisible = proxy.firstLineVisible;
    state.firstFlash = proxy.firstFlash;
    state.firstSignalProgress = proxy.firstSignalProgress;
    state.clusterReveal = proxy.clusterReveal;
    state.otherClustersReveal = proxy.otherClustersReveal;
    state.bridgeReveal = proxy.bridgeReveal;
    state.webReveal = proxy.webReveal;
    state.lineOpacity = Math.max(proxy.firstLineVisible, proxy.clusterReveal, proxy.bridgeReveal);
    state.pulseOpacity = Math.max(proxy.firstSignalProgress, proxy.webReveal);
    state.networkOpacity = networkOpacity;
    state.morphProgress = proxy.morphProgress;
    state.worldMapOpacity = proxy.labelOpacity * 0.06;
    state.sphereProgress = proxy.morphProgress;
    state.collapseProgress = proxy.morphProgress;
    state.sceneScale = proxy.sceneScale;
    state.globeDim = proxy.globeDim;
    state.titleOpacity = proxy.titleOpacity;
    state.labelOpacity = proxy.labelOpacity;
    state.globeOffsetProgress = proxy.globeOffsetProgress;
    state.globeScale = proxy.globeScale;
    state.originScale = proxy.dotScale;
    state.sphereTargetX = proxy.globeOffsetProgress * 3.2;
    state.uiOpacity = proxy.uiOpacity;
    state.leftCurtainOpacity = proxy.leftCurtainOpacity;
    state.youLabelOpacity = proxy.youLabelOpacity;
    state.textOpacity = proxy.textOpacity;
  }, []);

  const changePhase = useCallback((nextPhase: number) => {
    const nextText = INTRO_TEXT[nextPhase] ?? "";
    stateRef.current.phase = nextPhase;
    stateRef.current.stage = phaseToStage(nextPhase);
    stateRef.current.textContent = nextText;
    setPhase(nextPhase);
    setStage(phaseToStage(nextPhase));
    setTextContent(nextText);
    if (nextPhase < 9) {
      setCompleted(false);
    }
  }, []);

  const applyFinalState = useCallback(() => {
    Object.assign(proxyRef.current, {
      scanlineProgress: 1,
      dotOpacity: 1,
      dotScale: 1,
      dotTravelProgress: 1,
      guideOpacity: 1,
      foundNodeOpacity: 1,
      firstLineVisible: 1,
      firstFlash: 0,
      firstSignalProgress: 1,
      clusterReveal: 1,
      otherClustersReveal: 1,
      bridgeReveal: 1,
      webReveal: 1,
      morphProgress: 1,
      sceneScale: 0.92,
      globeDim: 0.7,
      titleOpacity: 0,
      labelOpacity: 1,
      globeOffsetProgress: 1,
      globeScale: 0.8,
      uiOpacity: 1,
      leftCurtainOpacity: 0,
      youLabelOpacity: 0,
      textOpacity: 0,
    });

    changePhase(9);
    setUiVisible(true);
    setCompleted(true);
    syncProxyToState();
  }, [changePhase, syncProxyToState]);

  const skipToEnd = useCallback(() => {
    tlRef.current?.kill();
    tlRef.current = null;
    applyFinalState();
  }, [applyFinalState]);

  useEffect(() => {
    if (!active) {
      stateRef.current = { ...INITIAL_STATE };
      proxyRef.current = { ...INITIAL_PROXY };
      return;
    }

    proxyRef.current = { ...INITIAL_PROXY };
    stateRef.current = { ...INITIAL_STATE };

    const ticker = () => syncProxyToState();
    gsap.ticker.add(ticker);

    const timeline = gsap.timeline({
      onComplete: () => {
        setCompleted(true);
      },
    });
    tlRef.current = timeline;

    timeline.add(
      createPhaseTimeline(PHASE_DURATIONS[0], (phaseTl) => {
        phaseTl.to(proxyRef.current, { scanlineProgress: 1, duration: 0.8, ease: "none" }, 0);
      }),
    );

    timeline.add(
      createPhaseTimeline(PHASE_DURATIONS[1], (phaseTl) => {
        phaseTl.call(() => changePhase(1), undefined, 0);
        phaseTl.to(
          proxyRef.current,
          {
            dotOpacity: 1,
            dotScale: 1,
            duration: 0.5,
            ease: "elastic.out(1,0.5)",
          },
          0.08,
        );
        phaseTl.to(proxyRef.current, { textOpacity: 1, duration: 0.35, ease: "power1.out" }, 0.8);
      }),
    );

    timeline.add(
      createPhaseTimeline(PHASE_DURATIONS[2], (phaseTl) => {
        phaseTl.call(() => changePhase(2), undefined, 0);
        phaseTl.to(proxyRef.current, { textOpacity: 0, duration: 0.14, ease: "power1.inOut" }, 0);
        phaseTl.to(proxyRef.current, { guideOpacity: 1, duration: 0.28, ease: "power1.out" }, 0.06);
        phaseTl.to(
          proxyRef.current,
          {
            dotTravelProgress: 1,
            duration: 1.6,
            ease: "power2.inOut",
          },
          0,
        );
        phaseTl.to(proxyRef.current, { textOpacity: 1, duration: 0.24, ease: "power1.out" }, 0.24);
        phaseTl.to(proxyRef.current, { foundNodeOpacity: 0.24, duration: 0.3, ease: "power1.out" }, 0.6);
      }),
    );

    timeline.add(
      createPhaseTimeline(PHASE_DURATIONS[3], (phaseTl) => {
        phaseTl.call(() => changePhase(3), undefined, 0);
        phaseTl.to(proxyRef.current, { textOpacity: 0, duration: 0.12 }, 0);
        phaseTl.to(proxyRef.current, { foundNodeOpacity: 1, duration: 0.18, ease: "power2.out" }, 0.04);
        phaseTl.set(proxyRef.current, { firstLineVisible: 1 }, 0.18);
        phaseTl.to(
          proxyRef.current,
          {
            firstFlash: 1,
            duration: 0.08,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
          },
          0.18,
        );
        phaseTl.to(proxyRef.current, { firstSignalProgress: 1, duration: 0.9, ease: "none" }, 0.22);
        phaseTl.to(proxyRef.current, { textOpacity: 1, duration: 0.22, ease: "power1.out" }, 0.28);
      }),
    );

    timeline.add(
      createPhaseTimeline(PHASE_DURATIONS[4], (phaseTl) => {
        phaseTl.call(() => changePhase(4), undefined, 0);
        phaseTl.to(proxyRef.current, { textOpacity: 0, duration: 0.12 }, 0);
        phaseTl.to(proxyRef.current, { clusterReveal: 1, duration: 1.8, ease: "power2.out" }, 0);
        phaseTl.to(proxyRef.current, { sceneScale: 0.95, duration: 1.5, ease: "power2.inOut" }, 0.1);
        phaseTl.to(proxyRef.current, { textOpacity: 1, duration: 0.24, ease: "power1.out" }, 0.2);
      }),
    );

    timeline.add(
      createPhaseTimeline(PHASE_DURATIONS[5], (phaseTl) => {
        phaseTl.call(() => changePhase(5), undefined, 0);
        phaseTl.to(proxyRef.current, { textOpacity: 0, duration: 0.12 }, 0);
        phaseTl.to(proxyRef.current, { otherClustersReveal: 1, duration: 0.78, ease: "power2.out" }, 0.04);
        phaseTl.to(proxyRef.current, { bridgeReveal: 1, duration: 0.86, ease: "power2.inOut" }, 0.38);
        phaseTl.to(proxyRef.current, { textOpacity: 1, duration: 0.24, ease: "power1.out" }, 0.18);
      }),
    );

    timeline.add(
      createPhaseTimeline(PHASE_DURATIONS[6], (phaseTl) => {
        phaseTl.call(() => changePhase(6), undefined, 0);
        phaseTl.to(proxyRef.current, { textOpacity: 0, duration: 0.12 }, 0);
        phaseTl.to(proxyRef.current, { webReveal: 1, duration: 1.6, ease: "power2.out" }, 0);
        phaseTl.to(proxyRef.current, { sceneScale: 0.92, duration: 1.2, ease: "power2.inOut" }, 0.2);
        phaseTl.to(proxyRef.current, { textOpacity: 1, duration: 0.24, ease: "power1.out" }, 0.18);
      }),
    );

    timeline.add(
      createPhaseTimeline(PHASE_DURATIONS[7], (phaseTl) => {
        phaseTl.call(() => changePhase(7), undefined, 0);
        phaseTl.to(proxyRef.current, { textOpacity: 0, duration: 0.12 }, 0);
        phaseTl.to(
          proxyRef.current,
          {
            morphProgress: 1,
            duration: 1.7,
            ease: "power3.inOut",
          },
          0,
        );
        phaseTl.to(proxyRef.current, { textOpacity: 1, duration: 0.24, ease: "power1.out" }, 0.22);
      }),
    );

    timeline.add(
      createPhaseTimeline(PHASE_DURATIONS[8], (phaseTl) => {
        phaseTl.call(() => changePhase(8), undefined, 0);
        phaseTl.to(proxyRef.current, { textOpacity: 0, duration: 0.12 }, 0);
        phaseTl.to(proxyRef.current, { titleOpacity: 1, duration: 0.5, ease: "power2.out" }, 0.12);
        phaseTl.to(proxyRef.current, { labelOpacity: 1, duration: 0.75, ease: "power2.out" }, 0.34);
        phaseTl.to(proxyRef.current, { globeDim: 0.7, duration: 0.6, ease: "power2.inOut" }, 0.18);
      }),
    );

    timeline.add(
      createPhaseTimeline(PHASE_DURATIONS[9], (phaseTl) => {
        phaseTl.call(() => changePhase(9), undefined, 0);
        phaseTl.call(() => setUiVisible(true), undefined, 0.18);
        phaseTl.to(proxyRef.current, { titleOpacity: 0, duration: 0.35, ease: "power2.out" }, 0);
        phaseTl.to(
          proxyRef.current,
          {
            globeOffsetProgress: 1,
            globeScale: 0.8,
            duration: 1.2,
            ease: "power2.inOut",
          },
          0,
        );
        phaseTl.to(proxyRef.current, { uiOpacity: 1, duration: 0.8, ease: "power2.out" }, 0.28);
        phaseTl.to(proxyRef.current, { leftCurtainOpacity: 0, duration: 0.8, ease: "power2.out" }, 0.28);
        phaseTl.to(proxyRef.current, { youLabelOpacity: 1, duration: 0.18, ease: "power2.out" }, 0.22);
        phaseTl.to(proxyRef.current, { youLabelOpacity: 0, duration: 0.4, ease: "power2.in" }, 0.92);
      }),
    );

    return () => {
      gsap.ticker.remove(ticker);
      timeline.kill();
      tlRef.current = null;
    };
  }, [active, changePhase, syncProxyToState]);

  useEffect(() => {
    if (!completed) {
      return;
    }
    syncProxyToState();
  }, [completed, syncProxyToState]);

  return {
    stateRef,
    phase,
    stage,
    textContent,
    uiVisible,
    completed,
    skipToEnd,
  };
}
