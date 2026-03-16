"use client";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type AccentColor = "cyan" | "purple" | "green";

const colorMap: Record<AccentColor, {
  accent: string; border: string; glow: string; dot: string; btn: string; label: string;
}> = {
  cyan:   { accent: "text-neon-cyan",   border: "border-neon-cyan/20",   glow: "hover:border-neon-cyan/50 hover:shadow-[0_0_40px_rgba(0,245,255,0.1)]",   dot: "bg-neon-cyan",   btn: "neon-btn-cyan",   label: "text-neon-cyan"   },
  purple: { accent: "text-neon-purple", border: "border-neon-purple/20", glow: "hover:border-neon-purple/50 hover:shadow-[0_0_40px_rgba(191,95,255,0.1)]", dot: "bg-neon-purple", btn: "neon-btn-purple", label: "text-neon-purple" },
  green:  { accent: "text-neon-green",  border: "border-neon-green/20",  glow: "hover:border-neon-green/50 hover:shadow-[0_0_40px_rgba(57,255,20,0.1)]",   dot: "bg-neon-green",  btn: "neon-btn-green",  label: "text-neon-green"  },
};

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  route: string;
  btnLabel: string;
  accent: AccentColor;
}

export function RoleCard({ icon, title, subtitle, description, features, route, btnLabel, accent }: RoleCardProps) {
  const router = useRouter();
  const c = colorMap[accent];

  return (
    <div
      className={cn(
        "bd-glass flex flex-col gap-6 p-7 cursor-pointer transition-all duration-500",
        `border ${c.border}`,
        c.glow,
      )}
      onClick={() => router.push(route)}
    >
      {/* Icon + label */}
      <div className="flex items-center gap-3">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center bg-white/[0.06] border border-white/10", c.accent)}>
          {icon}
        </div>
        <div>
          <p className={cn("font-mono text-xs tracking-[0.3em] uppercase", c.label)}>{subtitle}</p>
          <h3 className="text-white font-semibold text-lg leading-tight">{title}</h3>
        </div>
      </div>

      <p className="text-white/50 text-sm leading-relaxed">{description}</p>

      {/* Features */}
      <ul className="flex flex-col gap-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-white/70">
            <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", c.dot)} />
            {f}
          </li>
        ))}
      </ul>

      {/* Button */}
      <button
        className={cn(
          "group mt-auto w-full flex items-center justify-center gap-2 py-3 rounded-xl",
          "font-mono text-xs tracking-[0.2em] uppercase transition-all duration-300",
          c.btn,
        )}
        onClick={(e) => { e.stopPropagation(); router.push(route); }}
      >
        {btnLabel}
        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  );
}
