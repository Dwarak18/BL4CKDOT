"use client";
import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import type { AnimValues } from "@/hooks/useIntroTimeline";

const CHARS = "01アイウエオカキクケコABCDEF</>{}[]01010110";
const FONT_SIZE = 12;
const COLUMN_W  = 36;

interface Props {
  stateRef: MutableRefObject<AnimValues>;
}

export function CodeRain({ stateRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d")!;

    let cols: number;
    let drops: number[];
    let animId: number;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      cols  = Math.floor(canvas.width / COLUMN_W);
      drops = new Array(cols).fill(1);
    }

    resize();
    window.addEventListener("resize", resize);

    let last = 0;
    function draw(now: number) {
      animId = requestAnimationFrame(draw);
      if (now - last < 80) return; // cap at ~12fps
      last = now;

      const opacity = stateRef.current.networkOpacity * 0.15;
      if (opacity < 0.005) return;

      ctx.fillStyle = "rgba(7,11,20,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = `rgba(0,245,255,${opacity})`;
      ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;

      for (let c = 0; c < drops.length; c++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(char, c * COLUMN_W, drops[c] * FONT_SIZE);
        if (drops[c] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
          drops[c] = 0;
        }
        drops[c]++;
      }
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [stateRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 1,
      }}
    />
  );
}
