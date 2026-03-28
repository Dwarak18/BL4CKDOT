import { FOCAL_LENGTH } from "@/constants/introGlobeConfig";
import { clamp, type Vec2, type Vec3 } from "./lerp";

export function sphericalToCartesian(
  latitude: number,
  longitude: number,
  radius: number,
): Vec3 {
  const cosLat = Math.cos(latitude);
  return {
    x: Math.cos(longitude) * cosLat * radius,
    y: Math.sin(latitude) * radius,
    z: Math.sin(longitude) * cosLat * radius,
  };
}

export function generateFibonacciSpherePoints(count: number, radius: number): Vec3[] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, index) => {
    const y = 1 - (index / Math.max(1, count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * index;
    return {
      x: Math.cos(theta) * r * radius,
      y: y * radius,
      z: Math.sin(theta) * r * radius,
    };
  });
}

export function rotateY(vector: Vec3, angle: number): Vec3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return {
    x: vector.x * cos + vector.z * sin,
    y: vector.y,
    z: -vector.x * sin + vector.z * cos,
  };
}

export interface ProjectedPoint extends Vec2 {
  scale: number;
  visibleAlpha: number;
}

export function projectPoint(
  vector: Vec3,
  center: Vec2,
  focalLength = FOCAL_LENGTH,
  zOffset = 300,
): ProjectedPoint {
  const scale = focalLength / (focalLength + vector.z + zOffset);
  const visibleAlpha = clamp(0.3 + (zOffset - vector.z + 240) / 540, 0.18, 1);

  return {
    x: center.x + vector.x * scale,
    y: center.y + vector.y * scale,
    scale,
    visibleAlpha,
  };
}
