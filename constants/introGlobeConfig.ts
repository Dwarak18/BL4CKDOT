export const INTRO_VISITED_KEY = "bl4ckdot_visited";

export const INTRO_COLORS = {
  background: "#070B14",
  backgroundEdge: "#030712",
  cyan: "#00f5ff",
  softBlue: "#a0c4ff",
  purple: "#bf5fff",
  green: "#39ff14",
  gold: "#ffd700",
  apprenticeship: "#a8c0d6",
  white: "#ffffff",
} as const;

export const PHASE_DURATIONS = {
  0: 0.8,
  1: 1.4,
  2: 1.6,
  3: 1.2,
  4: 1.8,
  5: 1.4,
  6: 1.6,
  7: 1.7,
  8: 1.5,
  9: 1.2,
} as const;

export const INTRO_TEXT: Record<number, string> = {
  0: "",
  1: "You are the signal.",
  2: "Following the signal.",
  3: "Connection established.",
  4: "Your network grows.",
  5: "Networks find each other.",
  6: "A web of intelligence.",
  7: "The world takes shape.",
  8: "",
  9: "",
};

export const GLOBE_RADIUS = 220;
export const FOCAL_LENGTH = 400;
export const TRAVEL_DOT_RADIUS = 6;
export const MAX_TRAIL_GHOSTS = 40;
export const MAX_ACTIVE_PULSES = 200;
export const GUIDE_NODE_COUNT = 3;
export const CLUSTER_COUNTS = [10, 17, 17, 17, 17] as const;

export const DOMAIN_LABELS = [
  "INNOVATION NETWORK",
  "IDEA FORGE",
  "RESEARCH HUB",
  "PROJECT LAB",
  "APPRENTICESHIP",
] as const;

export const PHASE_TOTAL_DURATION = Object.values(PHASE_DURATIONS).reduce(
  (sum, duration) => sum + duration,
  0,
);
