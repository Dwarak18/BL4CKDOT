import type { Vec2 } from "./lerp";

export interface CubicBezierPath {
  p0: Vec2;
  p1: Vec2;
  p2: Vec2;
  p3: Vec2;
}

export function getCubicBezierPoint(path: CubicBezierPath, t: number): Vec2 {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x:
      mt3 * path.p0.x +
      3 * mt2 * t * path.p1.x +
      3 * mt * t2 * path.p2.x +
      t3 * path.p3.x,
    y:
      mt3 * path.p0.y +
      3 * mt2 * t * path.p1.y +
      3 * mt * t2 * path.p2.y +
      t3 * path.p3.y,
  };
}

export function getCubicBezierTangent(path: CubicBezierPath, t: number): Vec2 {
  const mt = 1 - t;
  return {
    x:
      3 * mt * mt * (path.p1.x - path.p0.x) +
      6 * mt * t * (path.p2.x - path.p1.x) +
      3 * t * t * (path.p3.x - path.p2.x),
    y:
      3 * mt * mt * (path.p1.y - path.p0.y) +
      6 * mt * t * (path.p2.y - path.p1.y) +
      3 * t * t * (path.p3.y - path.p2.y),
  };
}
