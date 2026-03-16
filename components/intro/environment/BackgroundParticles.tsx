import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 600;

function seededRand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function BackgroundParticles() {
  const meshRef      = useRef<THREE.Points>(null!);
  const positionsRef = useRef<Float32Array>(new Float32Array(COUNT * 3));
  const velocitiesRef = useRef<Float32Array>(new Float32Array(COUNT * 3));

  const geometry = useMemo(() => {
    const positions  = positionsRef.current;
    const velocities = velocitiesRef.current;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      positions[i3    ] = (seededRand(i * 3 + 0) - 0.5) * 30; // [-15, 15]
      positions[i3 + 1] = (seededRand(i * 3 + 1) - 0.5) * 20; // [-10, 10]
      positions[i3 + 2] = (seededRand(i * 3 + 2) - 0.5) * 15; // [-7.5, 7.5]

      velocities[i3    ] = (seededRand(i * 7 + 0) - 0.5) * 0.004;
      velocities[i3 + 1] = (seededRand(i * 7 + 1) - 0.5) * 0.004;
      velocities[i3 + 2] = (seededRand(i * 7 + 2) - 0.5) * 0.004;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.03,
        color: new THREE.Color("#00f5ff"),
        transparent: true,
        opacity: 0.36,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  const BOUNDS = [15, 10, 7.5];

  useFrame(() => {
    const pos = positionsRef.current;
    const vel = velocitiesRef.current;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      for (let axis = 0; axis < 3; axis++) {
        pos[i3 + axis] += vel[i3 + axis];
        if (Math.abs(pos[i3 + axis]) > BOUNDS[axis]) {
          vel[i3 + axis] *= -0.9;
        }
      }
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return <points ref={meshRef} geometry={geometry} material={material} frustumCulled={false} />;
}
