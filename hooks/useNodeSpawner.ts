import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { NodeData, Connection, createNode, createConnection, rebuildConnectivity } from "@/hooks/useNetworkBuilder";
import { generateNodePosition, findNearestNodes, canConnect } from "@/utils/networkTopology";
import { PHASE2_VISIT_POSITIONS, SPAWN_INTERVAL_MS, NODE_COUNT } from "@/constants/introConfig";

export function useNodeSpawner(phase: number) {
  const [nodes,       setNodes]       = useState<NodeData[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  const nodesRef       = useRef<NodeData[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const spawnTimerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const addNodeWithConnections = useCallback(
    (position: THREE.Vector3, maxConns = 3) => {
      const newNode = createNode(position);
      const near    = findNearestNodes(position, nodesRef.current, maxConns);
      const newConns: Connection[] = [];

      near.forEach((targetIdx) => {
        const targetNode = nodesRef.current[targetIdx];
        if (canConnect(newNode.id, targetNode.id, connectionsRef.current)) {
          const conn = createConnection(newNode.id, targetNode.id, newNode.domain);
          newConns.push(conn);
        }
      });

      // After adding connections, animate drawProgress → 1
      const connsWithDraw = newConns.map((c) => ({ ...c, drawProgress: 1 }));

      const updatedNodes = rebuildConnectivity(
        [...nodesRef.current, newNode],
        [...connectionsRef.current, ...connsWithDraw],
      );
      const updatedConns = [...connectionsRef.current, ...connsWithDraw];

      nodesRef.current       = updatedNodes;
      connectionsRef.current = updatedConns;

      setNodes([...updatedNodes]);
      setConnections([...updatedConns]);
    },
    [],
  );

  // Phase 2: seed the 5 visit positions
  useEffect(() => {
    if (phase !== 2) return;

    // Origin node at center
    addNodeWithConnections(new THREE.Vector3(0, 0, 0), 0);

    // 5 visit positions connected to origin
    PHASE2_VISIT_POSITIONS.forEach((pos) => {
      addNodeWithConnections(pos, 1);
    });
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Phase 3: rapid spawning
  useEffect(() => {
    if (phase !== 3) return;
    if (spawnTimerRef.current) return;

    spawnTimerRef.current = setInterval(() => {
      if (nodesRef.current.length >= NODE_COUNT) {
        if (spawnTimerRef.current) {
          clearInterval(spawnTimerRef.current);
          spawnTimerRef.current = null;
        }
        return;
      }
      const pos = generateNodePosition(nodesRef.current);
      addNodeWithConnections(pos, Math.floor(Math.random() * 3) + 1);
    }, SPAWN_INTERVAL_MS);

    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
        spawnTimerRef.current = null;
      }
    };
  }, [phase, addNodeWithConnections]);

  // Stop spawning when phase advances past 3
  useEffect(() => {
    if (phase > 3 && spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }
  }, [phase]);

  return { nodes, connections, nodesRef, connectionsRef };
}
