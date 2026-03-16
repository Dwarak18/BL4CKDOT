import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { NodeData } from "@/hooks/useNodePositions";
import type { AnimValues } from "@/hooks/useIntroTimeline";
import { easeInOutCubic, lerpVector3 } from "@/utils/spherePositions";

const NODE_COUNT = 185;

interface Props {
  nodes:    NodeData[];
  stateRef: MutableRefObject<AnimValues>;
  /** Exposed so EnergyPulse can read current positions */
  currentPositionsRef?: MutableRefObject<THREE.Vector3[]>;
}

export function NodeMesh({ nodes, stateRef, currentPositionsRef }: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 8, 8);
    const mat = new THREE.MeshStandardMaterial({
      transparent:       true,
      emissive:          new THREE.Color("#ffffff"),
      emissiveIntensity: 0.8,
      toneMapped:        false,
    });
    return { geometry: geo, material: mat };
  }, []);

  // Pre-allocate working objects
  const dummy      = useMemo(() => new THREE.Object3D(), []);
  const colorObj   = useMemo(() => new THREE.Color(), []);
  const workVec    = useMemo(() => new THREE.Vector3(), []);
  const currentPos = useMemo(
    () => nodes.map((n) => n.initialPos.clone()),
    [nodes],
  );

  // Expose current positions for EnergyPulse
  if (currentPositionsRef) {
    currentPositionsRef.current = currentPos;
  }

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const { networkOpacity, sphereProgress } = stateRef.current;
    const time = clock.getElapsedTime();
    const ease = easeInOutCubic(sphereProgress);

    for (let i = 0; i < NODE_COUNT; i++) {
      const node = nodes[i];

      // Lerp between scattered and sphere position
      lerpVector3(node.initialPos, node.spherePos, ease, workVec);

      // Float animation
      workVec.y += Math.sin(time * 0.4 + node.phase) * 0.08;
      workVec.x += Math.cos(time * 0.3 + node.phase) * 0.05;

      // Store current position for EnergyPulse
      currentPos[i].copy(workVec);

      // Pulse scale
      const pulseScale = 0.85 + 0.15 * Math.sin(time * 2.5 + node.phase);
      const scale      = node.size * 18 * pulseScale * networkOpacity;

      dummy.position.copy(workVec);
      dummy.scale.setScalar(Math.max(0, scale));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      colorObj.set(node.color);
      meshRef.current.setColorAt(i, colorObj);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, NODE_COUNT]}
      frustumCulled={false}
    />
  );
}
