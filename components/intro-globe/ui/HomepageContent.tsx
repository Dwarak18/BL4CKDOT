"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

interface Props {
  visible: boolean;
}

const STATS = [
  { value: "50+", label: "ACTIVE PROJECTS", color: "#00f5ff" },
  { value: "200+", label: "CONNECTED NODES", color: "#bf5fff" },
  { value: "12+", label: "RESEARCH DOMAINS", color: "#39ff14" },
];

export default function HomepageContent({ visible }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        pointerEvents: visible ? "auto" : "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0 8vw",
      }}
    >
      <div
        style={{
          maxWidth: 560,
          padding: "42px 40px 42px 0",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            borderRadius: 999,
            border: "1px solid rgba(0,245,255,0.28)",
            background: "rgba(0,245,255,0.05)",
            marginBottom: 24,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#00f5ff",
              boxShadow: "0 0 8px #00f5ff",
            }}
          />
          <span
            style={{
              color: "#00f5ff",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            Innovation Ecosystem
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            color: "#ffffff",
            fontFamily: "var(--font-orbitron), sans-serif",
            fontSize: "clamp(2.2rem, 4.9vw, 3.9rem)",
            fontWeight: 900,
            lineHeight: 1.12,
          }}
        >
          Engineering the Future
          <br />
          of Intelligent Systems
        </h1>

        <p
          style={{
            margin: "18px 0 0",
            color: "rgba(226,232,240,0.62)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 12,
            letterSpacing: "0.18em",
          }}
        >
          AI • Cybersecurity • IoT • Micro-LLM • Innovation Labs
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 30,
          }}
        >
          <Link
            href="/innovation-lab"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 24px",
              borderRadius: 14,
              background: "#22D3EE",
              color: "#020617",
              textDecoration: "none",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 700,
              boxShadow: "0 0 26px rgba(34,211,238,0.24)",
            }}
          >
            <Zap size={14} /> Explore Innovation Lab
          </Link>
          <Link
            href="/#build-with-us"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 24px",
              borderRadius: 14,
              border: "1px solid rgba(34,211,238,0.3)",
              background: "rgba(255,255,255,0.04)",
              color: "#22D3EE",
              textDecoration: "none",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Build With BL4CKDOT <ArrowRight size={14} />
          </Link>
        </div>

        <div
          style={{
            display: "flex",
            gap: 28,
            flexWrap: "wrap",
            marginTop: 34,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p
                style={{
                  margin: 0,
                  color: stat.color,
                  fontFamily: "var(--font-orbitron), sans-serif",
                  fontSize: 24,
                  fontWeight: 900,
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  color: "rgba(255,255,255,0.45)",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
