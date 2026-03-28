// ── Signal Field data manager ─────────────────────────────────────────────────
import { useRef, useCallback } from "react";
import { buildNodeGrid, findCenterNodeIndex, findNearestIndices, NodeData } from "@/utils/gridBuilder";
import { buildConnections, Connection } from "@/utils/connectionBuilder";
import { createPulsesForConnection, PulseData, MAX_PULSES } from "@/utils/signalPulse";

export interface FieldData {
  nodes:       NodeData[];
  connections: Connection[];
  pulses:      PulseData[];
  centerIdx:   number;
  phase2Nodes: number[];   // indices of the 8 first-spread nodes
}

export function useSignalField() {
  const fieldRef = useRef<FieldData>({
    nodes:       [],
    connections: [],
    pulses:      [],
    centerIdx:   0,
    phase2Nodes: [],
  });

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  /** Called once when the canvas mounts — builds the complete field */
  const initField = useCallback(
    (width: number, height: number) => {
      clearTimers();
      const nodes       = buildNodeGrid(width, height, 90);
      const connections = buildConnections(nodes);
      const centerIdx   = findCenterNodeIndex(nodes, width / 2, height / 2);
      const phase2Nodes = findNearestIndices(centerIdx, nodes, 8, 130);

      fieldRef.current = {
        nodes,
        connections,
        pulses:      [],
        centerIdx,
        phase2Nodes,
      };
    },
    [clearTimers],
  );

  /** Helper: add pulses for a connection, respecting MAX_PULSES */
  const addPulsesFor = useCallback(
    (connIdx: number, field: FieldData) => {
      if (field.pulses.length >= MAX_PULSES) return;
      const conn     = field.connections[connIdx];
      if (!conn) return;
      const newPulses = createPulsesForConnection(connIdx, conn.color, conn.pulseCount);
      const remaining = MAX_PULSES - field.pulses.length;
      field.pulses.push(...newPulses.slice(0, remaining));
    },
    [],
  );

  /** Called by SignalFieldIntro when phase advances */
  const activatePhase = useCallback(
    (phase: number) => {
      clearTimers();
      const field   = fieldRef.current;
      const { nodes, connections, centerIdx, phase2Nodes } = field;
      const push    = (t: ReturnType<typeof setTimeout>) => timersRef.current.push(t);

      if (phase === 1) {
        // Reveal the center node immediately
        nodes[centerIdx].revealAt = performance.now();
      }

      if (phase === 2) {
        // Stagger-reveal the 8 nearest nodes at 80ms apart
        phase2Nodes.forEach((nodeIdx, i) => {
          push(setTimeout(() => {
            nodes[nodeIdx].revealAt = performance.now();
          }, i * 80));
        });

        // Connections involving these nodes draw on 100ms apart (after 200ms delay)
        const connIndices = connections
          .map((c, i) => ({ c, i }))
          .filter(({ c }) =>
            (c.from === centerIdx && phase2Nodes.includes(c.to))   ||
            (c.to   === centerIdx && phase2Nodes.includes(c.from)) ||
            (phase2Nodes.includes(c.from) && phase2Nodes.includes(c.to)),
          )
          .map(({ i }) => i);

        connIndices.forEach((idx, i) => {
          const delay = 200 + i * 100;
          push(setTimeout(() => {
            connections[idx].drawStart = performance.now();
          }, delay));
          // Pulses begin when draw-on finishes (300ms draw time)
          push(setTimeout(() => {
            addPulsesFor(idx, field);
          }, delay + 400));
        });
      }

      if (phase === 3) {
        // All remaining nodes: staggered 20ms apart (shuffled for organic feel)
        const revealed  = new Set([centerIdx, ...phase2Nodes]);
        const remaining = nodes
          .map((_, i) => i)
          .filter((i) => !revealed.has(i))
          .sort(() => Math.random() - 0.5);

        remaining.forEach((nodeIdx, i) => {
          push(setTimeout(() => {
            nodes[nodeIdx].revealAt = performance.now();
          }, i * 20));
        });

        // All remaining connections: staggered 15ms apart
        const phase2ConnSet = new Set<number>();
        connections.forEach((c, i) => {
          if (
            (c.from === centerIdx && phase2Nodes.includes(c.to))   ||
            (c.to   === centerIdx && phase2Nodes.includes(c.from)) ||
            (phase2Nodes.includes(c.from) && phase2Nodes.includes(c.to))
          ) {
            phase2ConnSet.add(i);
          }
        });

        connections.forEach((conn, idx) => {
          if (phase2ConnSet.has(idx) || conn.drawStart !== -1) return;
          const delay = idx * 15;   // stagger over ~9s for all conns
          push(setTimeout(() => {
            conn.drawStart = performance.now();
          }, delay));
          push(setTimeout(() => {
            addPulsesFor(idx, field);
          }, delay + 350));
        });
      }
    },
    [clearTimers, addPulsesFor],
  );

  return { fieldRef, initField, activatePhase };
}
