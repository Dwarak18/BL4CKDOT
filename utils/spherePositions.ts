import * as THREE from "three";

// ──────────────────────────────────────────────────────────────────────────────
// Easing functions
// ──────────────────────────────────────────────────────────────────────────────

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutElastic(t: number): number {
  if (t === 0) return 0;
  if (t === 1) return 1;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// ──────────────────────────────────────────────────────────────────────────────
// Vector3 utilities
// ──────────────────────────────────────────────────────────────────────────────

export function lerpVector3(
  a: THREE.Vector3,
  b: THREE.Vector3,
  t: number,
  out: THREE.Vector3,
): THREE.Vector3 {
  out.x = a.x + (b.x - a.x) * t;
  out.y = a.y + (b.y - a.y) * t;
  out.z = a.z + (b.z - a.z) * t;
  return out;
}

// ──────────────────────────────────────────────────────────────────────────────
// Fibonacci sphere distribution
// ──────────────────────────────────────────────────────────────────────────────

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export function fibonacciSphere(
  count: number,
  radius = 3.2,
): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // [-1, 1]
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = GOLDEN_ANGLE * i;
    const x = Math.cos(theta) * r * radius;
    const z = Math.sin(theta) * r * radius;
    positions.push(new THREE.Vector3(x, y * radius, z));
  }

  return positions;
}
