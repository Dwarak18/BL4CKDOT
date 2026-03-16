import * as THREE from "three";
import { DomainType, getDomainType, getConnectionColor } from "@/utils/colorMapping";
import { COLORS } from "@/constants/introConfig";

// ── Types ────────────────────────────────────────────────────────────────────

export interface NodeData {
  id:             number;
  position:       THREE.Vector3;
  targetPosition: THREE.Vector3; // for collapse animation
  color:          string;
  connectivity:   number;
  birthTime:      number;
  domain:         DomainType;
}

export interface Connection {
  from:         number;
  to:           number;
  color:        string;
  drawProgress: number; // 0→1 line draw
  pulseOffset:  number; // random phase for energy pulse
}

export interface NetworkState {
  nodes:       NodeData[];
  connections: Connection[];
  hubNodes:    number[];
}

// ── Builder ──────────────────────────────────────────────────────────────────

let _nextId = 0;

export function createNode(
  position: THREE.Vector3,
  domain?: DomainType,
): NodeData {
  const id    = _nextId++;
  const d     = domain ?? getDomainType(id);
  const color = d === "research" ? COLORS.green
              : d === "ai"        ? COLORS.purple
              : d === "innovation"? COLORS.cyan
              :                     COLORS.gold;
  return {
    id,
    position:       position.clone(),
    targetPosition: position.clone(),
    color,
    connectivity:   0,
    birthTime:      performance.now(),
    domain:         d,
  };
}

export function createConnection(
  fromId: number,
  toId:   number,
  fromDomain: DomainType,
): Connection {
  return {
    from:         fromId,
    to:           toId,
    color:        getConnectionColor(fromDomain),
    drawProgress: 0,
    pulseOffset:  Math.random(),
  };
}

/** Rebuild connectivity count for all nodes from connections array */
export function rebuildConnectivity(
  nodes: NodeData[],
  connections: Connection[],
): NodeData[] {
  const counts = new Map<number, number>();
  nodes.forEach((n) => counts.set(n.id, 0));
  connections.forEach((c) => {
    counts.set(c.from, (counts.get(c.from) ?? 0) + 1);
    counts.set(c.to,   (counts.get(c.to)   ?? 0) + 1);
  });
  return nodes.map((n) => ({ ...n, connectivity: counts.get(n.id) ?? 0 }));
}

/** Find hub node indices (connectivity >= threshold) */
export function findHubs(nodes: NodeData[], threshold = 4): number[] {
  return nodes
    .filter((n) => n.connectivity >= threshold)
    .map((_, i) => i);
}

/** Reset the id counter (call when unmounting) */
export function resetNodeIdCounter() {
  _nextId = 0;
}
