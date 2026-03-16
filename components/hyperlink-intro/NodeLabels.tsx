"use client";
import { useEffect, useState } from "react";
import type { NodeData } from "@/hooks/useNetworkBuilder";
import { HUB_LABELS } from "@/constants/introConfig";

type HubLabel = { text: string; color: string };
const HUB_LABELS_LIST = HUB_LABELS as ReadonlyArray<HubLabel>;

interface Props {
  nodes: NodeData[];
}

// Predefined viewport-relative positions for hub labels (near high-connectivity areas)
const LABEL_SLOTS = [
  { x: "18%",  y: "32%", index: 0 },
  { x: "72%",  y: "22%", index: 1 },
  { x: "14%",  y: "68%", index: 2 },
  { x: "68%",  y: "72%", index: 3 },
];

export default function NodeLabels({ nodes }: Props) {
  const [visible, setVisible] = useState(false);

  // Stagger label appearance
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Show labels only when we have enough nodes
  if (nodes.length < 20) return null;

  return (
    <>
      {LABEL_SLOTS.map((slot, i) => {
        const label = HUB_LABELS_LIST[slot.index];
        if (!label) return null;
        return (
          <div
            key={label.text}
            style={{
              position:    "fixed",
              left:        slot.x,
              top:         slot.y,
              zIndex:      22,
              pointerEvents: "none",
              opacity:     visible ? 1 : 0,
              transition:  `opacity 0.4s ease ${i * 0.1}s`,
            }}
          >
            {/* Small connector dot */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width:        5,
                  height:       5,
                  borderRadius: "50%",
                  background:   label.color,
                  boxShadow:    `0 0 6px ${label.color}`,
                  flexShrink:   0,
                }}
              />
              <span
                style={{
                  fontFamily:    "'JetBrains Mono', monospace",
                  fontSize:       9,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color:          label.color,
                  textShadow:    `0 0 12px ${label.color}60`,
                  whiteSpace:    "nowrap",
                }}
              >
                {label.text}
              </span>
            </div>
            {/* Short tick line below */}
            <div
              style={{
                width:      1,
                height:     12,
                marginLeft: 2,
                background: `linear-gradient(to bottom, ${label.color}60, transparent)`,
              }}
            />
          </div>
        );
      })}
    </>
  );
}
