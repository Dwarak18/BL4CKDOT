// ── requestAnimationFrame loop manager ───────────────────────────────────────
import { useRef, useCallback } from "react";

type DrawFn = (timeSec: number, delta: number) => void;

export function useCanvasLoop() {
  const rafRef       = useRef<number>(0);
  const lastTimeRef  = useRef<number>(-1);
  const timeRef      = useRef<number>(0);           // total elapsed seconds
  const drawFnRef    = useRef<DrawFn | null>(null);

  const start = useCallback((fn: DrawFn) => {
    drawFnRef.current = fn;
    lastTimeRef.current = -1;

    const loop = (nowMs: number) => {
      const last  = lastTimeRef.current;
      const delta = last === -1 ? 0 : Math.min((nowMs - last) / 1000, 0.05);
      lastTimeRef.current = nowMs;
      timeRef.current    += delta;

      drawFnRef.current?.(timeRef.current, delta);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    drawFnRef.current = null;
  }, []);

  return { start, stop, timeRef };
}
