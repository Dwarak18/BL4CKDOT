"use client";

import { useEffect, useState } from "react";

interface CanvasSize {
  width: number;
  height: number;
  dpr: number;
}

export function useCanvasSize(): CanvasSize {
  const [size, setSize] = useState<CanvasSize>({
    width: 0,
    height: 0,
    dpr: 1,
  });

  useEffect(() => {
    const update = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}
