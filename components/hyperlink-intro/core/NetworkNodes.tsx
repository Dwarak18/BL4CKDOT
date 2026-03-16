"use client";
import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NodeData } from "@/hooks/useNetworkBuilder";
import { PhaseState } from "@/hooks/usePhaseTimeline";
import { colorToArray } from "@/utils/colorMapping";
import { COLORS, SPHERE_RADIUS } from "@/constants/introConfig";

interface Props {
  nodes:    NodeData[];
  stateRef: React.RefObject<PhaseState>;
}

const FIBONACCI_SPHERE_POSITIONS: THREE.Vector3[] = (() => {
  const pts: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < 80; i++) {
    const y     = 1 - (i / 79) * 2;
    const r     = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(SPHERE_RADIUS));
  }
  return pts;
})();

const dummy = new THREE.Object3D();

export default function NetworkNodes({ nodes, stateRef }: Props) {
  const meshRef    = useRef<THREE.InstancedMesh>(null);
  const colorArray = useMemo(() => new Float32Array(80 * 3), []);

  // Initialize colors buffer
  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.instanceColor = new THREE.InstancedBufferAttribute(colorArray, 3);
  }, [colorArray]);

  useFrame(() => {
    const mesh = meshRef.current;
    const s    = stateRef.current;
    if (!mesh || !s || nodes.length === 0) return;

    const collapse = s.collapseProgress;
    const count    = Math.min(nodes.length, 80);

    for (let i = 0; i < count; i++) {
      const n       = nodes[i];
      const isHub   = n.connectivity >= 4;
      const baseSize = isHub ? 0.07 : 0.045;
      const pulse    = 1 + (isHub ? 0.18 : 0.05) * Math.sin(Date.now() * 0.0025 + i * 0.8);

      // Position: lerp between network pos and sphere pos during collapse
      let targetPos: THREE.Vector3;
      if (collapse > 0 && FIBONACCI_SPHERE_POSITIONS[i]) {
        targetPos = new THREE.Vector3().lerpVectors(
          n.position,
          FIBONACCI_SPHERE_POSITIONS[i],
          collapse,
        );
      } else {
        targetPos = n.position;
      }

      dummy.position.copy(targetPos);
      dummy.scale.setScalar(baseSize * pulse * s.networkOpacity);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      // Color — hub nodes glow gold
      const [r, g, b] = isHub
        ? colorToArray(COLORS.gold)
        : colorToArray(n.color);
      colorArray[i * 3 + 0] = r;
      colorArray[i * 3 + 1] = g;
      colorArray[i * 3 + 2] = b;
    }

    // Hide unused slots
    dummy.scale.setScalar(0);
    dummy.updateMatrix();
    for (let i = count; i < 80; i++) {
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.count = count;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 80]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        vertexColors
        emissive={new THREE.Color(1, 1, 1)}
        emissiveIntensity={1.8}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
