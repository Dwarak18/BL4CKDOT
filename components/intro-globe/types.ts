import type { CubicBezierPath } from "@/math/bezier";
import type { Vec2, Vec3 } from "@/math/lerp";

export interface TrailGhost {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  radius: number;
  bornAt: number;
}

export interface NodeData {
  id: number;
  x: number;
  y: number;
  sphere3D: Vec3;
  screenX: number;
  screenY: number;
  morphProgress: number;
  color: string;
  radius: number;
  baseRadius: number;
  phase: number;
  freq: number;
  opacity: number;
  cluster: number;
  isOrigin: boolean;
  connectivity: number;
  localIndex: number;
}

export interface ConnectionData {
  id: number;
  fromId: number;
  toId: number;
  color: string;
  drawProgress: number;
  opacity: number;
  weight: number;
  pulseOffset: number;
  cluster: number;
  order: number;
  isBridge?: boolean;
}

export interface ClusterData {
  id: number;
  nodeIds: number[];
  cx: number;
  cy: number;
  driftX: number;
  driftY: number;
  color: string;
  visible: boolean;
  opacity: number;
  label: string;
}

export interface LabelAnchor {
  text: string;
  nodeId: number;
  color: string;
  dx: number;
  dy: number;
}

export interface IntroSceneData {
  width: number;
  height: number;
  path: CubicBezierPath;
  nodes: NodeData[];
  connections: ConnectionData[];
  clusters: ClusterData[];
  guideNodeIds: number[];
  firstConnectionId: number;
  bridgeConnectionIds: number[];
  labelAnchors: LabelAnchor[];
  flatCenter: Vec2;
}

export interface IntroPhaseState {
  phase: number;
  scanlineProgress: number;
  dotOpacity: number;
  dotScale: number;
  dotTravelProgress: number;
  guideOpacity: number;
  foundNodeOpacity: number;
  firstLineVisible: number;
  firstFlash: number;
  firstSignalProgress: number;
  clusterReveal: number;
  otherClustersReveal: number;
  bridgeReveal: number;
  webReveal: number;
  morphProgress: number;
  sceneScale: number;
  globeDim: number;
  titleOpacity: number;
  labelOpacity: number;
  globeOffsetProgress: number;
  globeScale: number;
  uiOpacity: number;
  leftCurtainOpacity: number;
  youLabelOpacity: number;
  textContent: string;
  textOpacity: number;
}
