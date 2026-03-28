// ── Node grid builder ─────────────────────────────────────────────────────────
import { getDomainByIndex, getDomainColor, DomainType } from "./colorSystem";

export interface NodeData {
  id:           number;
  x:            number;       // FIXED after init — never changes
  y:            number;       // FIXED after init — never changes
  baseRadius:   number;       // 2.5–4.5px
  domain:       DomainType;
  color:        string;
  breathPhase:  number;       // random 0–2π for per-node breathing offset
  breathFreq:   number;       // 0.6–1.2 Hz
  connectivity: number;       // filled after buildConnections()
  revealAt:     number;       // performance.now() ms when visible, -1 = hidden
}

/** Build a tilted, jittered grid of nodes filling the given canvas area */
export function buildNodeGrid(
  width:   number,
  height:  number,
  spacing = 90,
): NodeData[] {
  const nodes: NodeData[] = [];
  const cols   = Math.floor(width  / spacing) + 2;
  const rows   = Math.floor(height / spacing) + 2;
  const offX   = (width  - (cols - 1) * spacing) / 2;
  const offY   = (height - (rows - 1) * spacing) / 2;

  // 12-degree tilt for depth illusion
  const tilt = 12 * (Math.PI / 180);

  let id = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const bx = offX + col * spacing;
      const by = offY + row * spacing;

      // Tilt transform
      const tx = bx * Math.cos(tilt) - by * Math.sin(tilt) * 0.3;
      const ty = by + bx * Math.sin(tilt) * 0.15;

      // Fixed organic jitter — set once, never recalculated
      const jx = (Math.random() - 0.5) * 28;
      const jy = (Math.random() - 0.5) * 28;

      const domain = getDomainByIndex(id);
      nodes.push({
        id,
        x:            tx + jx,
        y:            ty + jy,
        baseRadius:   2.5 + Math.random() * 2.0,
        domain,
        color:        getDomainColor(domain),
        breathPhase:  Math.random() * Math.PI * 2,
        breathFreq:   0.6 + Math.random() * 0.6,
        connectivity: 0,
        revealAt:     -1,
      });
      id++;
    }
  }
  return nodes;
}

/** Index of the node nearest to (cx, cy) — used to find the "origin" node */
export function findCenterNodeIndex(
  nodes: NodeData[],
  cx:    number,
  cy:    number,
): number {
  let best     = 0;
  let bestDist = Infinity;
  for (let i = 0; i < nodes.length; i++) {
    const d = Math.hypot(nodes[i].x - cx, nodes[i].y - cy);
    if (d < bestDist) { bestDist = d; best = i; }
  }
  return best;
}

/** Indices of the k nearest nodes to nodeIdx within maxDist */
export function findNearestIndices(
  nodeIdx: number,
  nodes:   NodeData[],
  k:       number,
  maxDist  = 130,
): number[] {
  const n = nodes[nodeIdx];
  return nodes
    .map((m, i) => ({ i, d: Math.hypot(m.x - n.x, m.y - n.y) }))
    .filter((x) => x.i !== nodeIdx && x.d <= maxDist)
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
    .map((x) => x.i);
}
