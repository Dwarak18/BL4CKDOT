// ── Signal pulse state ────────────────────────────────────────────────────────

export const MAX_PULSES = 300;

export interface PulseData {
  connectionIdx: number;
  t:             number;   // 0→1 position along bezier
  speed:         number;   // units/second
  radius:        number;   // 2.5–4px
  color:         string;
}

/** Create staggered pulses for a single connection */
export function createPulsesForConnection(
  connIdx: number,
  color:   string,
  count:   number,
): PulseData[] {
  const pulses: PulseData[] = [];
  for (let i = 0; i < count; i++) {
    pulses.push({
      connectionIdx: connIdx,
      t:             i / count,               // stagger start positions
      speed:         0.25 + Math.random() * 0.3,
      radius:        2.5  + Math.random() * 1.5,
      color,
    });
  }
  return pulses;
}

/** Advance all pulse t values by delta seconds (wraps 0→1) */
export function updatePulses(pulses: PulseData[], delta: number): void {
  for (let i = 0; i < pulses.length; i++) {
    pulses[i].t = (pulses[i].t + delta * pulses[i].speed) % 1;
  }
}
