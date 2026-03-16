"use client";
import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { AnimValues } from "@/hooks/useIntroTimeline";

interface EcoNode {
  position: THREE.Vector3;
  label:    string;
  desc:     string;
  color:    string;
  route:    string;
}

const ECOSYSTEM_NODES: EcoNode[] = [
  {
    position: new THREE.Vector3(3.5, 1.5, 1.5),
    label:    "IDEA FORGE",
    desc:     "Submit ideas and transform them into real systems with mentorship.",
    color:    "#00f5ff",
    route:    "/register/innovator",
  },
  {
    position: new THREE.Vector3(-3.2, 2.0, -1.0),
    label:    "PROJECT LAB",
    desc:     "Collaborate on cutting-edge engineering projects with BL4CKDOT.",
    color:    "#bf5fff",
    route:    "/projects",
  },
  {
    position: new THREE.Vector3(0.5, -3.5, 2.0),
    label:    "RESEARCH HUB",
    desc:     "Deep research in AI, IoT, Cybersecurity, and Micro-LLM systems.",
    color:    "#39ff14",
    route:    "/research",
  },
  {
    position: new THREE.Vector3(-2.0, -2.0, 3.0),
    label:    "APPRENTICESHIP",
    desc:     "Learn by building. Join the BL4CKDOT engineering apprenticeship.",
    color:    "#ffffff",
    route:    "/register/student",
  },
  {
    position: new THREE.Vector3(2.5, -1.0, -3.5),
    label:    "INNOVATION NETWORK",
    desc:     "Connect with companies, founders, and engineers worldwide.",
    color:    "#ffd700",
    route:    "/register/company",
  },
];

interface NodeProps {
  node:       EcoNode;
  index:      number;
  stateRef:   MutableRefObject<AnimValues>;
}

function EcoNodeMesh({ node, index, stateRef }: NodeProps) {
  const sphereRef = useRef<THREE.Mesh>(null!);
  const ringRef   = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const neonColor = useMemo(() => new THREE.Color(node.color), [node.color]);

  useFrame(({ clock }) => {
    const { networkOpacity } = stateRef.current;
    const t = clock.getElapsedTime();

    if (sphereRef.current) {
      const s = hovered
        ? 1.4 + 0.1 * Math.sin(t * 6)
        : 1.0 + 0.08 * Math.sin(t * 2.5 + index);
      sphereRef.current.scale.setScalar(s * networkOpacity);
      (sphereRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        hovered ? 2.5 : 1.2;
    }

    if (ringRef.current) {
      (ringRef.current.material as THREE.MeshStandardMaterial).opacity =
        (hovered ? 0.8 : 0.3) * networkOpacity;
    }
  });

  return (
    <group
      position={node.position}
      onPointerEnter={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerLeave={() => { setHovered(false); document.body.style.cursor = "default"; }}
      onClick={() => router.push(node.route)}
    >
      {/* Core sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial
          color={neonColor}
          emissive={neonColor}
          emissiveIntensity={1.2}
          toneMapped={false}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.22, 32]} />
        <meshStandardMaterial
          color={neonColor}
          emissive={neonColor}
          emissiveIntensity={0.8}
          transparent
          opacity={0.3}
          toneMapped={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* HTML Tooltip */}
      <Html position={[0, 0.35, 0]} center distanceFactor={6} zIndexRange={[100, 0]}>
        <div style={{ pointerEvents: "none", userSelect: "none", minWidth: 140 }}>
          {/* Always-visible label */}
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: node.color,
              textShadow: `0 0 16px ${node.color}80`,
              textAlign: "center",
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            {node.label}
          </p>

          {/* Hover tooltip */}
          {hovered && (
            <div
              style={{
                marginTop: 6,
                background: "rgba(7,11,20,0.92)",
                border: `1px solid ${node.color}40`,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: 8,
                padding: "10px 12px",
                maxWidth: 180,
                pointerEvents: "auto",
              }}
            >
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, margin: 0, lineHeight: 1.5, fontFamily: "'JetBrains Mono', monospace" }}>
                {node.desc}
              </p>
              <p
                style={{
                  color: node.color,
                  fontSize: 9,
                  marginTop: 6,
                  letterSpacing: "0.2em",
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  pointerEvents: "auto",
                }}
              >
                → Enter
              </p>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

interface Props {
  stateRef: MutableRefObject<AnimValues>;
}

export function EcosystemLabels({ stateRef }: Props) {
  return (
    <>
      {ECOSYSTEM_NODES.map((node, i) => (
        <EcoNodeMesh key={node.label} node={node} index={i} stateRef={stateRef} />
      ))}
    </>
  );
}
