import { clamp } from "./lerp";

export function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

export function easeInOutPower2(value: number): number {
  const t = clamp01(value);
  return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
}

export function easeInOutPower3(value: number): number {
  const t = clamp01(value);
  return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;
}

export function easeOutCubic(value: number): number {
  const t = clamp01(value);
  return 1 - (1 - t) ** 3;
}

export function easeOutSine(value: number): number {
  const t = clamp01(value);
  return Math.sin((t * Math.PI) / 2);
}
