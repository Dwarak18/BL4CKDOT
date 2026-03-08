"use client";
import { useEffect, useRef } from "react";

export default function DataStreams() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    window.addEventListener("resize", resize, { passive: true });

    const COL_W  = 22;
    const CHAR_H = 14;
    const cols   = Math.ceil(canvas.width / COL_W);
    // Start far above viewport so columns are staggered
    const drops  = Array.from({ length: cols }, () => Math.floor(Math.random() * -60));

    const charset = "01";
    let lastTime  = 0;
    let raf: number;

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      if (time - lastTime < 125) return; // ~8 fps
      lastTime = time;

      // Fade trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${CHAR_H - 2}px "Courier New", monospace`;

      for (let i = 0; i < cols; i++) {
        const ch = charset[Math.floor(Math.random() * charset.length)];
        const x  = i * COL_W;
        const y  = drops[i] * CHAR_H;

        if (y > 0 && y < canvas.height) {
          // Very faint — only visible as cumulative layers
          ctx.fillStyle = `rgba(0, 245, 255, ${0.08 + Math.random() * 0.06})`;
          ctx.fillText(ch, x, y);
        }

        if (drops[i] * CHAR_H > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i]++;
        }
      }
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.35 }}
    />
  );
}
