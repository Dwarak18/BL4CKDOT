// ── Bezier path math ──────────────────────────────────────────────────────────

export interface Point { x: number; y: number }

/**
 * Compute the breathing quadratic bezier control point.
 * The control point lives on the perpendicular bisector and oscillates
 * slowly over time so lines feel alive without being distracting.
 */
export function getBezierControlPoint(
  p0:       Point,
  p1:       Point,
  timeSec:  number,
  cpOffset: number,
  cpSign:   number,
): Point {
  const mx = (p0.x + p1.x) / 2;
  const my = (p0.y + p1.y) / 2;
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  // Perpendicular unit vector
  const nx = -dy / len;
  const ny =  dx / len;
  // Slow breathing — time * 0.4 per spec (NOT 2.0 which causes jitter)
  const breathe = Math.sin(timeSec * 0.4 + cpOffset) * 12;
  return {
    x: mx + nx * breathe * cpSign,
    y: my + ny * breathe * cpSign,
  };
}

/** Point on a quadratic bezier at parameter t (0→1) */
export function getBezierPoint(
  p0: Point,
  p1: Point,
  cp: Point,
  t:  number,
): Point {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * cp.x + t * t * p1.x,
    y: mt * mt * p0.y + 2 * mt * t * cp.y + t * t * p1.y,
  };
}

/**
 * Draw a partial or full bezier (drawProgress 0 → 1).
 * Uses segmented lineTo so partial draws work without path-length math.
 * Caller is responsible for setting strokeStyle/lineWidth before calling.
 */
export function drawBezierLine(
  ctx:          CanvasRenderingContext2D,
  p0:           Point,
  p1:           Point,
  cp:           Point,
  drawProgress: number,
  steps         = 24,
): void {
  const endStep = Math.max(1, Math.round(drawProgress * steps));
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  for (let s = 1; s <= endStep; s++) {
    const pt = getBezierPoint(p0, p1, cp, s / steps);
    ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();
}
