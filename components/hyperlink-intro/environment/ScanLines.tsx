"use client";
import { useEffect, useRef } from "react";

/** 2D canvas overlay: 2–3 horizontal scan lines sweep across slowly */
export default function ScanLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;

    const lines = [
      { y: 0.0, speed: 0.07, opacity: 0.06 },
      { y: 0.33, speed: 0.05, opacity: 0.04 },
      { y: 0.67, speed: 0.09, opacity: 0.05 },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lines.forEach((line) => {
        const y = ((line.y + t * line.speed) % 1) * canvas.height;
        const grad = ctx.createLinearGradient(0, y - 3, 0, y + 3);
        grad.addColorStop(0,   "rgba(0,245,255,0)");
        grad.addColorStop(0.5, `rgba(0,245,255,${line.opacity})`);
        grad.addColorStop(1,   "rgba(0,245,255,0)");

        ctx.fillStyle = grad;
        ctx.fillRect(0, y - 3, canvas.width, 6);
      });

      t += 0.005;
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset:    0,
        pointerEvents: "none",
        zIndex: 1,
        opacity: 1,
      }}
    />
  );
}
