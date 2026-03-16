import { useMemo } from "react";
import * as THREE from "three";

export function GridLines() {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const step  = 2;
    const range = 20;
    const z     = -8;

    // Lines parallel to X-axis (varying Y)
    for (let y = -range; y <= range; y += step) {
      positions.push(-range, y, z, range, y, z);
    }
    // Lines parallel to Y-axis (varying X)
    for (let x = -range; x <= range; x += step) {
      positions.push(x, -range, z, x, range, z);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    return geo;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color="#00f5ff"
        transparent
        opacity={0.05}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}
