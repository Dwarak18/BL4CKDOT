import { DOMAIN_COLORS, COLORS } from "@/constants/introConfig";

export type DomainType = "research" | "ai" | "innovation" | "engineering" | "default";

const DOMAIN_MAP: DomainType[] = ["research", "ai", "innovation", "engineering"];

/** Assign a domain type deterministically from an index */
export function getDomainType(index: number): DomainType {
  return DOMAIN_MAP[index % DOMAIN_MAP.length];
}

/** Get color string for a given connectivity level and node index */
export function getDomainColor(connectivity: number, index: number): string {
  if (connectivity >= 5) return COLORS.gold;
  if (connectivity >= 3) return COLORS.purple;
  if (index % 3 === 0) return COLORS.green;
  return COLORS.cyan;
}

/** Get color for a connection based on domain of the originating node */
export function getConnectionColor(domain: DomainType): string {
  switch (domain) {
    case "research":    return COLORS.green;
    case "ai":          return COLORS.purple;
    case "innovation":  return COLORS.cyan;
    case "engineering": return COLORS.gold;
    default:            return COLORS.cyan;
  }
}

/** Get THREE.Color values for an instanced mesh color array */
export function colorToArray(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}
