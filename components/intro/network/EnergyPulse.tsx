import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { NodeData } from "@/hooks/useNodePositions";
import type { AnimValues } from "@/hooks/useIntroTimeline";
import type { Connection } from "@/utils/networkGraph";

const PULSE_COUNT = 30;

interface PulseState {
  connIdx: number;
  t:       number;
  speed:   number;
}

interface Props {
  nodes:       NodeData[];
  connections: Connection[];
  stateRef:    MutableRefObject<AnimValues>;
  currentPositionsRef: MutableRefObject<THREE.Vector3[]>;
}

function seededRand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function EnergyPulse({
  nodes,
  connections,
  stateRef,
  currentPositionsRef,
}: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy   = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);
  const workPos  = useMemo(() => new THREE.Vector3(), []);

  const pulseStates = useMemo<PulseState[]>(() => {
    return Array.from({ length: PULSE_COUNT }, (_, i) => ({
      connIdx: Math.floor(seededRand(i * 7) * Math.max(1, connections.length)),
      t:       seededRand(i * 13),
      speed:   0.3 + seededRand(i * 17) * 0.4,
    }));
  }, [connections.length]);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 6, 6);
    const mat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity:     0.9,
      toneMapped:  false,
      blending:    THREE.AdditiveBlending,
    });
    return { geometry: geo, material: mat };
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current || connections.length === 0) return;
    const { networkOpacity } = stateRef.current;
    const curPos = currentPositionsRef.current;

    for (let i = 0; i < PULSE_COUNT; i++) {
      const p = pulseStates[i];
      p.t += delta * p.speed;

      if (p.t > 1) {
        p.t       = 0;
        p.connIdx = Math.floor(Math.random() * connections.length);
        p.speed   = 0.3 + Math.random() * 0.4;
      }

      const conn   = connections[p.connIdx];
      const posA   = curPos[conn.from];
      const posB   = curPos[conn.to];
      if (!posA || !posB) continue;

      workPos.lerpVectors(posA, posB, p.t);
      const scale = 0.06 * networkOpacity;

      dummy.position.copy(workPos);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      colorObj.set(nodes[conn.from].color);
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
      args={[geometry, material, PULSE_COUNT]}
      frustumCulled={false}
    />
  );
}
