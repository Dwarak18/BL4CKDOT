import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { NodeData } from "@/hooks/useNodePositions";
import type { AnimValues } from "@/hooks/useIntroTimeline";
import type { Connection } from "@/utils/networkGraph";
import { easeInOutCubic, lerpVector3 } from "@/utils/spherePositions";

interface Props {
  nodes:       NodeData[];
  connections: Connection[];
  stateRef:    MutableRefObject<AnimValues>;
  currentPositionsRef: MutableRefObject<THREE.Vector3[]>;
}

function seededRand(seed: number): number {
  const x = Math.sin(seed * 211.7 + 43758.5) * 43758.5453;
  return x - Math.floor(x);
}

export function ConnectionLines({
  nodes,
  connections,
  stateRef,
  currentPositionsRef,
}: Props) {
  const linesRef = useRef<THREE.LineSegments>(null!);
  const matRef   = useRef<THREE.LineBasicMaterial>(null!);

  const { geometry, posAttr, colorAttr, randomPhases } = useMemo(() => {
    const n = connections.length;
    const pos   = new Float32Array(n * 2 * 3);
    const color = new Float32Array(n * 2 * 3);
    const phases: number[] = [];

    for (let i = 0; i < n; i++) {
      phases.push(seededRand(i * 13));
    }

    const geo = new THREE.BufferGeometry();
    const pa  = new THREE.BufferAttribute(pos,   3).setUsage(THREE.DynamicDrawUsage);
    const ca  = new THREE.BufferAttribute(color, 3).setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute("position", pa);
    geo.setAttribute("color",    ca);

    return { geometry: geo, posAttr: pa, colorAttr: ca, randomPhases: phases };
  }, [connections]);

  const colorA = useMemo(() => new THREE.Color(), []);
  const colorB = useMemo(() => new THREE.Color(), []);
  const workA  = useMemo(() => new THREE.Vector3(), []);
  const workB  = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    if (!linesRef.current || !matRef.current) return;
    const { networkOpacity, sphereProgress } = stateRef.current;
    const time = clock.getElapsedTime();
    const ease = easeInOutCubic(sphereProgress);
    const curPos = currentPositionsRef.current;

    for (let i = 0; i < connections.length; i++) {
      const { from, to } = connections[i];
      const nodeA = nodes[from];
      const nodeB = nodes[to];

      // Use the already-computed current position if available; else compute it
      if (curPos && curPos[from] && curPos[to]) {
        workA.copy(curPos[from]);
        workB.copy(curPos[to]);
      } else {
        lerpVector3(nodeA.initialPos, nodeA.spherePos, ease, workA);
        lerpVector3(nodeB.initialPos, nodeB.spherePos, ease, workB);
      }

      const i6 = i * 6;
      posAttr.array[i6    ] = workA.x;
      posAttr.array[i6 + 1] = workA.y;
      posAttr.array[i6 + 2] = workA.z;
      posAttr.array[i6 + 3] = workB.x;
      posAttr.array[i6 + 4] = workB.y;
      posAttr.array[i6 + 5] = workB.z;

      // Animated color pulse
      const pulse = (Math.sin(time * 1.5 + randomPhases[i] * Math.PI * 2) + 1) / 2;
      colorA.set(nodeA.color);
      colorB.set(nodeB.color);
      colorA.lerp(colorB, pulse);

      colorAttr.array[i6    ] = colorA.r;
      colorAttr.array[i6 + 1] = colorA.g;
      colorAttr.array[i6 + 2] = colorA.b;
      colorAttr.array[i6 + 3] = colorA.r;
      colorAttr.array[i6 + 4] = colorA.g;
      colorAttr.array[i6 + 5] = colorA.b;
    }

    posAttr.needsUpdate   = true;
    colorAttr.needsUpdate = true;
    matRef.current.opacity = networkOpacity * 0.5;
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial
        ref={matRef}
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}
