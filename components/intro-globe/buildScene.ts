import {
  CLUSTER_COUNTS,
  DOMAIN_LABELS,
  GLOBE_RADIUS,
  GUIDE_NODE_COUNT,
  INTRO_COLORS,
} from "@/constants/introGlobeConfig";
import { sphericalToCartesian } from "@/math/sphere";
import type { IntroSceneData, NodeData, ConnectionData, ClusterData, LabelAnchor } from "./types";

const CLUSTER0_OFFSETS = [
  { x: 0, y: 0, color: INTRO_COLORS.cyan, isOrigin: true },
  { x: 58, y: -18, color: INTRO_COLORS.softBlue },
  { x: -62, y: -42, color: INTRO_COLORS.cyan },
  { x: -20, y: -82, color: INTRO_COLORS.green },
  { x: 34, y: -86, color: INTRO_COLORS.purple },
  { x: 92, y: -34, color: INTRO_COLORS.cyan },
  { x: -88, y: 8, color: INTRO_COLORS.green },
  { x: -26, y: 58, color: INTRO_COLORS.purple },
  { x: 30, y: 86, color: INTRO_COLORS.cyan },
  { x: 96, y: 58, color: INTRO_COLORS.green },
] as const;

const CLUSTER_REGION_CENTERS = [
  { lat: 0.12, lon: 0.55 },
  { lat: 0.82, lon: 0.2 },
  { lat: 0.08, lon: 1.45 },
  { lat: -0.72, lon: 0.45 },
  { lat: 0.02, lon: -1.55 },
] as const;

const CLUSTER_CENTER_FACTORS = [
  { x: 0.5, y: 0.5, color: INTRO_COLORS.cyan },
  { x: 0.53, y: 0.23, color: INTRO_COLORS.purple },
  { x: 0.78, y: 0.48, color: INTRO_COLORS.green },
  { x: 0.58, y: 0.78, color: INTRO_COLORS.gold },
  { x: 0.22, y: 0.53, color: INTRO_COLORS.apprenticeship },
] as const;

const LABEL_OFFSETS = [
  { dx: 28, dy: -34 },
  { dx: 30, dy: -28 },
  { dx: 34, dy: -26 },
  { dx: 32, dy: 26 },
  { dx: -148, dy: -12 },
] as const;

function noise(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453123;
  return value - Math.floor(value);
}

function centeredNoise(seed: number, amplitude: number): number {
  return (noise(seed) * 2 - 1) * amplitude;
}

function distance(a: NodeData, b: NodeData): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function buildSpherePoint(clusterId: number, localIndex: number, count: number) {
  const center = CLUSTER_REGION_CENTERS[clusterId];
  const spiral = localIndex * 2.399963229728653 + clusterId * 0.81;
  const ring = Math.sqrt((localIndex + 0.65) / Math.max(1, count));
  const latSpread = clusterId === 0 ? 0.42 : 0.58;
  const lonSpread = clusterId === 0 ? 0.85 : 1.08;

  const latitude = Math.max(
    -1.25,
    Math.min(1.25, center.lat + Math.sin(spiral) * latSpread * ring * 0.6),
  );
  const longitude = center.lon + Math.cos(spiral) * lonSpread * ring;

  return sphericalToCartesian(latitude, longitude, GLOBE_RADIUS);
}

function buildGenericClusterNodes(
  clusterId: number,
  startId: number,
  count: number,
  centerX: number,
  centerY: number,
  color: string,
): NodeData[] {
  const nodes: NodeData[] = [];
  const spreadX = clusterId === 2 ? 146 : clusterId === 4 ? 138 : 128;
  const spreadY = clusterId === 1 ? 98 : clusterId === 3 ? 110 : 102;

  for (let localIndex = 0; localIndex < count; localIndex++) {
    const spiral = localIndex * 2.399963229728653 + clusterId * 0.57;
    const ring = Math.sqrt((localIndex + 0.8) / count);
    const x = centerX + Math.cos(spiral) * spreadX * ring + centeredNoise(startId + localIndex * 3, 18);
    const y = centerY + Math.sin(spiral) * spreadY * ring + centeredNoise(startId + localIndex * 5, 14);
    const accentRatio = noise(startId + localIndex * 17);
    const accentColor =
      accentRatio > 0.84 ? INTRO_COLORS.cyan :
      accentRatio > 0.72 ? INTRO_COLORS.white :
      color;

    nodes.push({
      id: startId + localIndex,
      x,
      y,
      sphere3D: buildSpherePoint(clusterId, localIndex, count),
      screenX: x,
      screenY: y,
      morphProgress: 0,
      color: accentColor,
      radius: 3.2 + noise(startId + localIndex * 11) * 2.4,
      baseRadius: 3.2 + noise(startId + localIndex * 11) * 2.4,
      phase: noise(startId + localIndex * 7) * Math.PI * 2,
      freq: 0.8 + noise(startId + localIndex * 13) * 0.8,
      opacity: 0,
      cluster: clusterId,
      isOrigin: false,
      connectivity: 0,
      localIndex,
    });
  }

  return nodes;
}

function connectNearestNeighbors(
  nodes: NodeData[],
  nodeIds: number[],
  clusterId: number,
  orderOffset: number,
): ConnectionData[] {
  const connections: ConnectionData[] = [];
  const degreeMap = new Map<number, number>();
  const seen = new Set<string>();
  const maxPerNode = clusterId === 0 ? 4 : 5;
  const desiredPerNode = clusterId === 0 ? 3 : 4;
  const maxDistance = clusterId === 0 ? 182 : 172;

  nodeIds.forEach((id) => degreeMap.set(id, 0));

  for (const sourceId of nodeIds) {
    let createdForSource = 0;
    const source = nodes[sourceId];
    const sortedTargets = nodeIds
      .filter((candidateId) => candidateId !== sourceId)
      .map((candidateId) => ({
        candidateId,
        dist: distance(source, nodes[candidateId]),
      }))
      .filter((item) => item.dist <= maxDistance)
      .sort((a, b) => a.dist - b.dist);

    for (const { candidateId } of sortedTargets) {
      if (createdForSource >= desiredPerNode) {
        break;
      }
      if ((degreeMap.get(sourceId) ?? 0) >= maxPerNode) {
        break;
      }
      if ((degreeMap.get(candidateId) ?? 0) >= maxPerNode) {
        continue;
      }

      const key =
        sourceId < candidateId ? `${sourceId}-${candidateId}` : `${candidateId}-${sourceId}`;
      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      degreeMap.set(sourceId, (degreeMap.get(sourceId) ?? 0) + 1);
      degreeMap.set(candidateId, (degreeMap.get(candidateId) ?? 0) + 1);
      createdForSource += 1;

      connections.push({
        id: orderOffset + connections.length,
        fromId: sourceId,
        toId: candidateId,
        color: source.color,
        drawProgress: 0,
        opacity: clusterId === 0 ? 0.5 : 0.38,
        weight: clusterId === 0 ? 1.15 : 0.72 + noise(sourceId * 9 + candidateId * 7) * 0.7,
        pulseOffset: noise(sourceId * 11 + candidateId * 19),
        cluster: clusterId,
        order: connections.length,
      });
    }
  }

  return connections;
}

export function buildIntroScene(width: number, height: number): IntroSceneData {
  const nodes: NodeData[] = [];
  const clusters: ClusterData[] = [];
  const labelAnchors: LabelAnchor[] = [];
  const flatCenter = { x: width * 0.5, y: height * 0.5 };
  const path = {
    p0: { x: width * 0.15, y: height * 0.78 },
    p1: { x: width * 0.22, y: height * 0.55 },
    p2: { x: width * 0.4, y: height * 0.42 },
    p3: { x: width * 0.5, y: height * 0.5 },
  };

  const scale = Math.min(width, height) / 900;
  let nextNodeId = 0;

  type ClusterZeroOffset = {
    x: number;
    y: number;
    color: string;
    isOrigin?: boolean;
  };

  CLUSTER0_OFFSETS.forEach((offset, localIndex) => {
    const normalizedOffset = offset as ClusterZeroOffset;
    nodes.push({
      id: nextNodeId,
      x: flatCenter.x + normalizedOffset.x * scale,
      y: flatCenter.y + normalizedOffset.y * scale,
      sphere3D: buildSpherePoint(0, localIndex, CLUSTER_COUNTS[0]),
      screenX: flatCenter.x + normalizedOffset.x * scale,
      screenY: flatCenter.y + normalizedOffset.y * scale,
      morphProgress: 0,
      color: normalizedOffset.color,
      radius: normalizedOffset.isOrigin ? 6 : 3.4 + noise(nextNodeId * 13 + 7) * 1.6,
      baseRadius: normalizedOffset.isOrigin ? 6 : 3.4 + noise(nextNodeId * 13 + 7) * 1.6,
      phase: noise(nextNodeId * 17 + 3) * Math.PI * 2,
      freq: 0.9 + noise(nextNodeId * 7 + 5) * 0.7,
      opacity: 0,
      cluster: 0,
      isOrigin: Boolean(normalizedOffset.isOrigin),
      connectivity: 0,
      localIndex,
    });
    nextNodeId += 1;
  });

  clusters.push({
    id: 0,
    nodeIds: nodes.map((node) => node.id),
    cx: flatCenter.x,
    cy: flatCenter.y,
    driftX: 0,
    driftY: 0,
    color: INTRO_COLORS.cyan,
    visible: true,
    opacity: 1,
    label: DOMAIN_LABELS[0],
  });

  for (let clusterId = 1; clusterId < CLUSTER_COUNTS.length; clusterId++) {
    const count = CLUSTER_COUNTS[clusterId];
    const center = CLUSTER_CENTER_FACTORS[clusterId];
    const startId = nextNodeId;
    const clusterNodes = buildGenericClusterNodes(
      clusterId,
      startId,
      count,
      width * center.x,
      height * center.y,
      center.color,
    );

    nodes.push(...clusterNodes);
    clusters.push({
      id: clusterId,
      nodeIds: clusterNodes.map((node) => node.id),
      cx: width * center.x,
      cy: height * center.y,
      driftX: 0,
      driftY: 0,
      color: center.color,
      visible: true,
      opacity: 0,
      label: DOMAIN_LABELS[clusterId],
    });
    nextNodeId += count;
  }

  const connections: ConnectionData[] = [];
  let connectionOffset = 0;

  clusters.forEach((cluster) => {
    const clusterConnections = connectNearestNeighbors(
      nodes,
      cluster.nodeIds,
      cluster.id,
      connectionOffset,
    );
    connectionOffset += clusterConnections.length;
    connections.push(...clusterConnections);
  });

  const bridgePairs = [
    [clusters[0].nodeIds[5], clusters[1].nodeIds[2]],
    [clusters[0].nodeIds[9], clusters[2].nodeIds[3]],
    [clusters[0].nodeIds[8], clusters[3].nodeIds[4]],
    [clusters[0].nodeIds[6], clusters[4].nodeIds[5]],
    [clusters[1].nodeIds[11], clusters[2].nodeIds[6]],
    [clusters[2].nodeIds[12], clusters[3].nodeIds[6]],
    [clusters[3].nodeIds[10], clusters[4].nodeIds[7]],
    [clusters[4].nodeIds[13], clusters[1].nodeIds[8]],
  ] as const;

  bridgePairs.forEach(([fromId, toId], index) => {
    const connectionId = connectionOffset + index;
    connections.push({
      id: connectionId,
      fromId,
      toId,
      color: nodes[fromId].color,
      drawProgress: 0,
      opacity: 0.46,
      weight: 1.05,
      pulseOffset: noise(fromId * 31 + toId * 17),
      cluster: nodes[fromId].cluster,
      order: index,
      isBridge: true,
    });
  });

  const firstConnectionIndex = connections.findIndex(
    (connection) =>
      (connection.fromId === 0 && connection.toId === 1) ||
      (connection.fromId === 1 && connection.toId === 0),
  );

  if (firstConnectionIndex === -1) {
    connections.unshift({
      id: 0,
      fromId: 0,
      toId: 1,
      color: INTRO_COLORS.cyan,
      drawProgress: 0,
      opacity: 0.7,
      weight: 1,
      pulseOffset: 0,
      cluster: 0,
      order: 0,
    });
  } else if (firstConnectionIndex > 0) {
    const [firstConnection] = connections.splice(firstConnectionIndex, 1);
    connections.unshift(firstConnection);
  }

  connections.forEach((connection, index) => {
    connection.id = index;
  });

  const bridgeConnectionIds = connections
    .filter((connection) => connection.isBridge)
    .map((connection) => connection.id);

  connections.forEach((connection) => {
    nodes[connection.fromId].connectivity += 1;
    nodes[connection.toId].connectivity += 1;
  });

  labelAnchors.push(
    {
      text: DOMAIN_LABELS[0],
      nodeId: clusters[0].nodeIds[1],
      color: INTRO_COLORS.cyan,
      dx: LABEL_OFFSETS[0].dx,
      dy: LABEL_OFFSETS[0].dy,
    },
    {
      text: DOMAIN_LABELS[1],
      nodeId: clusters[1].nodeIds[5],
      color: INTRO_COLORS.purple,
      dx: LABEL_OFFSETS[1].dx,
      dy: LABEL_OFFSETS[1].dy,
    },
    {
      text: DOMAIN_LABELS[2],
      nodeId: clusters[2].nodeIds[5],
      color: INTRO_COLORS.green,
      dx: LABEL_OFFSETS[2].dx,
      dy: LABEL_OFFSETS[2].dy,
    },
    {
      text: DOMAIN_LABELS[3],
      nodeId: clusters[3].nodeIds[6],
      color: INTRO_COLORS.gold,
      dx: LABEL_OFFSETS[3].dx,
      dy: LABEL_OFFSETS[3].dy,
    },
    {
      text: DOMAIN_LABELS[4],
      nodeId: clusters[4].nodeIds[7],
      color: INTRO_COLORS.apprenticeship,
      dx: LABEL_OFFSETS[4].dx,
      dy: LABEL_OFFSETS[4].dy,
    },
  );

  return {
    width,
    height,
    path,
    nodes,
    connections,
    clusters,
    guideNodeIds: clusters[0].nodeIds.slice(1, 1 + GUIDE_NODE_COUNT),
    firstConnectionId: 0,
    bridgeConnectionIds,
    labelAnchors,
    flatCenter,
  };
}
