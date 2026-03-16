"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NodeData, Connection } from "@/hooks/useNetworkBuilder";
import { PhaseState } from "@/hooks/usePhaseTimeline";
import { colorToArray } from "@/utils/colorMapping";
import { SPHERE_RADIUS } from "@/constants/introConfig";

interface Props {
  nodes:       NodeData[];
  connections: Connection[];
  stateRef:    React.RefObject<PhaseState>;
}

const FIBONACCI_SPHERE_POSITIONS: THREE.Vector3[] = (() => {
  const pts: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < 80; i++) {
    const y     = 1 - (i / 79) * 2;
    const r     = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push(
      new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r)
        .multiplyScalar(SPHERE_RADIUS),
    );
  }
  return pts;
})();

const MAX_LINES     = 300; // max connections
const POS_BUF_SIZE  = MAX_LINES * 2 * 3; // 2 vertices per line, xyz each
const COL_BUF_SIZE  = MAX_LINES * 2 * 3;

export default function ConnectionLines({ nodes, connections, stateRef }: Props) {
  const lineRef = useRef<THREE.LineSegments>(null);

  const { posAttr, colAttr } = useMemo(() => {
    const posAttr = new THREE.BufferAttribute(new Float32Array(POS_BUF_SIZE), 3);
    const colAttr = new THREE.BufferAttribute(new Float32Array(COL_BUF_SIZE), 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    colAttr.setUsage(THREE.DynamicDrawUsage);
    return { posAttr, colAttr };
  }, []);

  // Map nodeId → index in nodes array
  const nodeIdMap = useMemo(() => {
    const m = new Map<number, number>();
    nodes.forEach((n, i) => m.set(n.id, i));
    return m;
  }, [nodes]);

  useFrame(() => {
    const line = lineRef.current;
    const s    = stateRef.current;
    if (!line || !s) return;

    const collapse = s.collapseProgress;
    const alpha    = s.networkOpacity;
    const count    = Math.min(connections.length, MAX_LINES);
    const positions = posAttr.array as Float32Array;
    const colors    = colAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const conn   = connections[i];
      const fromIdx = nodeIdMap.get(conn.from) ?? 0;
      const toIdx   = nodeIdMap.get(conn.to)   ?? 0;
      const fromNode = nodes[fromIdx];
      const toNode   = nodes[toIdx];
      if (!fromNode || !toNode) continue;

      // Lerp positions during collapse
      let fromPos: THREE.Vector3;
      let toPos:   THREE.Vector3;
      if (collapse > 0 && FIBONACCI_SPHERE_POSITIONS[fromIdx] && FIBONACCI_SPHERE_POSITIONS[toIdx]) {
        fromPos = new THREE.Vector3().lerpVectors(fromNode.position, FIBONACCI_SPHERE_POSITIONS[fromIdx], collapse);
        toPos   = new THREE.Vector3().lerpVectors(toNode.position,   FIBONACCI_SPHERE_POSITIONS[toIdx],   collapse);
      } else {
        fromPos = fromNode.position;
        toPos   = toNode.position;
      }

      const base = i * 6;
      positions[base + 0] = fromPos.x;
      positions[base + 1] = fromPos.y;
      positions[base + 2] = fromPos.z;
      positions[base + 3] = toPos.x;
      positions[base + 4] = toPos.y;
      positions[base + 5] = toPos.z;

      // Color fade with opacity — collapse makes lines fade out
      const lineAlpha = alpha * (1 - collapse * 0.8);
      const [r, g, b] = colorToArray(conn.color);
      colors[base + 0] = r * lineAlpha;
      colors[base + 1] = g * lineAlpha;
      colors[base + 2] = b * lineAlpha;
      colors[base + 3] = r * lineAlpha * 0.6;
      colors[base + 4] = g * lineAlpha * 0.6;
      colors[base + 5] = b * lineAlpha * 0.6;
    }

    // Zero out unused slots
    for (let i = count * 6; i < POS_BUF_SIZE; i++) {
      positions[i] = 0;
      colors[i]    = 0;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    (line.geometry as THREE.BufferGeometry).setDrawRange(0, count * 2);
  });

  return (
    <lineSegments ref={lineRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" {...posAttr} />
        <bufferAttribute attach="attributes-color"    {...colAttr} />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </lineSegments>
  );
}
