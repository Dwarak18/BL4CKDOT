"use client";
import { useEffect, useRef } from "react";

interface Node {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
}

interface Projected { x: number; y: number; scale: number; alpha: number }

function projectNode(node: Node, cx: number, cy: number, fov: number): Projected {
  const z = node.z + fov;
  const scale = fov / z;
  return {
    x: cx + node.x * scale,
    y: cy + node.y * scale,
    scale,
    alpha: Math.min(1, Math.max(0.1, (node.z + 150) / 300)),
  };
}

export default function NetworkSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const NODE_COUNT = 120;
    const RADIUS = Math.min(width, height) * 0.35;
    const FOV = 400;
    let rotX = 0;
    let rotY = 0;
    let mouseX = 0;
    let mouseY = 0;

    // Create nodes on sphere surface using Fibonacci lattice
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, (_, i) => {
      const golden = Math.PI * (3 - Math.sqrt(5));
      const y = 1 - (i / (NODE_COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      return {
        x: Math.cos(theta) * r * RADIUS,
        y: y * RADIUS,
        z: Math.sin(theta) * r * RADIUS,
        vx: 0, vy: 0, vz: 0,
      };
    });

    // Build edges (connect nearby nodes)
    const edges: [number, number][] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < RADIUS * 0.65 && edges.length < 200) {
          edges.push([i, j]);
        }
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - width / 2) / width;
      mouseY = (e.clientY - rect.top - height / 2) / height;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", onResize);

    let t = 0;
    const render = () => {
      t += 0.005;
      rotY = t + mouseX * 0.5;
      rotX = mouseY * 0.3;

      ctx.clearRect(0, 0, width, height);

      // Rotate nodes
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const rotated: { x: number; y: number; z: number }[] = nodes.map((n) => {
        // Rotate around Y
        const x1 = n.x * cosY + n.z * sinY;
        const z1 = -n.x * sinY + n.z * cosY;
        // Rotate around X
        const y2 = n.y * cosX - z1 * sinX;
        const z2 = n.y * sinX + z1 * cosX;
        return { x: x1, y: y2, z: z2 };
      });

      const projected = rotated.map((n) => projectNode(n as Node, width / 2, height / 2, FOV));

      // Draw edges
      for (const [a, b] of edges) {
        const pa = projected[a];
        const pb = projected[b];
        const alpha = Math.min(pa.alpha, pb.alpha) * 0.4;
        if (alpha < 0.05) continue;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = `rgba(0,245,255,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw nodes
      for (let i = 0; i < NODE_COUNT; i++) {
        const p = projected[i];
        const r = p.scale * 2.5;
        // Glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
        grad.addColorStop(0, `rgba(0,245,255,${p.alpha * 0.8})`);
        grad.addColorStop(1, "rgba(0,245,255,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = i % 8 === 0
          ? `rgba(124,58,237,${p.alpha})`
          : `rgba(0,245,255,${p.alpha})`;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
