"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  FOCAL_LENGTH,
  GLOBE_RADIUS,
  INTRO_COLORS,
  MAX_ACTIVE_PULSES,
  MAX_TRAIL_GHOSTS,
  TRAVEL_DOT_RADIUS,
} from "@/constants/introGlobeConfig";
import { buildIntroScene } from "./buildScene";
import type { IntroPhaseState, IntroSceneData, TrailGhost } from "./types";
import { getCubicBezierPoint } from "@/math/bezier";
import { easeInOutPower2, easeInOutPower3, easeOutSine, clamp01 } from "@/math/easing";
import { clamp, lerp, lerpVec2 } from "@/math/lerp";
import { projectPoint, rotateY, sphericalToCartesian } from "@/math/sphere";

interface CanvasSize {
  width: number;
  height: number;
  dpr: number;
}

interface OriginMarker {
  x: number;
  y: number;
  visible: boolean;
}

interface Props {
  stateRef: React.RefObject<IntroPhaseState>;
  size: CanvasSize;
  originScreenRef: React.MutableRefObject<OriginMarker>;
}

interface DrawNode {
  x: number;
  y: number;
  alpha: number;
  scale: number;
}

interface DrawConnection {
  connectionId: number;
  color: string;
  pulseOffset: number;
  isBridge: boolean;
  from: DrawNode;
  to: DrawNode;
  progress: number;
  alpha: number;
}

const LATITUDES = [-72, -48, -24, 0, 24, 48, 72];
const LONGITUDE_COUNT = 12;

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1).toFixed(3)})`;
}

function getClusterNodeReveal(state: IntroPhaseState, cluster: number, localIndex: number): number {
  if (cluster === 0) {
    if (localIndex === 0) {
      return Math.max(state.firstLineVisible, state.clusterReveal);
    }
    if (localIndex === 1) {
      return Math.max(state.foundNodeOpacity, state.clusterReveal);
    }
    return clamp01(state.clusterReveal * 1.35 - (localIndex - 1) * 0.11);
  }

  const clusterDelay = (cluster - 1) * 0.22;
  const clusterProgress = clamp01(state.otherClustersReveal * 1.5 - clusterDelay);
  return clamp01(clusterProgress * 1.3 - localIndex * 0.028);
}

function getConnectionReveal(
  state: IntroPhaseState,
  connectionId: number,
  firstConnectionId: number,
  cluster: number,
  order: number,
  isBridge: boolean,
): number {
  if (connectionId === firstConnectionId) {
    return state.firstLineVisible;
  }

  if (isBridge) {
    return clamp01(state.bridgeReveal * 1.45 - order * 0.12);
  }

  if (cluster === 0) {
    return clamp01(state.clusterReveal * 1.4 - order * 0.075);
  }

  const clusterDelay = (cluster - 1) * 0.2;
  const clusterProgress = clamp01(state.otherClustersReveal * 1.5 - clusterDelay);
  return clamp01(clusterProgress * 1.25 - order * 0.032);
}

function drawPartialLine(
  ctx: CanvasRenderingContext2D,
  from: DrawNode,
  to: DrawNode,
  progress: number,
): void {
  const endPoint = lerpVec2(from, to, progress);
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.stroke();
}

function drawPulse(
  ctx: CanvasRenderingContext2D,
  from: DrawNode,
  to: DrawNode,
  t: number,
  radius: number,
  color: string,
  alpha: number,
): void {
  const point = lerpVec2(from, to, t);
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = hexToRgba(color, alpha);
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawGlobeWireframe(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: IntroPhaseState,
  elapsedSec: number,
): void {
  if (state.morphProgress <= 0.04) {
    return;
  }

  const center = {
    x: lerp(width * 0.5, width * 0.6, state.globeOffsetProgress),
    y: height * 0.5,
  };
  const rotation = elapsedSec * 0.048;
  const opacity = clamp01(state.morphProgress * 1.2) * 0.42 * state.globeDim;
  const radius = GLOBE_RADIUS * state.globeScale;

  LATITUDES.forEach((latitudeDeg) => {
    const latitude = (latitudeDeg * Math.PI) / 180;
    const steps = 48;

    ctx.beginPath();
    for (let index = 0; index <= steps; index++) {
      const longitude = (index / steps) * Math.PI * 2;
      const point = rotateY(
        sphericalToCartesian(latitude, longitude, radius),
        rotation,
      );
      const projected = projectPoint(point, center, FOCAL_LENGTH, 300);

      if (index === 0) {
        ctx.moveTo(projected.x, projected.y);
      } else {
        ctx.lineTo(projected.x, projected.y);
      }
    }
    ctx.strokeStyle = hexToRgba(INTRO_COLORS.cyan, opacity * 0.8);
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  for (let longitudeIndex = 0; longitudeIndex < LONGITUDE_COUNT; longitudeIndex++) {
    const longitude = (longitudeIndex / LONGITUDE_COUNT) * Math.PI * 2;
    const steps = 28;

    ctx.beginPath();
    for (let step = 0; step <= steps; step++) {
      const latitude = lerp(-Math.PI / 2 + 0.08, Math.PI / 2 - 0.08, step / steps);
      const point = rotateY(
        sphericalToCartesian(latitude, longitude, radius),
        rotation,
      );
      const projected = projectPoint(point, center, FOCAL_LENGTH, 300);

      if (step === 0) {
        ctx.moveTo(projected.x, projected.y);
      } else {
        ctx.lineTo(projected.x, projected.y);
      }
    }
    ctx.strokeStyle = hexToRgba(INTRO_COLORS.cyan, opacity * 0.55);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

export default function GlobeCanvas({ stateRef, size, originScreenRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const sceneRef = useRef<IntroSceneData | null>(null);
  const trailRef = useRef<TrailGhost[]>([]);
  const lastFrameMsRef = useRef<number>(0);
  const elapsedSecRef = useRef(0);
  const lastGhostMsRef = useRef(0);

  const drawFrame = useCallback((
    ctx: CanvasRenderingContext2D,
    scene: IntroSceneData,
    state: IntroPhaseState,
    width: number,
    height: number,
    nowMs: number,
    elapsedSec: number,
  ) => {
    ctx.clearRect(0, 0, width, height);

    const background = ctx.createRadialGradient(
      width * 0.52,
      height * 0.48,
      0,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.78,
    );
    background.addColorStop(0, "#0b1424");
    background.addColorStop(0.58, INTRO_COLORS.background);
    background.addColorStop(1, INTRO_COLORS.backgroundEdge);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    if (state.scanlineProgress < 1) {
      const scanY = lerp(-height * 0.08, height * 1.08, state.scanlineProgress);
      const scanGradient = ctx.createLinearGradient(0, scanY - 8, 0, scanY + 8);
      scanGradient.addColorStop(0, "rgba(0,245,255,0)");
      scanGradient.addColorStop(0.5, "rgba(0,245,255,0.18)");
      scanGradient.addColorStop(1, "rgba(0,245,255,0)");
      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanY - 8, width, 16);
    }

    const flatCenter = scene.flatCenter;
    const globeCenter = {
      x: lerp(width * 0.5, width * 0.6, state.globeOffsetProgress),
      y: height * 0.5,
    };
    const rotationY = elapsedSec * 0.048;
    const drawNodes: DrawNode[] = new Array(scene.nodes.length);

    scene.nodes.forEach((node) => {
      const flatX = flatCenter.x + (node.x - flatCenter.x) * state.sceneScale;
      const flatY = flatCenter.y + (node.y - flatCenter.y) * state.sceneScale;
      const rotatedSphere = rotateY(
        {
          x: node.sphere3D.x * state.globeScale,
          y: node.sphere3D.y * state.globeScale,
          z: node.sphere3D.z * state.globeScale,
        },
        rotationY,
      );
      const projected = projectPoint(rotatedSphere, globeCenter, FOCAL_LENGTH, 300);
      const current = lerpVec2(
        { x: flatX, y: flatY },
        { x: projected.x, y: projected.y },
        easeInOutPower3(state.morphProgress),
      );
      const nodeReveal = getClusterNodeReveal(state, node.cluster, node.localIndex);
      const alpha = nodeReveal * lerp(1, projected.visibleAlpha, state.morphProgress);
      const scale = lerp(1, projected.scale, state.morphProgress);

      node.screenX = current.x;
      node.screenY = current.y;
      drawNodes[node.id] = { x: current.x, y: current.y, alpha, scale };
    });

    const originNode = drawNodes[0];
    originScreenRef.current = {
      x: originNode?.x ?? 0,
      y: originNode?.y ?? 0,
      visible: Boolean(originNode && originNode.alpha > 0.2),
    };

    const connectionDraws: DrawConnection[] = [];

    scene.connections.forEach((connection) => {
      const progress = getConnectionReveal(
        state,
        connection.id,
        scene.firstConnectionId,
        connection.cluster,
        connection.order,
        Boolean(connection.isBridge),
      );

      if (progress <= 0.01) {
        return;
      }

      const from = drawNodes[connection.fromId];
      const to = drawNodes[connection.toId];

      if (!from || !to) {
        return;
      }

      const visibility = Math.min(from.alpha, to.alpha);
      if (visibility <= 0.02) {
        return;
      }

      connectionDraws.push({
        connectionId: connection.id,
        color: connection.color,
        pulseOffset: connection.pulseOffset,
        isBridge: Boolean(connection.isBridge),
        from,
        to,
        progress: connection.id === scene.firstConnectionId ? 1 : progress,
        alpha: visibility * connection.opacity,
      });

      ctx.strokeStyle = hexToRgba(connection.color, visibility * connection.opacity);
      ctx.lineWidth = connection.weight;
      drawPartialLine(ctx, from, to, connection.id === scene.firstConnectionId ? 1 : progress);
    });

    drawGlobeWireframe(ctx, width, height, state, elapsedSec);

    const pulsePhase = state.phase >= 6 ? 1 : state.phase >= 4 ? 0.7 : 0;
    if (pulsePhase > 0) {
      connectionDraws.slice(0, MAX_ACTIVE_PULSES).forEach((connectionDraw) => {
        if (connectionDraw.progress < 0.95) {
          return;
        }

        const speed = connectionDraw.isBridge ? 0.12 : 0.16 + connectionDraw.pulseOffset * 0.18;
        const pulseT = (elapsedSec * speed + connectionDraw.pulseOffset) % 1;
        const fade = Math.sin(pulseT * Math.PI);

        drawPulse(
          ctx,
          connectionDraw.from,
          connectionDraw.to,
          pulseT,
          connectionDraw.isBridge ? 2.8 : 2.4,
          connectionDraw.color,
          connectionDraw.alpha * pulsePhase * fade,
        );
      });
    }

    if (state.phase === 3 && state.firstSignalProgress > 0.01 && state.firstLineVisible > 0.5) {
      const from = drawNodes[0];
      const to = drawNodes[1];
      if (from && to) {
        const segment = state.firstSignalProgress;
        if (segment < 1 / 3) {
          drawPulse(ctx, from, to, segment / (1 / 3), 3, INTRO_COLORS.cyan, 0.95);
        } else if (segment < 2 / 3) {
          drawPulse(ctx, to, from, (segment - 1 / 3) / (1 / 3), 3, INTRO_COLORS.softBlue, 0.95);
        } else {
          const dualT = (segment - 2 / 3) / (1 / 3);
          drawPulse(ctx, from, to, dualT, 3, INTRO_COLORS.cyan, 0.95);
          drawPulse(ctx, to, from, dualT, 3, INTRO_COLORS.softBlue, 0.95);
        }
      }
    }

    scene.nodes.forEach((node) => {
      const drawNode = drawNodes[node.id];
      if (!drawNode || drawNode.alpha <= 0.02) {
        return;
      }

      const breath = Math.sin(elapsedSec * node.freq + node.phase) * 1.5;
      const radius = Math.max(1.2, (node.baseRadius + breath) * drawNode.scale);
      const alpha = drawNode.alpha * (state.globeDim <= 1 ? state.globeDim : 1);

      ctx.beginPath();
      ctx.arc(drawNode.x, drawNode.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(node.color, alpha * 0.92);
      ctx.shadowColor = node.color;
      ctx.shadowBlur = node.isOrigin ? 10 : 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      if (node.connectivity >= 4 && state.phase >= 4 && state.morphProgress < 0.92) {
        ctx.beginPath();
        ctx.arc(drawNode.x, drawNode.y, radius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(node.color, alpha * 0.24);
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });

    if (state.phase === 2 && state.dotTravelProgress > 0.01 && state.dotTravelProgress < 0.99) {
      if (nowMs - lastGhostMsRef.current >= 30) {
        const easedTravel = easeInOutPower2(state.dotTravelProgress);
        const point = getCubicBezierPoint(scene.path, easedTravel);
        trailRef.current.push({
          x: point.x,
          y: point.y,
          opacity: 1,
          scale: 1,
          radius: TRAVEL_DOT_RADIUS,
          bornAt: elapsedSec,
        });
        lastGhostMsRef.current = nowMs;
      }
    }

    trailRef.current = trailRef.current
      .map((ghost) => {
        const age = elapsedSec - ghost.bornAt;
        const progress = clamp01(age / 0.8);
        return {
          ...ghost,
          opacity: 1 - progress,
          scale: lerp(1, 0.3, progress),
        };
      })
      .filter((ghost) => ghost.opacity > 0.01)
      .slice(-MAX_TRAIL_GHOSTS);

    trailRef.current.forEach((ghost) => {
      ctx.beginPath();
      ctx.arc(ghost.x, ghost.y, ghost.radius * ghost.scale, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(INTRO_COLORS.cyan, ghost.opacity * 0.6);
      ctx.shadowColor = INTRO_COLORS.cyan;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    if (state.labelOpacity > 0.01 && state.morphProgress > 0.7) {
      scene.labelAnchors.forEach((anchor) => {
        const drawNode = drawNodes[anchor.nodeId];
        if (!drawNode || drawNode.alpha < 0.2) {
          return;
        }

        ctx.font = "10px var(--font-jetbrains-mono), monospace";
        ctx.textBaseline = "middle";
        ctx.fillStyle = hexToRgba(anchor.color, state.labelOpacity * 0.82);
        ctx.fillText(anchor.text, drawNode.x + anchor.dx, drawNode.y + anchor.dy);

        ctx.beginPath();
        ctx.moveTo(drawNode.x + anchor.dx - 12, drawNode.y + anchor.dy);
        ctx.lineTo(drawNode.x + anchor.dx - 4, drawNode.y + anchor.dy);
        ctx.strokeStyle = hexToRgba(anchor.color, state.labelOpacity * 0.52);
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }

    const originPulsePoint =
      state.phase >= 3 && drawNodes[0]
        ? drawNodes[0]
        : getCubicBezierPoint(scene.path, easeInOutPower2(state.dotTravelProgress));

    const originPulse = 0.92 + Math.sin(elapsedSec * 1.8) * 0.25;
    const originScale = Math.max(0, state.dotScale) * originPulse;
    const originRadius = TRAVEL_DOT_RADIUS * originScale;

    if (originRadius > 0.15 && state.dotOpacity > 0.01) {
      const ringProgress = (elapsedSec % 1.5) / 1.5;
      const ringRadius = originRadius + ringProgress * 38;
      const ringAlpha = (1 - ringProgress) * 0.28 * state.dotOpacity;

      ctx.beginPath();
      ctx.arc(originPulsePoint.x, originPulsePoint.y, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(INTRO_COLORS.cyan, ringAlpha);
      ctx.lineWidth = 1;
      ctx.stroke();

      if (state.firstFlash > 0.01 && drawNodes[1]) {
        const targetRingRadius = 10 + state.firstFlash * 24;
        const targetAlpha = (1 - state.firstFlash) * 0.32;
        ctx.beginPath();
        ctx.arc(drawNodes[1].x, drawNodes[1].y, targetRingRadius, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(INTRO_COLORS.softBlue, targetAlpha);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(originPulsePoint.x, originPulsePoint.y, originRadius, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(INTRO_COLORS.cyan, state.dotOpacity);
      ctx.shadowColor = INTRO_COLORS.cyan;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    scene.guideNodeIds.forEach((nodeId) => {
      const drawNode = drawNodes[nodeId];
      if (!drawNode || state.guideOpacity <= 0.01 || state.phase > 2) {
        return;
      }

      const guideAlpha = 0.12 * state.guideOpacity;
      const guideRadius = 3 + easeOutSine(state.guideOpacity) * 0.8;
      ctx.beginPath();
      ctx.arc(drawNode.x, drawNode.y, guideRadius, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(scene.nodes[nodeId].color, guideAlpha);
      ctx.shadowColor = scene.nodes[nodeId].color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }, [originScreenRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width <= 0 || size.height <= 0) {
      return;
    }

    canvas.width = Math.max(1, Math.round(size.width * size.dpr));
    canvas.height = Math.max(1, Math.round(size.height * size.dpr));
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    sceneRef.current = buildIntroScene(size.width, size.height);
    trailRef.current = [];
    lastGhostMsRef.current = 0;
  }, [size.dpr, size.height, size.width]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const loop = (nowMs: number) => {
      const delta = lastFrameMsRef.current === 0
        ? 0
        : Math.min((nowMs - lastFrameMsRef.current) / 1000, 0.05);
      lastFrameMsRef.current = nowMs;
      elapsedSecRef.current += delta;

      const scene = sceneRef.current;
      const state = stateRef.current;

      if (scene && size.width > 0 && size.height > 0) {
        context.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
        drawFrame(
          context,
          scene,
          state,
          size.width,
          size.height,
          nowMs,
          elapsedSecRef.current,
        );
      }

      rafRef.current = window.requestAnimationFrame(loop);
    };

    rafRef.current = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      lastFrameMsRef.current = 0;
    };
  }, [drawFrame, size.dpr, size.height, size.width, stateRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
