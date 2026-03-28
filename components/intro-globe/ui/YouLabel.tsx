"use client";

interface Position {
  x: number;
  y: number;
  visible: boolean;
}

interface Props {
  phase: number;
  position: Position | null;
}

export default function YouLabel({ phase, position }: Props) {
  if (phase !== 9 || !position?.visible) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: position.x + 18,
        top: position.y - 18,
        zIndex: 5,
        pointerEvents: "none",
        animation: "introYouFade 1.2s ease-out forwards",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "#ffffff",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          textShadow: "0 0 18px rgba(0,245,255,0.3)",
        }}
      >
        <span
          style={{
            width: 12,
            height: 1,
            background: "rgba(255,255,255,0.5)",
          }}
        />
        YOU
      </div>
      <style>{`
        @keyframes introYouFade {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          12% {
            opacity: 1;
            transform: translateY(0);
          }
          76% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
}
