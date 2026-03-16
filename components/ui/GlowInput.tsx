"use client";
import { cn } from "@/lib/utils";

type AccentColor = "cyan" | "purple" | "green" | "orange";

const glowClass: Record<AccentColor, string> = {
  cyan:   "input-glow-cyan",
  purple: "input-glow-purple",
  green:  "input-glow-green",
  orange: "input-glow-orange",
};

const accentTextClass: Record<AccentColor, string> = {
  cyan:   "text-neon-cyan",
  purple: "text-neon-purple",
  green:  "text-neon-green",
  orange: "text-neon-orange",
};

interface GlowInputProps {
  label: string;
  accentColor?: AccentColor;
  error?: string;
  className?: string;
  as?: "input" | "textarea";
  rows?: number;
  // Forward common input props
  id?: string;
  name?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  accept?: string;
}

export function GlowInput({
  label,
  accentColor = "cyan",
  error,
  className,
  as = "input",
  rows = 4,
  ...props
}: GlowInputProps) {
  const inputClasses = cn(
    "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3",
    "text-white placeholder:text-white/30 text-sm font-mono",
    "outline-none transition-all duration-200",
    glowClass[accentColor],
    error ? "border-red-400/60" : "",
    className,
  );

  return (
    <div className="flex flex-col gap-1.5">
      <label className={cn("font-mono text-xs tracking-[0.3em] uppercase", accentTextClass[accentColor])}>
        {label}
      </label>
      {as === "textarea" ? (
        <textarea {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} rows={rows} className={cn(inputClasses, "resize-none")} />
      ) : (
        <input {...(props as React.InputHTMLAttributes<HTMLInputElement>)} className={inputClasses} />
      )}
      {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
    </div>
  );
}
