import { useMemo } from "react";
import * as THREE from "three";
import { fibonacciSphere } from "@/utils/spherePositions";

export type DomainType =
  | "innovation"
  | "ai"
  | "research"
  | "projects"
  | "apprenticeship";

export const DOMAIN_COLORS: Record<DomainType, string> = {
  innovation:    "#00f5ff",
  ai:            "#bf5fff",
  research:      "#39ff14",
  projects:      "#ffd700",
  apprenticeship:"#ffffff",
};

const DOMAINS: DomainType[] = [
  "innovation",
  "ai",
  "research",
  "projects",
  "apprenticeship",
];

export interface NodeData {
  id:         number;
  initialPos: THREE.Vector3;
  spherePos:  THREE.Vector3;
  color:      string;
  domain:     DomainType;
  size:       number;
  phase:      number; // random phase for float/pulse offset
}

const NODE_COUNT = 185;

export function useNodePositions(): NodeData[] {
  return useMemo(() => {
    const spherePositions = fibonacciSphere(NODE_COUNT, 3.2);
    const nodes: NodeData[] = [];

    // deterministic random using index as seed
    function seededRand(seed: number, salt: number): number {
      const x = Math.sin(seed * 127.1 + salt * 311.7) * 43758.5453;
      return x - Math.floor(x);
    }

    for (let i = 0; i < NODE_COUNT; i++) {
      const rx = (seededRand(i, 1) - 0.5) * 10; // [-5, 5]
      const ry = (seededRand(i, 2) - 0.5) * 10;
      const rz = (seededRand(i, 3) - 0.5) * 10;

      const domainIdx = Math.floor(seededRand(i, 4) * DOMAINS.length);
      const domain    = DOMAINS[domainIdx];
      const size      = 0.04 + seededRand(i, 5) * 0.04; // [0.04, 0.08]
      const phase     = seededRand(i, 6) * Math.PI * 2;

      nodes.push({
        id:         i,
        initialPos: new THREE.Vector3(rx, ry, rz),
        spherePos:  spherePositions[i],
        color:      DOMAIN_COLORS[domain],
        domain,
        size,
        phase,
      });
    }

    return nodes;
  }, []);
}
