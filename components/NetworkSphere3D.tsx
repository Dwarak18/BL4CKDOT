"use client";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Cpu, Microscope, GraduationCap, Network } from "lucide-react";

interface NodeDef {
  label: string;
  href: string;
  color: string;
  pos: [number, number, number];
  desc: string;
  blurb: string;
  icon: "idea" | "project" | "research" | "apprenticeship" | "network";
}

const ECOSYSTEM_NODES: NodeDef[] = [
  {
    label: "IDEA FORGE",
    href: "/innovation-lab/submissions",
    color: "#00F5FF",
    pos: [0, 2.2, 0.2],
    blurb: "Where innovators submit ideas.",
    desc: "BL4CKDOT helps research, mentor, and prototype bold ideas into real systems.",
    icon: "idea",
  },
  {
    label: "PROJECT LAB",
    href: "/projects",
    color: "#F59E0B",
    pos: [2.0, 0.3, 0.8],
    blurb: "Where systems become real products.",
    desc: "Prototype engineering, integration, and productization pipelines happen here.",
    icon: "project",
  },
  {
    label: "RESEARCH HUB",
    href: "/research",
    color: "#22C55E",
    pos: [-1.8, 0.6, 1.0],
    blurb: "Where research drives engineering.",
    desc: "Experiments, papers, and applied research power BL4CKDOT innovation.",
    icon: "research",
  },
  {
    label: "APPRENTICESHIP",
    href: "/apprenticeship",
    color: "#8B5CF6",
    pos: [0.5, -2.0, 0.7],
    blurb: "Where students train on real projects.",
    desc: "Students learn by building production-grade systems with mentors.",
    icon: "apprenticeship",
  },
  {
    label: "INNOVATION NETWORK",
    href: "/innovation-lab",
    color: "#7C3AED",
    pos: [-0.4, 0.9, 2.0],
    blurb: "The collaboration layer of the ecosystem.",
    desc: "Engineers, mentors, startups, and companies connect through this network.",
    icon: "network",
  },
];

const LIVE_SIGNALS = [
  "[AI] Prototype training active",
  "[IoT] Sensor firmware update",
  "[SEC] Threat model simulation",
  "[LLM] Edge model optimizing",
  "[R&D] Research experiment online",
  "[NET] Collaboration channel active",
];

let mx = 0;
let my = 0;

function GlobeScene({
  onNavigate,
  onNodeHover,
}: {
  onNavigate: (href: string) => void;
  onNodeHover: (node: NodeDef | null) => void;
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
          R * Math.cos(theta),
        ),
      );
    }

    const pGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const lineVerts: THREE.Vector3[] = [];
    const pulseEdges: { from: THREE.Vector3; to: THREE.Vector3; color: string }[] = [];
    const pulseColors = ["#00F5FF", "#7C3AED", "#22C55E", "#F59E0B", "#8B5CF6"];
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
              color: pulseColors[edgeCount % pulseColors.length],
            });
          }
          edgeCount++;
        }
      }
    }

    const lGeo = new THREE.BufferGeometry().setFromPoints(lineVerts);
    return { pGeo, lGeo, pulseEdges };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.09 + mx * 0.4;
      groupRef.current.rotation.x = my * 0.15;
    }

    pulseMeshRefs.current.forEach((mesh, i) => {
      if (!mesh || i >= pulseEdges.length) return;
      const edge = pulseEdges[i];
      const speed = 0.22 + (i % 7) * 0.035;
      const progress = (t * speed + i * 0.413) % 1;
      mesh.position.lerpVectors(edge.from, edge.to, progress);
      (mesh.material as THREE.MeshBasicMaterial).opacity = Math.sin(progress * Math.PI) * 0.9;
    });
  });

  const handleHover = (node: NodeDef | null) => {
    setHovered(node?.label || null);
    onNodeHover(node);
    document.body.style.cursor = node ? "pointer" : "auto";
  };

  return (
    <group ref={groupRef}>
      <points geometry={pGeo}>
        <pointsMaterial color="#00F5FF" size={0.03} sizeAttenuation transparent opacity={0.78} />
      </points>

      <lineSegments geometry={lGeo}>
        <lineBasicMaterial color="#00F5FF" transparent opacity={0.07} />
      </lineSegments>

      {pulseEdges.map((edge, i) => (
        <mesh key={i} ref={(el) => { pulseMeshRefs.current[i] = el; }}>
          <sphereGeometry args={[0.022, 6, 6]} />
          <meshBasicMaterial color={edge.color} transparent opacity={0.8} />
        </mesh>
      ))}

      {ECOSYSTEM_NODES.map((node) => (
        <EcosystemNode
          key={node.label}
          def={node}
          isHovered={hovered === node.label}
          onEnter={() => handleHover(node)}
          onLeave={() => handleHover(null)}
          onClick={() => onNavigate(node.href)}
        />
      ))}
    </group>
  );
}

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
  const particleRefs = useRef<(THREE.Mesh | null)[]>([]);

  const Icon =
    def.icon === "idea"
      ? Lightbulb
      : def.icon === "project"
      ? Cpu
      : def.icon === "research"
      ? Microscope
      : def.icon === "apprenticeship"
      ? GraduationCap
      : Network;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (coreRef.current) {
      const sc = isHovered ? 1.8 + Math.sin(t * 5) * 0.2 : 1 + Math.sin(t * 1.8 + def.pos[0] * 2) * 0.1;
      coreRef.current.scale.setScalar(sc);
    }

    if (glowRef.current) {
      const sc = isHovered ? 5 + Math.sin(t * 2.5) * 0.6 : 3.2 + Math.sin(t * 1.6 + def.pos[0]) * 0.4;
      glowRef.current.scale.setScalar(sc);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = isHovered ? 0.28 : 0.12;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.6 + def.pos[0];
      ringRef.current.rotation.x = t * 0.32;
      ringRef.current.scale.setScalar(isHovered ? 3.6 : 2.4);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = isHovered ? 0.9 : 0.32;
    }

    particleRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const angle = t * (0.8 + idx * 0.3) + idx * 2;
      const radius = 0.2 + idx * 0.03;
      mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, Math.sin(angle * 0.7) * 0.04);
      (mesh.material as THREE.MeshBasicMaterial).opacity = isHovered ? 0.75 : 0.45;
    });
  });

  return (
    <group position={def.pos}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={def.color} transparent opacity={0.12} />
      </mesh>

      <mesh ref={ringRef}>
        <torusGeometry args={[0.14, 0.009, 8, 36]} />
        <meshBasicMaterial color={def.color} transparent opacity={0.32} />
      </mesh>

      <mesh ref={coreRef} onClick={onClick} onPointerEnter={onEnter} onPointerLeave={onLeave}>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshStandardMaterial color={def.color} emissive={def.color} emissiveIntensity={isHovered ? 7 : 2.8} />
      </mesh>

      {[0, 1, 2].map((idx) => (
        <mesh key={idx} ref={(el) => { particleRefs.current[idx] = el; }}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshBasicMaterial color={def.color} transparent opacity={0.45} />
        </mesh>
      ))}

      <Html center distanceFactor={12} position={[0, 0, 0]} style={{ pointerEvents: "none" }}>
        <div
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: def.color,
            background: "rgba(5,9,20,0.84)",
            border: `1px solid ${def.color}55`,
            boxShadow: isHovered ? `0 0 16px ${def.color}66` : `0 0 8px ${def.color}35`,
            transition: "all 0.25s ease",
          }}
        >
          <Icon size={12} />
        </div>
      </Html>
    </group>
  );
}

export default function NetworkSphere3D() {
  const router = useRouter();
  const [hoveredNode, setHoveredNode] = useState<NodeDef | null>(null);
  const [liveSignals, setLiveSignals] = useState<{ id: number; text: string }[]>([]);
  const signalCountRef = useRef(0);

  useEffect(() => {
    let interval;
    const startTimer = setTimeout(() => {
      const addSignal = () => {
        const idx = signalCountRef.current;
        setLiveSignals((prev) => [...prev.slice(-3), { id: idx, text: LIVE_SIGNALS[idx % LIVE_SIGNALS.length] }]);
        signalCountRef.current++;
      };
      addSignal();
      interval = setInterval(addSignal, 2400);
    }, 2000);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 0, 6.5], fov: 52 }} gl={{ alpha: true, antialias: true }} style={{ background: "transparent" }} dpr={[1, 2]}>
        <ambientLight intensity={0.18} />
        <pointLight position={[5, 5, 5]} intensity={0.9} color="#00F5FF" />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#7C3AED" />
        <pointLight position={[0, -5, -3]} intensity={0.3} color="#22C55E" />
        <GlobeScene onNavigate={(href) => router.push(href)} onNodeHover={setHoveredNode} />
      </Canvas>

      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            className="absolute top-1/2 -translate-y-1/2 left-3 w-60 rounded-xl border border-[#22D3EE]/20 bg-[#050914]/90 p-4 backdrop-blur-lg"
            style={{ boxShadow: "0 0 28px rgba(0,245,255,0.1)" }}
          >
            <p className="font-orbitron text-xs tracking-[0.18em] text-[#22D3EE]">{hoveredNode.label}</p>
            <p className="text-slate-400 text-xs mt-2 leading-[1.6]">{hoveredNode.blurb}</p>
            <p className="text-slate-500 text-xs mt-2 leading-[1.6]">{hoveredNode.desc}</p>
            <button
              onClick={() => router.push(hoveredNode.href)}
              className="mt-3 px-3 py-2 rounded-lg text-xs border border-[#22D3EE]/40 text-[#22D3EE] hover:bg-[#22D3EE]/10"
            >
              Explore →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 left-4 space-y-2 pointer-events-none">
        <AnimatePresence>
          {liveSignals.map((sig) => (
            <motion.div key={sig.id} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: "#22C55E", boxShadow: "0 0 6px #22C55E" }} />
              <span className="font-mono text-[9px] text-[#22C55E] tracking-wider">{sig.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] text-[#00F5FF] bg-black/70 px-3 py-1 rounded border border-[#00F5FF]/30 pointer-events-none whitespace-nowrap">
        Hover a node to inspect, click to navigate.
      </div>
    </div>
  );
}
