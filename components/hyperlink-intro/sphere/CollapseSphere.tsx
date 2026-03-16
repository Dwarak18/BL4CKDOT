"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PhaseState } from "@/hooks/usePhaseTimeline";
import { COLORS } from "@/constants/introConfig";

interface Props {
  stateRef: React.RefObject<PhaseState>;
}

/** The final merged sphere that forms when nodes collapse in Phase 5 */
export default function CollapseSphere({ stateRef }: Props) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const glowRef  = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    const s = stateRef.current;
    if (!s) return;

    const mesh  = meshRef.current;
    const glow  = glowRef.current;
    const light = lightRef.current;
    if (!mesh || !glow || !light) return;

    const op      = s.sphereOpacity;
    const xOffset = s.sphereTargetX;

    mesh.visible  = op > 0.01;
    glow.visible  = op > 0.01;
    light.visible = op > 0.01;

    if (!mesh.visible) return;

    // Sphere moves right during phase 6
    mesh.position.x  = xOffset;
    glow.position.x  = xOffset;
    light.position.x = xOffset;

    // Slow rotation
    mesh.rotation.y += delta * 0.18;
    mesh.rotation.x += delta * 0.06;

    // Breathing glow
    const breathe = 1 + 0.07 * Math.sin(Date.now() * 0.0018);
    glow.scale.setScalar(breathe * 1.25);

    // Material opacity
    const mat  = mesh.material as THREE.MeshStandardMaterial;
    const gMat = glow.material as THREE.MeshBasicMaterial;
    mat.opacity  = op;
    gMat.opacity = op * 0.12;

    light.intensity = op * 4.5;
  });

  return (
    <group>
      {/* Core sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[3.0, 32, 32]} />
        <meshStandardMaterial
          color={COLORS.cyan}
          emissive={COLORS.cyan}
          emissiveIntensity={0.4}
          wireframe
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>

      {/* Outer glow shell */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[3.0, 16, 16]} />
        <meshBasicMaterial
          color={COLORS.cyan}
          transparent
          opacity={0}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <pointLight ref={lightRef} color={COLORS.cyan} intensity={0} distance={12} decay={2} />
    </group>
  );
}
