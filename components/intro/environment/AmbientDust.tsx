import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 200;

function seededRand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function AmbientDust() {
  const positionsRef  = useRef<Float32Array>(new Float32Array(COUNT * 3));
  const velocitiesRef = useRef<Float32Array>(new Float32Array(COUNT * 3));
  const colorsRef     = useRef<Float32Array>(new Float32Array(COUNT * 3));

  const geometry = useMemo(() => {
    const pos  = positionsRef.current;
    const vel  = velocitiesRef.current;
    const cols = colorsRef.current;

    const cyan   = new THREE.Color("#00f5ff");
    const purple = new THREE.Color("#bf5fff");

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      pos[i3    ] = (seededRand(i * 3 + 0) - 0.5) * 20;
      pos[i3 + 1] = (seededRand(i * 3 + 1) - 0.5) * 14;
      pos[i3 + 2] = (seededRand(i * 3 + 2) - 0.5) * 10;

      vel[i3    ] = (seededRand(i * 5 + 0) - 0.5) * 0.0015;
      vel[i3 + 1] = (seededRand(i * 5 + 1) - 0.5) * 0.0015;
      vel[i3 + 2] = (seededRand(i * 5 + 2) - 0.5) * 0.0015;

      const mix = seededRand(i * 11);
      const c   = cyan.clone().lerp(purple, mix);
      cols[i3    ] = c.r;
      cols[i3 + 1] = c.g;
      cols[i3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos,  3));
    geo.setAttribute("color",    new THREE.BufferAttribute(cols, 3));
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.2,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  const BOUNDS = [10, 7, 5];

  useFrame(() => {
    const pos = positionsRef.current;
    const vel = velocitiesRef.current;
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      for (let a = 0; a < 3; a++) {
        pos[i3 + a] += vel[i3 + a];
        if (Math.abs(pos[i3 + a]) > BOUNDS[a]) vel[i3 + a] *= -1;
      }
    }
    geometry.attributes.position.needsUpdate = true;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
