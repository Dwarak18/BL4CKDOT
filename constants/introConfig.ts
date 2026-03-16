import * as THREE from "three";

// ── Colors ──────────────────────────────────────────────────────────────────
export const COLORS = {
  background:    "#070B14",
  cyan:          "#00f5ff",
  purple:        "#bf5fff",
  green:         "#39ff14",
  gold:          "#ffd700",
  white:         "#ffffff",
} as const;

export const DOMAIN_COLORS: string[] = [
  COLORS.cyan,
  COLORS.purple,
  COLORS.green,
  COLORS.gold,
];

// ── Phase durations (seconds) ────────────────────────────────────────────────
export const PHASE_DURATIONS = {
  0: 0.5,
  1: 1.3,
  2: 1.4,
  3: 1.8,
  4: 1.2,
  5: 1.6,
  6: 1.2,
} as const;

// ── Network constants ────────────────────────────────────────────────────────
export const NODE_COUNT          = 80;
export const PHASE2_NODE_COUNT   = 5;   // nodes the dot visits in phase 2
export const SPAWN_INTERVAL_MS   = 120; // ms between new nodes in phase 3
export const MAX_CONNECTIONS_PER_NODE = 5;
export const CONNECTION_SNAP_DIST     = 3.0; // world-space units

// ── Sphere constants ─────────────────────────────────────────────────────────
export const SPHERE_RADIUS = 3.0;

// ── Phase 2 dot visit positions (world-space) ────────────────────────────────
export const PHASE2_VISIT_POSITIONS: THREE.Vector3[] = [
  new THREE.Vector3(-2.8, 1.2,  0),
  new THREE.Vector3( 2.6, -0.8, 0),
  new THREE.Vector3(-1.0, -2.4, 0),
  new THREE.Vector3( 3.2,  1.8, 0),
  new THREE.Vector3(-3.0, -1.0, 0),
];

// ── Hub label definitions ────────────────────────────────────────────────────
export const HUB_LABELS = [
  { text: "RESEARCH NODE",   color: COLORS.green  },
  { text: "AI CLUSTER",      color: COLORS.purple },
  { text: "INNOVATION HUB",  color: COLORS.cyan   },
  { text: "ENGINEERING LAB", color: COLORS.gold   },
] as const;

// ── Cinematic text ────────────────────────────────────────────────────────────
export const PHASE_TEXT: Record<number, string> = {
  0: "",
  1: "Every connection begins here.",
  2: "Data flows where ideas connect.",
  3: "A world of data. Hyperlinked.",
  4: "The world's ideas, connected.",
  5: "BL4CKDOT",
  6: "",
};
