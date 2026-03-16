"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, CheckCircle, Clock, LogOut, ChevronRight } from "lucide-react";

interface UserData { id: string; name: string; email: string; role: string; }

const modules = [
  { name: "AI Engineering Foundations", progress: 68, color: "neon-cyan" },
  { name: "Cybersecurity Basics",        progress: 45, color: "neon-purple" },
  { name: "IoT System Design",           progress: 22, color: "neon-green" },
];

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("bl4ckdot_user");
    const token = localStorage.getItem("bl4ckdot_token");
    if (!raw || !token) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    if (u.role !== "student") { router.push("/unauthorized"); return; }
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

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen py-10 px-4 animate-slide-up">
      <div className="bd-orb-cyan" />
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon-cyan mb-1">Student Dashboard</p>
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
            { label: "Apprenticeship Status", value: "Pending Review", icon: Clock, color: "neon-cyan" },
            { label: "Projects Joined",        value: "0",             icon: BookOpen, color: "neon-purple" },
            { label: "Modules Completed",      value: "0 / 3",         icon: CheckCircle, color: "neon-green" },
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

        {/* Training modules */}
        <div className="bd-glass p-6">
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap size={18} className="text-neon-cyan" />
            <h2 className="text-white font-semibold">Training Modules</h2>
          </div>
          <div className="flex flex-col gap-5">
            {modules.map((m) => (
              <div key={m.name} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-white/80 text-sm">{m.name}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-${m.color} text-xs font-mono`}>{m.progress}%</span>
                    <ChevronRight size={14} className="text-white/30" />
                  </div>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className={`h-full bg-${m.color} rounded-full transition-all duration-700`} style={{ width: `${m.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info banner */}
        <div className="mt-4 bd-glass border border-neon-cyan/20 p-4 rounded-xl flex items-center gap-3">
          <Clock size={16} className="text-neon-cyan flex-shrink-0" />
          <p className="text-white/50 text-xs font-mono">Your application is under review. You&apos;ll receive an email once it&apos;s approved.</p>
        </div>
      </div>
    </div>
  );
}
