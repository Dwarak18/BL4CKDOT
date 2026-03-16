"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PhaseState } from "@/hooks/usePhaseTimeline";
import { COLORS } from "@/constants/introConfig";

interface Props {
  stateRef: React.RefObject<PhaseState>;
}

/** Generate a rough world-map outline as a set of line points (simplified continents) */
function buildWorldMapLines(): THREE.BufferGeometry {
  // Simplified continent outlines in normalized -1..1 space, scaled to viewport
  const W = 9.0;
  const H = 5.0;

  // Rough bounding boxes for major landmasses as a series of rectangles + points
  // Each sub-array is a closed polygon: [x1,y1, x2,y2, ... x1,y1]
  const continents: [number, number][][] = [
    // North America
    [[-0.9,0.7],[-0.5,0.8],[0.0,0.65],[0.1,0.3],[-0.2,0.05],[-0.6,0.1],[-0.85,0.35],[-0.9,0.7]],
    // South America
    [[-0.5,-0.05],[-0.25,0.1],[-0.1,-0.1],[-0.15,-0.7],[-0.45,-0.65],[-0.6,-0.3],[-0.5,-0.05]],
    // Europe
    [[0.15,0.55],[0.35,0.72],[0.5,0.65],[0.45,0.45],[0.25,0.4],[0.15,0.55]],
    // Africa
    [[0.15,0.35],[0.4,0.4],[0.5,0.2],[0.45,-0.1],[0.3,-0.55],[0.1,-0.5],[0.05,-0.1],[0.15,0.35]],
    // Asia
    [[0.45,0.5],[0.65,0.75],[0.95,0.6],[0.95,0.25],[0.7,0.1],[0.45,0.2],[0.45,0.5]],
    // Australia
    [[0.65,-0.3],[0.85,-0.2],[0.9,-0.5],[0.7,-0.6],[0.55,-0.5],[0.65,-0.3]],
  ];

  const verts: number[] = [];
  for (const poly of continents) {
    for (let i = 0; i < poly.length - 1; i++) {
      const [x1, y1] = poly[i];
      const [x2, y2] = poly[i + 1];
      verts.push(x1 * W, y1 * H, -0.5, x2 * W, y2 * H, -0.5);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  return geo;
}

export default function WorldMapOverlay({ stateRef }: Props) {
  const lineRef = useRef<THREE.LineSegments>(null);

  const geo = useMemo(() => buildWorldMapLines(), []);

  useFrame(() => {
    const line = lineRef.current;
    const s    = stateRef.current;
    if (!line || !s) return;
    const mat = line.material as THREE.LineBasicMaterial;
    mat.opacity = s.worldMapOpacity;
    line.visible = s.worldMapOpacity > 0.001;
  });

  return (
    <lineSegments ref={lineRef} geometry={geo} frustumCulled={false}>
      <lineBasicMaterial
        color={COLORS.cyan}
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
      />
    </lineSegments>
  );
}
