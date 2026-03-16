"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, Microscope, GitMerge, CheckCircle, Clock, LogOut } from "lucide-react";

interface UserData { id: string; name: string; email: string; role: string; }

type MilestoneStatus = "completed" | "active" | "pending";

const milestones: { title: string; status: MilestoneStatus }[] = [
  { title: "Idea Submitted",        status: "completed" },
  { title: "Feasibility Review",    status: "active"    },
  { title: "Prototype Development", status: "pending"   },
  { title: "MVP Launch",            status: "pending"   },
];

export default function InnovatorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("bl4ckdot_user");
    const token = localStorage.getItem("bl4ckdot_token");
    if (!raw || !token) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    if (u.role !== "innovator") { router.push("/unauthorized"); return; }
    setUser(u);
  }, [router]);

  async function handleSignOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Best-effort logout: still clear local state if request fails.
    }
    localStorage.clear();
    router.push("/login");
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen py-10 px-4 animate-slide-up">
      <div className="bd-orb-purple" />
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon-purple mb-1">Innovator Dashboard</p>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user.name.split(" ")[0]}</h1>
            <p className="text-white/40 text-sm mt-1">{user.email}</p>
          </div>
          <button onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bd-glass border border-white/10 text-white/50 hover:text-white text-xs font-mono transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Idea Status",           value: "Under Review",   icon: Clock,       color: "neon-purple" },
            { label: "Prototype Progress",    value: "25%",            icon: Microscope,  color: "neon-cyan"   },
            { label: "Engineering Requests",  value: "0",              icon: GitMerge,    color: "neon-green"  },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`bd-glass p-5 flex flex-col gap-3 card-glow-${color.replace("neon-","")}`}>
              <div className={`w-9 h-9 rounded-lg bd-glass border border-white/10 flex items-center justify-center text-${color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-white/40 text-xs font-mono">{label}</p>
                <p className={`text-${color} font-semibold text-lg`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Roadmap */}
        <div className="bd-glass p-6">
          <div className="flex items-center gap-2 mb-8">
            <Lightbulb size={18} className="text-neon-purple" />
            <h2 className="text-white font-semibold">Prototype Roadmap</h2>
          </div>

          <div className="relative flex flex-col gap-0">
            {milestones.map((m, i) => {
              const isCompleted = m.status === "completed";
              const isActive    = m.status === "active";
              const isLast      = i === milestones.length - 1;

              return (
                <div key={m.title} className="flex gap-4">
                  {/* Dot + line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 border-2 transition-all ${
                      isCompleted ? "bg-neon-purple border-neon-purple" :
                      isActive    ? "bg-neon-purple/30 border-neon-purple" :
                                    "bg-transparent border-white/30"
                    }`}>
                      {isCompleted && <CheckCircle size={12} className="text-dark m-auto" />}
                    </div>
                    {!isLast && <div className={`w-0.5 flex-1 min-h-[2rem] ${isCompleted ? "bg-neon-purple/50" : "bg-white/10"}`} />}
                  </div>

                  {/* Content */}
                  <div className="pb-8">
                    <p className={`text-sm font-mono ${isCompleted ? "text-white/40 line-through" : isActive ? "text-white" : "text-white/50"}`}>
                      {m.title}
                    </p>
                    {isActive && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-mono">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
