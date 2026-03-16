"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

import DigitalDust       from "./environment/DigitalDust";
import OriginDot         from "./core/OriginDot";
import NetworkNodes      from "./core/NetworkNodes";
import ConnectionLines   from "./core/ConnectionLines";
import EnergySignals     from "./core/EnergySignals";
import WorldMapOverlay   from "./core/WorldMapOverlay";
import CollapseSphere    from "./sphere/CollapseSphere";
import OrbitRings        from "./sphere/OrbitRings";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import type { PhaseState }  from "@/hooks/usePhaseTimeline";
import type { NodeData, Connection } from "@/hooks/useNetworkBuilder";

// ── Inner scene: uses R3F hooks (must be inside Canvas) ──────────────────────

interface SceneContentProps {
  stateRef:    React.RefObject<PhaseState>;
  nodes:       NodeData[];
  connections: Connection[];
}

function SceneContent({ stateRef, nodes, connections }: SceneContentProps) {
  const { camera } = useThree();
  const { smoothMouse, rawMouse } = useMouseParallax();

  useFrame((_, delta) => {
    smoothMouse.current.lerp(rawMouse.current, 0.04);
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.x += (smoothMouse.current.x * 0.3 - cam.position.x) * 0.015;
    cam.position.y += (smoothMouse.current.y * 0.2 - cam.position.y) * 0.015;
    // Subtle z zoom tied to sphere formation
    const sp = stateRef.current?.collapseProgress ?? 0;
    const targetZ = 8 + sp * 2;
    cam.position.z += (targetZ - cam.position.z) * delta * 0.8;
  });

  return (
    <>
      {/* Environment */}
      <DigitalDust />
      <ambientLight intensity={0.1} />
      <pointLight position={[0,  0,  5]} color="#00f5ff" intensity={0.5} distance={15} />
      <pointLight position={[-5, 3, -3]} color="#bf5fff" intensity={0.3} distance={12} />
      <pointLight position={[5, -3, -3]} color="#39ff14" intensity={0.2} distance={12} />

      {/* Phase 1+: glowing origin dot */}
      <OriginDot stateRef={stateRef} />

      {/* Phase 2+: network nodes, lines, pulses */}
      <NetworkNodes    nodes={nodes} stateRef={stateRef} />
      <ConnectionLines nodes={nodes} connections={connections} stateRef={stateRef} />
      <EnergySignals   nodes={nodes} connections={connections} stateRef={stateRef} />

      {/* Phase 4+: faint world map behind network */}
      <WorldMapOverlay stateRef={stateRef} />

      {/* Phase 5+: collapse sphere + orbit rings */}
      <CollapseSphere stateRef={stateRef} />
      <OrbitRings     stateRef={stateRef} />

      {/* Post-processing: Bloom + Vignette */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.4}
          blendFunction={BlendFunction.ADD}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.55} />
      </EffectComposer>
    </>
  );
}

// ── Canvas wrapper ────────────────────────────────────────────────────────────

export interface HyperlinkCanvasProps {
  stateRef:    React.RefObject<PhaseState>;
  nodes:       NodeData[];
  connections: Connection[];
  phase:       number;
}

export default function HyperlinkCanvas({ stateRef, nodes, connections }: HyperlinkCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 100 }}
      gl={{
        antialias:            true,
        toneMapping:          THREE.ACESFilmicToneMapping,
        toneMappingExposure:   1.2,
      }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%", background: "#070B14" }}
    >
      <SceneContent stateRef={stateRef} nodes={nodes} connections={connections} />
    </Canvas>
  );
}
