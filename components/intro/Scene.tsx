"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import type { MutableRefObject } from "react";

import { BackgroundParticles }  from "./environment/BackgroundParticles";
import { GridLines }            from "./environment/GridLines";
import { AmbientDust }          from "./environment/AmbientDust";
import { NodeMesh }             from "./network/NodeMesh";
import { ConnectionLines }      from "./network/ConnectionLines";
import { EnergyPulse }          from "./network/EnergyPulse";
import { EcosystemLabels }      from "./network/EcosystemLabels";
import { Stage1_IdeaBirth }     from "./stages/Stage1_IdeaBirth";

import { useNodePositions }     from "@/hooks/useNodePositions";
import { useMouseParallax }     from "@/hooks/useMouseParallax";
import { buildConnections }     from "@/utils/networkGraph";

import type { IntroStage, AnimValues } from "@/hooks/useIntroTimeline";

// ──────────────────────────────────────────────────────────────────────────────
// Inner scene content (uses useFrame + useThree)
// ──────────────────────────────────────────────────────────────────────────────

interface ContentProps {
  stage:    IntroStage;
  stateRef: MutableRefObject<AnimValues>;
}

function SceneContent({ stage, stateRef }: ContentProps) {
  const { camera } = useThree();
  const groupRef   = useRef<THREE.Group>(null!);
  const { smoothMouse, rawMouse } = useMouseParallax();

  const nodes       = useNodePositions();
  const connections = useMemo(() => buildConnections(nodes, 2.5, 5), [nodes]);

  const currentPositionsRef = useRef<THREE.Vector3[]>([]);

  useFrame((_, delta) => {
    // Smooth mouse
    smoothMouse.current.lerp(rawMouse.current, 0.04);

    // Camera drift
    (camera as THREE.PerspectiveCamera).position.x +=
      (smoothMouse.current.x * 0.3 - (camera as THREE.PerspectiveCamera).position.x) * 0.015;
    (camera as THREE.PerspectiveCamera).position.y +=
      (smoothMouse.current.y * 0.2 - (camera as THREE.PerspectiveCamera).position.y) * 0.015;

    // Group rotation (only when sphere formed)
    const sp = stateRef.current.sphereProgress;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08 * sp;
      groupRef.current.rotation.x += delta * 0.02 * sp;

      groupRef.current.rotation.x += (smoothMouse.current.y * 0.06 - groupRef.current.rotation.x) * 0.02;
      groupRef.current.rotation.y += (smoothMouse.current.x * 0.08 - groupRef.current.rotation.y) * 0.02;
    }
  });

  const showNetwork = stage !== "idle" && stage !== "stage1_birth";
  const showEcosystem = stage === "stage5_ecosystem" || stage === "homepage";

  return (
    <>
      {/* Background environment */}
      <BackgroundParticles />
      <AmbientDust />
      <GridLines />

      {/* Ambient lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 5]}   color="#00f5ff" intensity={0.5} distance={15} />
      <pointLight position={[-5, 3, -3]} color="#bf5fff" intensity={0.3} distance={12} />
      <pointLight position={[5, -3, -3]} color="#39ff14" intensity={0.2} distance={12} />

      {/* Stage 1: Idea Birth */}
      {(stage === "stage1_birth" || stage === "stage2_nodes") && (
        <Stage1_IdeaBirth stateRef={stateRef} />
      )}

      {/* Network group (stages 2–5 + homepage) */}
      <group ref={groupRef}>
        {showNetwork && (
          <>
            <NodeMesh
              nodes={nodes}
              stateRef={stateRef}
              currentPositionsRef={currentPositionsRef}
            />
            <ConnectionLines
              nodes={nodes}
              connections={connections}
              stateRef={stateRef}
              currentPositionsRef={currentPositionsRef}
            />
            <EnergyPulse
              nodes={nodes}
              connections={connections}
              stateRef={stateRef}
              currentPositionsRef={currentPositionsRef}
            />
            {showEcosystem && <EcosystemLabels stateRef={stateRef} />}
          </>
        )}
      </group>

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.2}
          blendFunction={BlendFunction.ADD}
        />
        <ChromaticAberration
          offset={new THREE.Vector2(0.0005, 0.0005)}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Scene canvas wrapper
// ──────────────────────────────────────────────────────────────────────────────

interface SceneProps {
  stage:    IntroStage;
  stateRef: MutableRefObject<AnimValues>;
}

export function Scene({ stage, stateRef }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 100 }}
      gl={{
        antialias:          true,
        toneMapping:        THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      dpr={[1, 2]}
      style={{ background: "#070B14" }}
    >
      <SceneContent stage={stage} stateRef={stateRef} />
    </Canvas>
  );
}
