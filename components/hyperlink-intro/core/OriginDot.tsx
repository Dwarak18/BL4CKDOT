"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PhaseState } from "@/hooks/usePhaseTimeline";
import { COLORS } from "@/constants/introConfig";

interface Props {
  stateRef: React.RefObject<PhaseState>;
}

export default function OriginDot({ stateRef }: Props) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const ringRef  = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const ringProgressRef = useRef(0); // 0→1 expanding ring

  useFrame((_, delta) => {
    const s = stateRef.current;
    if (!s) return;

    const mesh  = meshRef.current;
    const ring  = ringRef.current;
    const light = lightRef.current;
    if (!mesh || !ring || !light) return;

    // Opacity / visibility
    const visible = s.dotOpacity > 0.01;
    mesh.visible  = visible;
    ring.visible  = visible && s.phase < 5;
    light.visible = visible;

    if (!visible) return;

    // Position follows dotPosition
    mesh.position.copy(s.dotPosition);
    light.position.copy(s.dotPosition);

    // Scale with elastic birth + breathing pulse
    const breathe  = 1 + 0.12 * Math.sin(Date.now() * 0.0024);
    const baseScale = s.dotScale * breathe;
    mesh.scale.setScalar(baseScale);

    // Update point light
    light.intensity = s.dotOpacity * 3.5;

    // Expanding ring
    if (s.phase >= 1 && s.phase < 5) {
      ringProgressRef.current = (ringProgressRef.current + delta * 0.8) % 1;
      const rScale = 1 + ringProgressRef.current * 5;
      const rOpacity = (1 - ringProgressRef.current) * 0.6;
      ring.scale.setScalar(rScale * s.dotScale);
      ring.position.copy(s.dotPosition);
      (ring.material as THREE.MeshBasicMaterial).opacity = rOpacity * s.dotOpacity;
    }
  });

  return (
    <group>
      {/* Core dot */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={COLORS.cyan}
          emissive={COLORS.cyan}
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* Expanding pulse ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.09, 0.008, 8, 32]} />
        <meshBasicMaterial
          color={COLORS.cyan}
          transparent
          opacity={0.5}
          toneMapped={false}
        />
      </mesh>

      {/* Neon point light */}
      <pointLight
        ref={lightRef}
        color={COLORS.cyan}
        intensity={3.5}
        distance={4}
        decay={2}
      />
    </group>
  );
}
