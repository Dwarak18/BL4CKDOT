"use client";

import { useEffect, useState } from "react";
import { INTRO_VISITED_KEY } from "@/constants/introGlobeConfig";

interface FirstVisitState {
  ready: boolean;
  isFirstVisit: boolean;
}

function resolveVisitState(): FirstVisitState {
  try {
    const visited = window.localStorage.getItem(INTRO_VISITED_KEY);
    if (!visited) {
      window.localStorage.setItem(INTRO_VISITED_KEY, "true");
      return { ready: true, isFirstVisit: true };
    }

    return { ready: true, isFirstVisit: false };
  } catch {
    return { ready: true, isFirstVisit: true };
  }
}

export function useFirstVisit(): FirstVisitState {
  const [state, setState] = useState<FirstVisitState>(() => {
    if (typeof window === "undefined") {
      return { ready: false, isFirstVisit: false };
    }

    return resolveVisitState();
  });

  useEffect(() => {
    if (state.ready) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setState(resolveVisitState());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [state.ready]);

  return state;
}
