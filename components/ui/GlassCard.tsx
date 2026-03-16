"use client";
import { cn } from "@/lib/utils";

type AccentColor = "cyan" | "purple" | "green" | "orange";

const glowMap: Record<AccentColor, string> = {
  cyan:   "card-glow-cyan",
  purple: "card-glow-purple",
  green:  "card-glow-green",
  orange: "card-glow-orange",
};

interface GlassCardProps {
  accentColor?: AccentColor;
  className?: string;
  children: React.ReactNode;
}

export function GlassCard({ accentColor = "cyan", className, children }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bd-glass transition-all duration-500",
        glowMap[accentColor],
        className,
      )}
    >
      {children}
    </div>
  );
}
