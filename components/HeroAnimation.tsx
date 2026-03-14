"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";

type Stage = 1 | 2 | 3 | 4;

const STAGE_TEXT: Record<Stage, string> = {
  1: "Every innovation begins with a single idea.",
  2: "Ideas connect. Innovation grows.",
  3: "A network of builders, researchers, and innovators.",
  4: "BL4CKDOT Innovation Network.",
};

const DOMAIN_COLORS = [
  "#7C3AED", // AI systems
  "#22C55E", // Research
  "#F59E0B", // Projects
  "#22D3EE", // Innovation lab
  "#FFFFFF", // Apprenticeship
];

interface NodeData {
  position: THREE.Vector3;
  target: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  scale: number;
  domain: number;
}

interface Edge {
  a: number;
  b: number;
}

interface Pulse {
  edge: Edge;
  offset: number;
  speed: number;
  color: string;
}

function fibonacciSphere(count: number, radius: number) {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push(
      new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius,
      ),
    );
  }
  return pts;
}

// Soft binary rain columns in the background
function BinaryRain() {
  const group = useRef<THREE.Group>(null);
  const columns = useMemo(() => {
    return Array.from({ length: 18 }, () => ({
      x: (Math.random() - 0.5) * 18,
      z: (Math.random() - 0.5) * 6,
      speed: 0.4 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    columns.forEach((c, i) => {
      const mesh = group.current?.children[i] as THREE.Mesh;
      if (!mesh) return;
      const y = ((t * c.speed + c.offset) % 6) - 3;
      mesh.position.set(c.x, y, c.z);
      const alpha = 0.08 + 0.08 * Math.sin(t * 0.6 + c.offset);
      (mesh.material as THREE.MeshBasicMaterial).opacity = alpha;
    });
  });

  return (
    <group ref={group} position={[0, 0, -3]}>
      {columns.map((c, i) => (
        <mesh key={i} position={[c.x, 0, c.z]}>
          <boxGeometry args={[0.03, 0.5, 0.03]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.12} />
        </mesh>
      ))}
    </group>
  );
}

// Floating dust particles for depth
function FloatingDust({ count = 280 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const particles = useMemo(() => {
    const temp: { pos: THREE.Vector3; vel: THREE.Vector3; size: number }[] = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        pos: new THREE.Vector3((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 12),
        vel: new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02),
        size: Math.random() * 0.06 + 0.02,
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!mesh.current) return;
    particles.forEach((p, i) => {
      p.pos.add(p.vel);
      if (p.pos.length() > 9) p.pos.multiplyScalar(0.6);
      dummy.position.copy(p.pos);
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined as never, undefined as never, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#38BDF8" transparent opacity={0.25} depthWrite={false} />
    </instancedMesh>
  );
}

function NetworkField({ stage }: { stage: Stage }) {
  const nodesRef = useRef<NodeData[]>([]);
  const edgeRef = useRef<Edge[]>([]);
  const linePositions = useRef<Float32Array | null>(null);
  const lineGeom = useRef<THREE.BufferGeometry | null>(null);
  const pulseMesh = useRef<THREE.InstancedMesh>(null);
  const pulses = useRef<Pulse[]>([]);
  const ideaRef = useRef<THREE.Mesh>(null);
  const ideaRipple = useRef<THREE.Mesh>(null);
  const instancedNodes = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { mouse } = useThree();

  const count = 220;
  const spherePositions = useMemo(() => fibonacciSphere(count, 3), [count]);
  const clusterCenters = useMemo(() => [
    new THREE.Vector3(-2.2, 1.2, 0),
    new THREE.Vector3(2.1, 1.1, 0),
    new THREE.Vector3(-2.0, -1.0, 0.6),
    new THREE.Vector3(2.2, -0.8, -0.4),
    new THREE.Vector3(0, 0.2, 0.9),
  ], []);

  // Initialize nodes
  useMemo(() => {
    const data: NodeData[] = [];
    for (let i = 0; i < count; i++) {
      const domain = i % DOMAIN_COLORS.length;
      data.push({
        position: new THREE.Vector3(0, 0, 0),
        target: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(),
        color: new THREE.Color(DOMAIN_COLORS[domain]),
        scale: i === 0 ? 1 : 0,
        domain,
      });
    }
    nodesRef.current = data;
  }, [count]);

  // Build edges upfront for performance
  useMemo(() => {
    const edges: Edge[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dist = spherePositions[i].distanceTo(spherePositions[j]);
        if (dist < 1.5 && edges.length < 780) edges.push({ a: i, b: j });
      }
    }
    edgeRef.current = edges;
    linePositions.current = new Float32Array(edges.length * 6);
    lineGeom.current = new THREE.BufferGeometry();
    lineGeom.current.setAttribute("position", new THREE.BufferAttribute(linePositions.current, 3));
    pulses.current = edges.slice(0, 60).map((edge, i) => ({
      edge,
      offset: Math.random(),
      speed: 0.2 + (i % 7) * 0.05,
      color: DOMAIN_COLORS[i % DOMAIN_COLORS.length],
    }));
  }, [count, spherePositions]);

  // Stage transitions for node targets
  useEffect(() => {
    if (stage === 1) {
      nodesRef.current.forEach((n, i) => {
        n.target.set(0, 0, 0);
        n.scale = i === 0 ? 1.2 : 0;
      });
    }
    if (stage === 2) {
      nodesRef.current.forEach((n, i) => {
        if (i === 0) return;
        const angle = Math.random() * Math.PI * 2;
        const radius = 1.2 + Math.random() * 1.8;
        const y = (Math.random() - 0.5) * 0.8;
        n.target.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
        n.scale = 0.4 + Math.random() * 0.4;
      });
    }
    if (stage === 3) {
      nodesRef.current.forEach((n, i) => {
        const center = clusterCenters[n.domain % clusterCenters.length];
        const jitter = new THREE.Vector3(
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.8,
        );
        n.target.copy(center).add(jitter);
        n.scale = 0.55 + Math.random() * 0.5;
      });
    }
    if (stage === 4) {
      nodesRef.current.forEach((n, i) => {
        n.target.copy(spherePositions[i]);
        n.scale = i < 5 ? 1.2 : 0.42 + Math.random() * 0.25;
      });
    }
  }, [stage, spherePositions, clusterCenters]);

  // Energy pulses setColor
  useEffect(() => {
    if (!pulseMesh.current) return;
    pulses.current.forEach((p, i) => {
      const c = new THREE.Color(p.color);
      pulseMesh.current!.setColorAt(i, c);
    });
    pulseMesh.current.instanceColor!.needsUpdate = true;
  }, []);

  const visibleRef = useRef(1);

  // Interaction push on hover
  const interactionTarget = useRef(new THREE.Vector3());

  useFrame(({ clock, viewport }) => {
    const t = clock.getElapsedTime();
    const desired = stage === 1 ? 1 : stage === 2 ? 120 : stage === 3 ? 170 : count;
    visibleRef.current += (desired - visibleRef.current) * 0.06;
    const active = Math.min(count, Math.floor(visibleRef.current));

    const mousePoint = new THREE.Vector3(mouse.x * viewport.width * 0.5, mouse.y * viewport.height * 0.5, 0);
    interactionTarget.current.lerp(mousePoint, 0.08);

    // Idea dot pulse + ripple
    if (ideaRef.current) {
      const pulse = 1.0 + Math.sin(t * 2.6) * 0.16;
      ideaRef.current.scale.setScalar(1.6 * pulse);
    }
    if (ideaRipple.current) {
      const ripple = 1.0 + Math.sin(t * 1.8) * 0.5;
      ideaRipple.current.scale.setScalar(2.4 * ripple);
      (ideaRipple.current.material as THREE.MeshBasicMaterial).opacity = 0.14 + Math.sin(t * 2.0) * 0.06;
    }

    // Update nodes
    if (instancedNodes.current) {
      const inst = instancedNodes.current;
      for (let i = 0; i < active; i++) {
        const node = nodesRef.current[i];
        const repulse = node.target.clone().normalize().multiplyScalar(0.04);
        if (stage === 4) {
          const diff = node.position.clone().sub(interactionTarget.current);
          const dist = diff.length();
          if (dist < 1.2) {
            const push = diff.normalize().multiplyScalar((1.2 - dist) * 0.08);
            node.velocity.add(push);
          }
        }
        node.velocity.lerp(node.target.clone().sub(node.position).multiplyScalar(0.12), 0.4);
        node.velocity.add(repulse.multiplyScalar(0.4));
        node.position.add(node.velocity.multiplyScalar(0.96));

        const scale = node.scale * (stage === 4 && i < 5 ? 1.4 : 1.0);
        dummy.position.copy(node.position);
        dummy.scale.setScalar(scale * 0.08 + (i === 0 && stage === 1 ? 0.1 : 0));
        dummy.updateMatrix();
        inst.setMatrixAt(i, dummy.matrix);
        inst.setColorAt(i, node.color);
      }
      inst.count = active;
      inst.instanceMatrix.needsUpdate = true;
      if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
    }

    // Update lines
    if (linePositions.current && lineGeom.current) {
      const arr = linePositions.current;
      edgeRef.current.forEach((e, idx) => {
        const a = nodesRef.current[e.a];
        const b = nodesRef.current[e.b];
        const start = idx * 6;
        arr[start] = a.position.x; arr[start + 1] = a.position.y; arr[start + 2] = a.position.z;
        arr[start + 3] = b.position.x; arr[start + 4] = b.position.y; arr[start + 5] = b.position.z;
      });
      lineGeom.current.attributes.position.needsUpdate = true;
    }

    // Pulses along edges
    if (pulseMesh.current) {
      const inst = pulseMesh.current;
      pulses.current.forEach((p, i) => {
        const from = nodesRef.current[p.edge.a].position;
        const to = nodesRef.current[p.edge.b].position;
        const progress = (t * p.speed + p.offset) % 1;
        dummy.position.lerpVectors(from, to, progress);
        dummy.scale.setScalar(0.045);
        dummy.updateMatrix();
        inst.setMatrixAt(i, dummy.matrix);
      });
      inst.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <group>
        <mesh ref={ideaRipple}>
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.16} depthWrite={false} />
        </mesh>
        <mesh ref={ideaRef}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={2.4} />
        </mesh>
      </group>

      <instancedMesh ref={instancedNodes} args={[undefined as never, undefined as never, count]}>
        <sphereGeometry args={[1, 18, 18]} />
        <meshStandardMaterial
          color="#22D3EE"
          emissive="#22D3EE"
          emissiveIntensity={1.8}
          vertexColors
          roughness={0.2}
          metalness={0.4}
        />
      </instancedMesh>

      {lineGeom.current && (
        <lineSegments geometry={lineGeom.current}>
          <lineBasicMaterial color="#38BDF8" transparent opacity={0.4} />
        </lineSegments>
      )}

      <instancedMesh ref={pulseMesh} args={[undefined as never, undefined as never, pulses.current.length]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial transparent opacity={0.9} depthWrite={false} vertexColors />
      </instancedMesh>

      <BinaryRain />
      <FloatingDust />
    </>
  );
}

function AssistantOrb({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 3 }}
      className="fixed bottom-6 right-6 z-50 rounded-full p-3 shadow-lg"
      style={{ background: "radial-gradient(circle at 30% 30%, #22D3EE, #0EA5E9)", boxShadow: "0 0 25px rgba(34,211,238,0.45)" }}
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold font-mono tracking-widest"
        style={{ background: "rgba(7,11,20,0.9)", border: "1px solid rgba(34,211,238,0.3)", boxShadow: "0 0 16px rgba(34,211,238,0.5)" }}>
        DOT
      </div>
    </motion.button>
  );
}

function AssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-24 right-6 z-50 w-72 rounded-2xl border border-[#22D3EE]/30 bg-[#050914]/95 p-4 backdrop-blur-lg shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono tracking-[0.2em] text-[#22D3EE]">DOT / AI ASSISTANT</p>
              <p className="text-sm text-slate-300 mt-1">Welcome to BL4CKDOT.</p>
              <p className="text-sm text-slate-400">Where ideas become real systems.</p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-[#22D3EE] text-sm">×</button>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 leading-relaxed">
            Ask DOT about our labs, apprenticeships, or how to turn your idea into a deployed prototype.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function HeroAnimation({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<Stage>(1);
  const [showCanvas, setShowCanvas] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const timelineRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("bl4ck_hero_v3")) {
        setShowCanvas(false);
        setContentVisible(true);
        return;
      }
    } catch { /* ignore */ }

    timelineRef.current = gsap.context(() => {
      const tl = gsap.timeline();
      tl.call(() => setStage(1));
      tl.to({}, { duration: 1.8 });
      tl.call(() => setStage(2));
      tl.to({}, { duration: 1.8 });
      tl.call(() => setStage(3));
      tl.to({}, { duration: 2.0 });
      tl.call(() => setStage(4));
      tl.to({}, { duration: 1.6 });
      tl.call(() => setContentVisible(true));
      tl.to({}, {
        duration: 0.8,
        onComplete: () => {
          setShowCanvas(false);
          try { sessionStorage.setItem("bl4ck_hero_v3", "1"); } catch { /* ignore */ }
        },
      });
    });

    return () => timelineRef.current?.revert();
  }, []);

  const skip = () => {
    timelineRef.current?.revert();
    setStage(4);
    setContentVisible(true);
    setShowCanvas(false);
    try { sessionStorage.setItem("bl4ck_hero_v3", "1"); } catch { /* ignore */ }
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: contentVisible ? 1 : 0 }}
        transition={{ duration: 1 }}
        style={{ pointerEvents: contentVisible ? "auto" : "none" }}
      >
        {children}
      </motion.div>

      <AssistantOrb onOpen={() => setAssistantOpen(true)} />
      <AssistantPanel open={assistantOpen} onClose={() => setAssistantOpen(false)} />

      <AnimatePresence>
        {showCanvas && (
          <motion.div
            className="absolute inset-0 z-40 overflow-hidden bg-[#050914]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
          >
            <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
              <PerspectiveCamera position={[0, 0, 8]} fov={55} makeDefault />
              <color attach="background" args={["#050914"]} />
              <fog attach="fog" args={["#050914", 6, 14]} />
              <ambientLight intensity={0.18} />
              <pointLight position={[4, 4, 5]} intensity={1.1} color="#22D3EE" />
              <pointLight position={[-4, -2, 6]} intensity={0.6} color="#7C3AED" />
              <pointLight position={[0, -5, -4]} intensity={0.4} color="#22C55E" />

              <NetworkField stage={stage} />

              <Html position={[0, 0, 0]} center style={{ pointerEvents: "none" }}>
                <div className="absolute inset-0" />
              </Html>
            </Canvas>

            {/* Copy overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5 }}
                  className="text-center px-6"
                >
                  <p className="font-orbitron text-base sm:text-xl text-[#22D3EE] tracking-[0.22em]" style={{ textShadow: "0 0 24px rgba(34,211,238,0.6)" }}>
                    {STAGE_TEXT[stage]}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-none">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} style={{ width: 32, height: 3, borderRadius: 9999, background: stage >= s ? "#22D3EE" : "rgba(34,211,238,0.2)", boxShadow: stage >= s ? "0 0 12px rgba(34,211,238,0.6)" : "none" }} />
              ))}
            </div>

            {/* Skip */}
            <button
              onClick={skip}
              className="absolute top-6 right-6 font-mono text-[10px] tracking-[0.3em] text-slate-500 hover:text-[#22D3EE] border border-slate-800 hover:border-[#22D3EE]/50 px-3 py-1.5 rounded transition-all duration-200"
            >
              SKIP →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
