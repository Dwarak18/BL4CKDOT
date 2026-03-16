"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PhaseState } from "@/hooks/usePhaseTimeline";
import { COLORS } from "@/constants/introConfig";

interface Props {
  stateRef: React.RefObject<PhaseState>;
}

export default function OrbitRings({ stateRef }: Props) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const s = stateRef.current;
    if (!s) return;

    const opacity = s.sphereOpacity;
    const xOffset = s.sphereTargetX;

    const rings = [ring1Ref.current, ring2Ref.current, ring3Ref.current];
    const speeds  = [0.4, -0.28, 0.18];
    const tilts   = [0, Math.PI / 4, Math.PI / 2.5];
    const colors  = [COLORS.cyan, COLORS.purple, COLORS.green];

    rings.forEach((ring, i) => {
      if (!ring) return;
      ring.visible = opacity > 0.01;
      if (!ring.visible) return;

      ring.position.x = xOffset;
      ring.rotation.x += speeds[i] * delta;
      ring.rotation.y += speeds[i] * 0.5 * delta;
      ring.rotation.z = tilts[i];

      (ring.material as THREE.MeshBasicMaterial).opacity = opacity * 0.55;
    });
  });

  return (
    <group>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.3, 0.018, 8, 80]} />
        <meshBasicMaterial color={COLORS.cyan} transparent opacity={0} toneMapped={false}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.6, 0.012, 8, 80]} />
        <meshBasicMaterial color={COLORS.purple} transparent opacity={0} toneMapped={false}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[3.9, 0.009, 8, 80]} />
        <meshBasicMaterial color={COLORS.green} transparent opacity={0} toneMapped={false}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}
