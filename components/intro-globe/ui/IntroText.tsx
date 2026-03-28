"use client";

import { INTRO_COLORS } from "@/constants/introGlobeConfig";

interface Props {
  phase: number;
  text: string;
}

const PHASE_COLORS: Record<number, string> = {
  1: INTRO_COLORS.cyan,
  2: INTRO_COLORS.cyan,
  3: INTRO_COLORS.softBlue,
  4: INTRO_COLORS.cyan,
  5: INTRO_COLORS.cyan,
  6: INTRO_COLORS.cyan,
  7: INTRO_COLORS.cyan,
};

export default function IntroText({ phase, text }: Props) {
  if (phase < 1 || phase > 7 || !text) {
    return null;
  }

  const color = PHASE_COLORS[phase] ?? INTRO_COLORS.cyan;

  return (
    <div
      key={`${phase}-${text}`}
      style={{
        position: "absolute",
        left: "50%",
        bottom: "11vh",
        transform: "translateX(-50%)",
        pointerEvents: "none",
        zIndex: 3,
        textAlign: "center",
        animation: "introPhaseTextIn 0.42s ease both",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <div style={{ width: 38, height: 1, background: `${color}66` }} />
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
        <div style={{ width: 38, height: 1, background: `${color}66` }} />
      </div>
      <p
        style={{
          margin: 0,
          color,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 12,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          textShadow: `0 0 28px ${color}55`,
          maxWidth: "min(88vw, 560px)",
          lineHeight: 1.6,
        }}
      >
        {text}
      </p>

      <style>{`
        @keyframes introPhaseTextIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
