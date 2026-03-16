"use client";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "cyan" | "purple" | "green";

const variantMap: Record<Variant, string> = {
  cyan:   "neon-btn-cyan",
  purple: "neon-btn-purple",
  green:  "neon-btn-green",
};

interface GlowButtonProps {
  variant?: Variant;
  loading?: boolean;
  icon?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function GlowButton({
  variant = "cyan",
  loading = false,
  icon = true,
  onClick,
  type = "button",
  disabled,
  children,
  className,
}: GlowButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "group w-full flex items-center justify-center gap-3 py-4 rounded-xl",
        "font-mono text-sm tracking-[0.15em] uppercase",
        "transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
        variantMap[variant],
        className,
      )}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <>
          <span>{children}</span>
          {icon && (
            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          )}
        </>
      )}
    </button>
  );
}
