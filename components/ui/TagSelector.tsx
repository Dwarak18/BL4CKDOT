"use client";
import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type AccentColor = "cyan" | "purple" | "green";

const colorMap: Record<AccentColor, { border: string; text: string; tag: string; x: string }> = {
  cyan:   { border: "border-neon-cyan/30 focus:border-neon-cyan", text: "text-neon-cyan",   tag: "bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan",   x: "hover:text-neon-cyan"   },
  purple: { border: "border-neon-purple/30 focus:border-neon-purple", text: "text-neon-purple", tag: "bg-neon-purple/10 border border-neon-purple/30 text-neon-purple", x: "hover:text-neon-purple" },
  green:  { border: "border-neon-green/30 focus:border-neon-green",  text: "text-neon-green",  tag: "bg-neon-green/10 border border-neon-green/30 text-neon-green",  x: "hover:text-neon-green"  },
};

interface TagSelectorProps {
  label?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  accentColor?: AccentColor;
  placeholder?: string;
}

export function TagSelector({
  label,
  value,
  onChange,
  accentColor = "cyan",
  placeholder = "Add tag…",
}: TagSelectorProps) {
  const [input, setInput] = useState("");
  const colors = colorMap[accentColor];

  function addTag(raw: string) {
    const tag = raw.trim().replace(/,+$/, "").trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setInput("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className={cn("font-mono text-xs tracking-[0.3em] uppercase", colors.text)}>
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex flex-wrap gap-2 min-h-[46px] bg-white/[0.04] border rounded-xl px-3 py-2",
          "transition-all duration-200",
          colors.border,
        )}
      >
        {value.map((tag) => (
          <span key={tag} className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono", colors.tag)}>
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className={cn("text-white/40 transition-colors", colors.x)}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => {
            const v = e.target.value;
            if (v.endsWith(",")) { addTag(v); return; }
            setInput(v);
          }}
          onKeyDown={onKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-white placeholder:text-white/30 font-mono"
        />
      </div>
      <p className="text-white/30 text-xs font-mono">Press Enter or comma to add a tag</p>
    </div>
  );
}
