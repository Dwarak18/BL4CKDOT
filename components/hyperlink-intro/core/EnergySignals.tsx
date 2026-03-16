"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NodeData, Connection } from "@/hooks/useNetworkBuilder";
import { PhaseState } from "@/hooks/usePhaseTimeline";
import { colorToArray } from "@/utils/colorMapping";

interface Props {
  nodes:       NodeData[];
  connections: Connection[];
  stateRef:    React.RefObject<PhaseState>;
}

const MAX_PULSES = 60;
const dummy      = new THREE.Object3D();

export default function EnergySignals({ nodes, connections, stateRef }: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const timeRef = useRef(0);

  // Stable pulse assignment: each pulse slot → a connection index
  const pulseAssignments = useMemo(
    () => Array.from({ length: MAX_PULSES }, (_, i) => i % Math.max(1, connections.length)),
    [connections.length],
  );

  const nodeIdMap = useMemo(() => {
    const m = new Map<number, number>();
    nodes.forEach((n, i) => m.set(n.id, i));
    return m;
  }, [nodes]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    const s    = stateRef.current;
    if (!mesh || !s || connections.length === 0) return;

    timeRef.current += delta;
    const t = timeRef.current;

    const alpha = s.networkOpacity * (1 - s.collapseProgress * 0.9);
    if (alpha < 0.01) {
      mesh.count = 0;
      return;
    }

    const count = Math.min(MAX_PULSES, connections.length);
    for (let i = 0; i < count; i++) {
      const connIdx = pulseAssignments[i] % connections.length;
      const conn    = connections[connIdx];
      const fromIdx = nodeIdMap.get(conn.from) ?? 0;
      const toIdx   = nodeIdMap.get(conn.to)   ?? 0;
      const fromNode = nodes[fromIdx];
      const toNode   = nodes[toIdx];
      if (!fromNode || !toNode) continue;

      // Pulse progress: continuous 0→1 loop with per-pulse offset
      const speed = 0.4; // seconds per traversal
      const progress = ((t / speed) + conn.pulseOffset) % 1;

      // Interpolate along line
      dummy.position.lerpVectors(fromNode.position, toNode.position, progress);
      dummy.scale.setScalar(0.025 * alpha);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      // Color
      const [r, g, b] = colorToArray(conn.color);
      mesh.setColorAt(i, new THREE.Color(r, g, b));
    }

    // Hide unused
    dummy.scale.setScalar(0);
    dummy.updateMatrix();
    for (let i = count; i < MAX_PULSES; i++) {
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.count = count;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_PULSES]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        emissive={new THREE.Color(1, 1, 1)}
        emissiveIntensity={3}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
        vertexColors
      />
    </instancedMesh>
  );
}
