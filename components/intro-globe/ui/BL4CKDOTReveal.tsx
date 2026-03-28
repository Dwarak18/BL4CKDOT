"use client";

interface Props {
  phase: number;
}

const LETTERS = "BL4CKDOT".split("");

export default function BL4CKDOTReveal({ phase }: Props) {
  const visible = phase >= 8;
  const exiting = phase >= 9;
  const subtitleDelay = LETTERS.length * 0.08 + 0.6;

  if (!visible) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        zIndex: 4,
        pointerEvents: "none",
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.35s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "0.22em",
          paddingLeft: "0.22em",
        }}
      >
        {LETTERS.map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: "clamp(52px, 8vw, 72px)",
              fontWeight: 800,
              color: "#ffffff",
              textShadow: "0 0 40px rgba(0,245,255,0.3)",
              opacity: 0,
              transform: "translateY(8px)",
              animation: `introLetterIn 0.35s ease-out ${index * 0.08}s forwards`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      <p
        style={{
          margin: "18px 0 0",
          color: "rgba(0,245,255,0.6)",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          opacity: 0,
          animation: `introSubtitleIn 0.45s ease-out ${subtitleDelay}s forwards`,
        }}
      >
        ENGINEERING THE FUTURE OF INTELLIGENT SYSTEMS
      </p>

      <style>{`
        @keyframes introLetterIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes introSubtitleIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
