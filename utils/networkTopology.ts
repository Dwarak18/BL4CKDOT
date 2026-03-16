import * as THREE from "three";
import { NodeData, Connection } from "@/hooks/useNetworkBuilder";
import { CONNECTION_SNAP_DIST, MAX_CONNECTIONS_PER_NODE } from "@/constants/introConfig";

/** Returns indices of nearest ≤ count nodes to a given position */
export function findNearestNodes(
  pos: THREE.Vector3,
  nodes: NodeData[],
  count: number,
  maxDist: number = CONNECTION_SNAP_DIST,
): number[] {
  const distances = nodes.map((n, i) => ({ i, d: pos.distanceTo(n.position) }));
  distances.sort((a, b) => a.d - b.d);
  return distances
    .filter((x) => x.d < maxDist && x.d > 0.01)
    .slice(0, count)
    .map((x) => x.i);
}

/** Generate a new node position spread across viewport, biased toward clusters */
export function generateNodePosition(
  existing: NodeData[],
  viewportW: number = 10,
  viewportH: number = 6,
): THREE.Vector3 {
  // 30% chance to cluster near existing node, 70% spread
  if (existing.length > 5 && Math.random() < 0.3) {
    const base = existing[Math.floor(Math.random() * existing.length)];
    const offset = new THREE.Vector3(
      (Math.random() - 0.5) * 2.5,
      (Math.random() - 0.5) * 2.5,
      (Math.random() - 0.5) * 0.4,
    );
    const pos = base.position.clone().add(offset);
    pos.x = Math.max(-viewportW / 2, Math.min(viewportW / 2, pos.x));
    pos.y = Math.max(-viewportH / 2, Math.min(viewportH / 2, pos.y));
    pos.z = Math.max(-0.5, Math.min(0.5, pos.z));
    return pos;
  }

  return new THREE.Vector3(
    (Math.random() - 0.5) * viewportW,
    (Math.random() - 0.5) * viewportH,
    (Math.random() - 0.5) * 0.6,
  );
}

/** Count connections per node, returns map of nodeId → count */
export function calculateConnectivity(
  nodes: NodeData[],
  connections: Connection[],
): Map<number, number> {
  const counts = new Map<number, number>();
  nodes.forEach((n) => counts.set(n.id, 0));
  connections.forEach((c) => {
    counts.set(c.from, (counts.get(c.from) ?? 0) + 1);
    counts.set(c.to, (counts.get(c.to) ?? 0) + 1);
  });
  return counts;
}

/** Returns node ids whose connectivity is >= threshold (hub nodes) */
export function findHubNodes(
  connectivity: Map<number, number>,
  threshold: number = 4,
): number[] {
  const hubs: number[] = [];
  connectivity.forEach((count, id) => {
    if (count >= threshold) hubs.push(id);
  });
  return hubs;
}

/** Check if connecting two nodes would exceed max connections */
export function canConnect(
  fromId: number,
  toId: number,
  connections: Connection[],
): boolean {
  const fromCount = connections.filter(
    (c) => c.from === fromId || c.to === fromId,
  ).length;
  const toCount = connections.filter(
    (c) => c.from === toId || c.to === toId,
  ).length;
  const alreadyConnected = connections.some(
    (c) =>
      (c.from === fromId && c.to === toId) ||
      (c.from === toId && c.to === fromId),
  );
  return (
    !alreadyConnected &&
    fromCount < MAX_CONNECTIONS_PER_NODE &&
    toCount < MAX_CONNECTIONS_PER_NODE
  );
}
