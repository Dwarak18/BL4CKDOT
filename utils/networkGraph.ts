import * as THREE from "three";

export interface Connection {
  from: number;
  to:   number;
  dist: number;
}

interface PosNode {
  initialPos: THREE.Vector3;
  spherePos:  THREE.Vector3;
}

export function buildConnections(
  nodes:      PosNode[],
  maxDist    = 2.5,
  maxPerNode = 5,
): Connection[] {
  const connections: Connection[] = [];
  const countMap: number[] = new Array(nodes.length).fill(0);

  for (let i = 0; i < nodes.length; i++) {
    if (countMap[i] >= maxPerNode) continue;
    for (let j = i + 1; j < nodes.length; j++) {
      if (countMap[j] >= maxPerNode) continue;
      const dist = nodes[i].initialPos.distanceTo(nodes[j].initialPos);
      if (dist < maxDist) {
        connections.push({ from: i, to: j, dist });
        countMap[i]++;
        countMap[j]++;
        if (countMap[i] >= maxPerNode) break;
      }
    }
  }

  return connections;
}

export function buildSphereConnections(
  nodes:      PosNode[],
  maxDist    = 1.8,
  maxPerNode = 4,
): Connection[] {
  const connections: Connection[] = [];
  const countMap: number[] = new Array(nodes.length).fill(0);

  for (let i = 0; i < nodes.length; i++) {
    if (countMap[i] >= maxPerNode) continue;
    for (let j = i + 1; j < nodes.length; j++) {
      if (countMap[j] >= maxPerNode) continue;
      const dist = nodes[i].spherePos.distanceTo(nodes[j].spherePos);
      if (dist < maxDist) {
        connections.push({ from: i, to: j, dist });
        countMap[i]++;
        countMap[j]++;
        if (countMap[i] >= maxPerNode) break;
      }
    }
  }

  return connections;
}
