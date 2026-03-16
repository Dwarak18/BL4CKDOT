"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Layers, FlaskConical, Clock, Zap, LogOut } from "lucide-react";

interface UserData { id: string; name: string; email: string; role: string; }

export default function CompanyDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("bl4ckdot_user");
    const token = localStorage.getItem("bl4ckdot_token");
    if (!raw || !token) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    if (u.role !== "company") { router.push("/unauthorized"); return; }
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

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-neon-green/30 border-t-neon-green rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen py-10 px-4 animate-slide-up">
      <div className="bd-orb-green" />
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon-green mb-1">Company Dashboard</p>
            <h1 className="text-2xl font-bold text-white">Welcome, {user.name.split(" ")[0]}</h1>
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
            { label: "Partnership Status",       value: "Under Review",   icon: Clock,      color: "neon-green"  },
            { label: "Active Projects",          value: "0",              icon: Layers,     color: "neon-cyan"   },
            { label: "Research Collaborations",  value: "0",              icon: FlaskConical, color: "neon-purple" },
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

        {/* Project Updates (empty state) */}
        <div className="bd-glass p-6">
          <div className="flex items-center gap-2 mb-6">
            <Building2 size={18} className="text-neon-green" />
            <h2 className="text-white font-semibold">Project Updates</h2>
          </div>

          <div className="flex flex-col items-center justify-center py-14 gap-4">
            <div className="w-14 h-14 rounded-2xl bd-glass border border-neon-green/20 flex items-center justify-center">
              <Zap size={24} className="text-neon-green/60" />
            </div>
            <div className="text-center">
              <p className="text-white/60 font-mono text-sm">Your partnership request is under review</p>
              <p className="text-white/30 text-xs mt-1">Project updates will appear here once your collaboration is accepted.</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 bd-glass border border-neon-green/20 p-4 rounded-xl flex items-center gap-3">
          <Clock size={16} className="text-neon-green flex-shrink-0" />
          <p className="text-white/50 text-xs font-mono">Our team will contact you at {user.email} to discuss next steps.</p>
        </div>
      </div>
    </div>
  );
}
