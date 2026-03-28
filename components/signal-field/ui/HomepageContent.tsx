"use client";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

interface Props {
  opacity: number;
}

const STATS = [
  { value: "50+",  label: "Active Projects",  color: "#00f5ff" },
  { value: "200+", label: "Innovation Nodes", color: "#bf5fff" },
  { value: "12+",  label: "Research Domains", color: "#39ff14" },
];

export default function HomepageContent({ opacity }: Props) {
  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position:       "fixed",
        inset:           0,
        zIndex:          30,
        opacity,
        pointerEvents:  opacity > 0.5 ? "auto" : "none",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "flex-start",
        padding:        "0 8vw",
      }}
    >
      <div style={{ maxWidth: 540 }}>
        {/* Systems online badge */}
        <div
          style={{
            display:     "inline-flex",
            alignItems:  "center",
            gap:          8,
            padding:     "6px 16px",
            borderRadius: 9999,
            border:       "1px solid rgba(57,255,20,0.3)",
            background:   "rgba(57,255,20,0.05)",
            marginBottom: 24,
          }}
        >
          <span
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#39ff14", display: "inline-block",
              boxShadow: "0 0 6px #39ff14",
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, letterSpacing: "0.3em",
              textTransform: "uppercase", color: "#39ff14",
            }}
          >
            Systems Online
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
            fontWeight: 800, color: "#ffffff",
            lineHeight: 1.14, margin: "0 0 16px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Engineering the{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #00f5ff, #bf5fff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Future
          </span>
          <br />
          of Intelligent Systems
        </h1>

        {/* Domain tags */}
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12, letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.45)", margin: "0 0 28px",
          }}
        >
          <span style={{ color: "#00f5ff" }}>AI</span>
          {" • "}
          <span style={{ color: "#ff6b00" }}>Cybersecurity</span>
          {" • "}
          <span style={{ color: "#39ff14" }}>IoT</span>
          {" • "}
          <span style={{ color: "#bf5fff" }}>Micro-LLM</span>
          {" • Innovation Labs"}
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
          <Link
            href="/innovation-lab"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "13px 26px", borderRadius: 12,
              background: "rgba(0,245,255,0.1)",
              border: "1px solid rgba(0,245,255,0.4)",
              color: "#00f5ff",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, letterSpacing: "0.1em",
              textDecoration: "none", textTransform: "uppercase",
            }}
          >
            <Zap size={14} /> Explore Innovation Lab <ArrowRight size={14} />
          </Link>
          <Link
            href="/#build-with-us"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "13px 26px", borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, letterSpacing: "0.1em",
              textDecoration: "none", textTransform: "uppercase",
            }}
          >
            Build With BL4CKDOT <ArrowRight size={14} />
          </Link>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex", gap: 32,
            paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)",
            flexWrap: "wrap",
          }}
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <p style={{ fontSize: 22, fontWeight: 700, color: s.color, margin: 0, fontFamily: "Inter, sans-serif" }}>
                {s.value}
              </p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", margin: "4px 0 0", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
