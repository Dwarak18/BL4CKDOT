// ── Signal Field color system ─────────────────────────────────────────────────

export type DomainType =
  | "innovation"
  | "ai"
  | "research"
  | "projects"
  | "apprenticeship";

export const DOMAIN_COLORS: Record<DomainType, string> = {
  innovation:     "#00f5ff",   // Cyan
  ai:             "#bf5fff",   // Purple
  research:       "#39ff14",   // Green
  projects:       "#ffd700",   // Gold
  apprenticeship: "#a0b4c8",   // Soft blue-white
};

const DOMAIN_SEQUENCE: DomainType[] = [
  "innovation",
  "ai",
  "research",
  "projects",
  "apprenticeship",
];

export function getDomainByIndex(index: number): DomainType {
  return DOMAIN_SEQUENCE[index % DOMAIN_SEQUENCE.length];
}

export function getDomainColor(domain: DomainType): string {
  return DOMAIN_COLORS[domain];
}

/**
 * Convert hex + alpha (0–1) → "rgba(r,g,b,a)" string.
 * Works with 6-digit hex (no #prefix needed, but # is handled).
 */
export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;
}
