// ── Connection graph builder ──────────────────────────────────────────────────
import { NodeData } from "./gridBuilder";

export interface Connection {
  from:       number;     // node index
  to:         number;     // node index
  color:      string;     // source-node domain color
  weight:     number;     // line width: 0.5–1.5px
  cpOffset:   number;     // bezier breathing seed (0–2π)
  cpSign:     number;     // +1 or -1 — controls curve direction
  pulseCount: number;     // 1 normal, 2–3 high-traffic
  drawStart:  number;     // performance.now() when draw-on begins, -1 = not started
}

const MAX_DIST         = 110; // px — maximum connection distance
const MAX_PER_NODE     = 4;   // max connections per node

export function buildConnections(nodes: NodeData[]): Connection[] {
  const connections: Connection[] = [];
  const countMap = new Map<number, number>();
  nodes.forEach((_, i) => countMap.set(i, 0));

  // Collect all candidate pairs sorted by distance
  const pairs: Array<{ i: number; j: number; d: number }> = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(
        nodes[i].x - nodes[j].x,
        nodes[i].y - nodes[j].y,
      );
      if (d <= MAX_DIST) pairs.push({ i, j, d });
    }
  }
  pairs.sort((a, b) => a.d - b.d);

  const seen = new Set<string>();
  for (const { i, j } of pairs) {
    if ((countMap.get(i) ?? 0) >= MAX_PER_NODE) continue;
    if ((countMap.get(j) ?? 0) >= MAX_PER_NODE) continue;
    const key = `${i}-${j}`;
    if (seen.has(key)) continue;
    seen.add(key);

    connections.push({
      from:       i,
      to:         j,
      color:      nodes[i].color,
      weight:     0.5 + Math.random() * 1.0,
      cpOffset:   Math.random() * Math.PI * 2,
      cpSign:     Math.random() < 0.5 ? 1 : -1,
      pulseCount: 1,
      drawStart:  -1,
    });

    countMap.set(i, (countMap.get(i) ?? 0) + 1);
    countMap.set(j, (countMap.get(j) ?? 0) + 1);
  }

  // Rebuild node connectivity counts
  nodes.forEach((n) => { n.connectivity = 0; });
  connections.forEach((c) => {
    nodes[c.from].connectivity++;
    nodes[c.to].connectivity++;
  });

  // High-traffic connections carry more pulses
  connections.forEach((c) => {
    const total = nodes[c.from].connectivity + nodes[c.to].connectivity;
    if (total >= 6) c.pulseCount = 2;
    if (total >= 9) c.pulseCount = 3;
    // High connectivity → thicker line
    if (nodes[c.from].connectivity >= 4) c.weight = 1.2 + Math.random() * 0.3;
  });

  return connections;
}
