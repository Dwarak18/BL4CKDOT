"use client";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ─── Ecosystem node definitions ───────────────────────────────────────────────
interface NodeDef {
  label: string;
  href: string;
  color: string;
  pos: [number, number, number];
  desc: string;
}

const ECOSYSTEM_NODES: NodeDef[] = [
  {
    label: "IDEA FORGE",
    href: "/contact",
    color: "#00F5FF",
    pos: [0, 2.2, 0.2],
    desc: "Submit your idea and turn it into a real prototype with mentorship.",
  },
  {
    label: "PROJECT LAB",
    href: "/projects",
    color: "#F59E0B",
    pos: [2.0, 0.3, 0.8],
    desc: "Where prototypes are built and tested in real-world conditions.",
  },
  {
    label: "RESEARCH HUB",
    href: "/research",
    color: "#22C55E",
    pos: [-1.8, 0.6, 1.0],
    desc: "Where experiments and discoveries drive innovation forward.",
  },
  {
    label: "APPRENTICESHIP",
    href: "/apprenticeship",
    color: "#8B5CF6",
    pos: [0.5, -2.0, 0.7],
    desc: "Where students learn, collaborate, and grow into builders.",
  },
  {
    label: "INNOVATION NETWORK",
    href: "/innovation-lab",
    color: "#7C3AED",
    pos: [-0.4, 0.9, 2.0],
    desc: "Where mentors, builders, and companies connect to build the future.",
  },
];

// Live signals — appear after 5 s
const LIVE_SIGNALS = [
  "New AI prototype detected",
  "IoT experiment running",
  "Security research active",
  "Edge model optimizing",
  "ZK research in progress",
  "New apprentice joined",
];

// Module-level mouse state — avoids re-renders on every mousemove
let mx = 0;
let my = 0;

// ─── Main globe scene ─────────────────────────────────────────────────────────
function GlobeScene({
  onNavigate,
  onNodeHover,
}: {
  onNavigate: (href: string) => void;
  onNodeHover: (label: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const pulseMeshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // ── Geometry + pulse edge collection ──────────────────────────────────────
  const { pGeo, lGeo, pulseEdges } = useMemo(() => {
    const N = 320;
    const R = 2.2;
    const gr = (1 + Math.sqrt(5)) / 2;
    const pts: THREE.Vector3[] = [];

    for (let i = 0; i < N; i++) {
      const theta = Math.acos(1 - (2 * (i + 0.5)) / N);
      const phi = (2 * Math.PI * i) / gr;
      pts.push(
        new THREE.Vector3(
          R * Math.sin(theta) * Math.cos(phi),
          R * Math.sin(theta) * Math.sin(phi),
          R * Math.cos(theta)
        )
      );
    }

    const pGeo = new THREE.BufferGeometry().setFromPoints(pts);

    const lineVerts: THREE.Vector3[] = [];
    const pulseEdges: { from: THREE.Vector3; to: THREE.Vector3; color: string }[] = [];
    const PULSE_COLORS = ["#00F5FF", "#7C3AED", "#22C55E", "#F59E0B", "#8B5CF6"];
    const D2 = 0.72 * 0.72;
    let edgeCount = 0;

    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        if (pts[i].distanceToSquared(pts[j]) < D2) {
          lineVerts.push(pts[i], pts[j]);
          if (pulseEdges.length < 28 && edgeCount % 11 === 0) {
            pulseEdges.push({
              from: pts[i].clone(),
              to: pts[j].clone(),
              color: PULSE_COLORS[edgeCount % PULSE_COLORS.length],
            });
          }
          edgeCount++;
        }
      }
    }

    const lGeo = new THREE.BufferGeometry().setFromPoints(lineVerts);
    return { pGeo, lGeo, pulseEdges };
  }, []);

  // ── Animation loop ─────────────────────────────────────────────────────────
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.09 + mx * 0.4;
      groupRef.current.rotation.x = my * 0.15;
    }

    // Advance energy pulses
    pulseMeshRefs.current.forEach((mesh, i) => {
      if (!mesh || i >= pulseEdges.length) return;
      const edge = pulseEdges[i];
      const speed = 0.22 + (i % 7) * 0.035;
      const progress = (t * speed + i * 0.413) % 1.0;
      mesh.position.lerpVectors(edge.from, edge.to, progress);
      (mesh.material as THREE.MeshBasicMaterial).opacity =
        Math.sin(progress * Math.PI) * 0.9;
    });
  });

  const handleHover = (label: string | null) => {
    setHovered(label);
    onNodeHover(label);
    document.body.style.cursor = label ? "pointer" : "auto";
  };

  return (
    <group ref={groupRef}>
      {/* Point cloud */}
      <points geometry={pGeo}>
        <pointsMaterial
          color="#00F5FF"
          size={0.03}
          sizeAttenuation
          transparent
          opacity={0.78}
        />
      </points>

      {/* Connection lines */}
      <lineSegments geometry={lGeo}>
        <lineBasicMaterial color="#00F5FF" transparent opacity={0.07} />
      </lineSegments>

      {/* Energy pulses travelling along edges */}
      {pulseEdges.map((edge, i) => (
        <mesh key={i} ref={(el) => { pulseMeshRefs.current[i] = el; }}>
          <sphereGeometry args={[0.022, 6, 6]} />
          <meshBasicMaterial color={edge.color} transparent opacity={0.8} />
        </mesh>
      ))}

      {/* Ecosystem navigation nodes */}
      {ECOSYSTEM_NODES.map((node) => (
        <EcosystemNode
          key={node.label}
          def={node}
          isHovered={hovered === node.label}
          onEnter={() => handleHover(node.label)}
          onLeave={() => handleHover(null)}
          onClick={() => onNavigate(node.href)}
        />
      ))}
    </group>
  );
}

// ─── Individual ecosystem node ────────────────────────────────────────────────
function EcosystemNode({
  def,
  isHovered,
  onEnter,
  onLeave,
  onClick,
}: {
  def: NodeDef;
  isHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (coreRef.current) {
      const sc = isHovered
        ? 1.85 + Math.sin(t * 5) * 0.2
        : 1.0 + Math.sin(t * 1.8 + def.pos[0] * 2) * 0.1;
      coreRef.current.scale.setScalar(sc);
    }

    if (glowRef.current) {
      const sc = isHovered
        ? 5.0 + Math.sin(t * 2.5) * 0.6
        : 3.2 + Math.sin(t * 1.6 + def.pos[0]) * 0.4;
      glowRef.current.scale.setScalar(sc);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = isHovered
        ? 0.28
        : 0.1 + Math.sin(t * 1.6 + def.pos[0]) * 0.04;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.65 + def.pos[0];
      ringRef.current.rotation.x = t * 0.3;
      ringRef.current.scale.setScalar(isHovered ? 3.4 : 2.3);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = isHovered ? 0.9 : 0.32;
    }
  });

  return (
    <group position={def.pos}>
      {/* Glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={def.color} transparent opacity={0.1} />
      </mesh>

      {/* Orbiting ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.14, 0.009, 8, 36]} />
        <meshBasicMaterial color={def.color} transparent opacity={0.32} />
      </mesh>

      {/* Core sphere (interactive) */}
      <mesh
        ref={coreRef}
        onClick={onClick}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
      >
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshStandardMaterial
          color={def.color}
          emissive={def.color}
          emissiveIntensity={isHovered ? 7 : 2.8}
        />
      </mesh>

      {/* Node label */}
      <Html
        center
        distanceFactor={10}
        position={[0, 0.3, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            color: def.color,
            fontSize: "9px",
            fontFamily: '"Courier New", monospace',
            letterSpacing: "0.13em",
            whiteSpace: "nowrap",
            padding: "2px 8px",
            borderRadius: "3px",
            background: "rgba(0,0,0,0.88)",
            border: `1px solid ${def.color}44`,
            textTransform: "uppercase",
            opacity: isHovered ? 1 : 0.6,
            transition: "opacity 0.2s",
            userSelect: "none",
          }}
        >
          {def.label}
        </div>
      </Html>

      {/* Tooltip panel */}
      <Html
        center
        distanceFactor={10}
        position={[0, 0.64, 0]}
        style={{ pointerEvents: "none" }}
        zIndexRange={[200, 0]}
      >
        <div
          style={{
            opacity: isHovered ? 1 : 0,
            visibility: isHovered ? "visible" : "hidden",
            transform: isHovered
              ? "translateY(0) scale(1)"
              : "translateY(8px) scale(0.92)",
            transition: "opacity 0.22s ease, transform 0.22s ease",
            background: "rgba(7,11,20,0.96)",
            border: `1px solid ${def.color}50`,
            borderRadius: "8px",
            padding: "12px 16px",
            maxWidth: "210px",
            backdropFilter: "blur(16px)",
            boxShadow: `0 0 28px ${def.color}22`,
            userSelect: "none",
          }}
        >
          <div
            style={{
              color: def.color,
              fontFamily: '"Courier New", monospace',
              fontSize: "10px",
              letterSpacing: "0.14em",
              fontWeight: "bold",
              marginBottom: "8px",
              textTransform: "uppercase",
            }}
          >
            {def.label}
          </div>
          <div
            style={{
              color: "#94a3b8",
              fontSize: "9px",
              lineHeight: "1.65",
            }}
          >
            {def.desc}
          </div>
          <div
            style={{
              color: def.color,
              fontSize: "9px",
              marginTop: "10px",
              opacity: 0.75,
              fontFamily: "monospace",
            }}
          >
            Click to explore →
          </div>
        </div>
      </Html>
    </group>
  );
}

// ─── Exported component ────────────────────────────────────────────────────────
export default function NetworkSphere3D() {
  const router = useRouter();
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [liveSignals, setLiveSignals] = useState<{ id: number; text: string }[]>([]);
  const signalCountRef = useRef(0);

  // Live signals — start appearing 5 s after mount
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const startTimer = setTimeout(() => {
      const addSignal = () => {
        const idx = signalCountRef.current;
        setLiveSignals((prev) => [
          ...prev.slice(-3),
          { id: idx, text: LIVE_SIGNALS[idx % LIVE_SIGNALS.length] },
        ]);
        signalCountRef.current++;
      };
      addSignal();
      interval = setInterval(addSignal, 2400);
    }, 5000);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 52 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.18} />
        <pointLight position={[5, 5, 5]} intensity={0.9} color="#00F5FF" />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#7C3AED" />
        <pointLight position={[0, -5, -3]} intensity={0.3} color="#22C55E" />
        <GlobeScene
          onNavigate={(href) => router.push(href)}
          onNodeHover={setHoveredLabel}
        />
      </Canvas>

      {/* Live ecosystem signals */}
      <div className="absolute bottom-6 left-4 space-y-2 pointer-events-none">
        <AnimatePresence>
          {liveSignals.map((sig) => (
            <motion.div
              key={sig.id}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-2"
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                style={{ background: "#22C55E", boxShadow: "0 0 6px #22C55E" }}
              />
              <span className="font-mono text-[9px] text-[#22C55E] tracking-wider">
                {sig.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Hover hint */}
      <AnimatePresence>
        {hoveredLabel && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] text-[#00F5FF] bg-black/70 px-3 py-1 rounded border border-[#00F5FF]/30 pointer-events-none whitespace-nowrap"
          >
            Click to explore {hoveredLabel} →
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
