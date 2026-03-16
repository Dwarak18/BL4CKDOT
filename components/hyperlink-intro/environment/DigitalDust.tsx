"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "@/constants/introConfig";

/** 400 slow-drifting ambient particles */
export default function DigitalDust() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const count = 400;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 2] = 0;
    }
    return { positions: pos, velocities: vel };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame(() => {
    const pts = pointsRef.current;
    if (!pts) return;

    const posAttr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const arr     = posAttr.array as Float32Array;

    for (let i = 0; i < 400; i++) {
      arr[i * 3 + 0] += velocities[i * 3 + 0];
      arr[i * 3 + 1] += velocities[i * 3 + 1];

      // Wrap around edges
      if (arr[i * 3 + 0] > 7)  arr[i * 3 + 0] = -7;
      if (arr[i * 3 + 0] < -7) arr[i * 3 + 0] =  7;
      if (arr[i * 3 + 1] > 5)  arr[i * 3 + 1] = -5;
      if (arr[i * 3 + 1] < -5) arr[i * 3 + 1] =  5;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geo} frustumCulled={false}>
      <pointsMaterial
        color={COLORS.cyan}
        size={0.018}
        transparent
        opacity={0.18}
        sizeAttenuation
        depthWrite={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
