import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { AnimValues } from "@/hooks/useIntroTimeline";

interface Props {
  stateRef: MutableRefObject<AnimValues>;
}

function DotLight({ stateRef }: Props) {
  const ref = useRef<THREE.PointLight>(null!);
  useFrame(() => {
    if (ref.current) ref.current.intensity = stateRef.current.dotOpacity * 2;
  });
  return <pointLight ref={ref} color="#00f5ff" distance={6} intensity={0} />;
}

export function Stage1_IdeaBirth({ stateRef }: Props) {
  const coreRef  = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const { dotOpacity, dotScale } = stateRef.current;
    const t = clock.getElapsedTime();

    if (coreRef.current) {
      coreRef.current.scale.setScalar(Math.max(0, dotScale) * 0.25);
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = dotOpacity;
      mat.emissiveIntensity = 2 + Math.sin(t * 3) * 0.5;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.6;
      ring1Ref.current.rotation.x = 0.5 + Math.sin(t * 0.3) * 0.3;
      ring1Ref.current.scale.setScalar(Math.max(0, dotScale));
      (ring1Ref.current.material as THREE.MeshStandardMaterial).opacity = dotOpacity * 0.6;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.4;
      ring2Ref.current.rotation.y = Math.cos(t * 0.4) * 0.4;
      ring2Ref.current.scale.setScalar(Math.max(0, dotScale) * 1.5);
      (ring2Ref.current.material as THREE.MeshStandardMaterial).opacity = dotOpacity * 0.35;
    }
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive={new THREE.Color("#00f5ff")}
          emissiveIntensity={2}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.9, 0.018, 8, 80]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive={new THREE.Color("#00f5ff")}
          emissiveIntensity={1.8}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.4, 0.012, 8, 80]} />
        <meshStandardMaterial
          color="#bf5fff"
          emissive={new THREE.Color("#bf5fff")}
          emissiveIntensity={1.4}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>

      <DotLight stateRef={stateRef} />
    </group>
  );
}
