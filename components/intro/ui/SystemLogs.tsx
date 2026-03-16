"use client";
import { useEffect, useRef, useState } from "react";

interface LogEntry {
  id:      number;
  text:    string;
  color:   string;
  opacity: number;
}

const LOG_MESSAGES: { text: string; color: string }[] = [
  { text: "AI prototype detected",            color: "#bf5fff" },
  { text: "IoT experiment running",            color: "#39ff14" },
  { text: "Security research active",          color: "#00f5ff" },
  { text: "Edge model optimizing",            color: "#ffd700" },
  { text: "Neural pattern recognized",        color: "#bf5fff" },
  { text: "Mesh network synchronizing",       color: "#00f5ff" },
  { text: "Prototype validation complete",    color: "#39ff14" },
  { text: "Innovation node connected",        color: "#ffd700" },
  { text: "Research thread initiated",        color: "#bf5fff" },
  { text: "Micro-LLM calibrating",            color: "#00f5ff" },
];

let nextId = 0;

export function SystemLogs() {
  const [logs, setLogs]  = useState<LogEntry[]>([]);
  const counterRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const msg = LOG_MESSAGES[counterRef.current % LOG_MESSAGES.length];
      counterRef.current++;

      const id = nextId++;
      const entry: LogEntry = { id, text: msg.text, color: msg.color, opacity: 1 };

      setLogs((prev) => [entry, ...prev].slice(0, 5));

      // Fade out after 2.8s
      setTimeout(() => {
        setLogs((prev) =>
          prev.map((l) => (l.id === id ? { ...l, opacity: 0 } : l)),
        );
      }, 2800);
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position:      "fixed",
        bottom:        32,
        left:          32,
        zIndex:        30,
        pointerEvents: "none",
        display:       "flex",
        flexDirection: "column",
        gap:           6,
      }}
    >
      {logs.map((log) => (
        <div
          key={log.id}
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        8,
            opacity:    log.opacity,
            transition: "opacity 0.7s ease",
          }}
        >
          {/* Animated dot */}
          <span
            style={{
              display:      "inline-block",
              width:         6,
              height:        6,
              borderRadius: "50%",
              background:   log.color,
              boxShadow:    `0 0 6px ${log.color}`,
              animation:    "pulse 1.5s ease-in-out infinite",
              flexShrink:   0,
            }}
          />
          <span
            style={{
              fontFamily:    "'JetBrains Mono', monospace",
              fontSize:       10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color:          log.color,
              whiteSpace:    "nowrap",
            }}
          >
            {`> ${log.text}`}
          </span>
        </div>
      ))}
    </div>
  );
}
