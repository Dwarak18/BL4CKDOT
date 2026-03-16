"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Shield, Users, Filter, LogOut, RefreshCw } from "lucide-react";
import { GlowInput } from "@/components/ui/GlowInput";
import { GlowButton } from "@/components/ui/GlowButton";
import Footer from "@/components/Footer";

type Role   = "student" | "innovator" | "company" | "admin";
type Status = "pending" | "reviewing" | "accepted" | "rejected";

interface AppUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  created_at?: string;
  createdAt?: string;
}

const ROLE_COLORS: Record<Role, string>   = { student: "neon-cyan", innovator: "neon-purple", company: "neon-green", admin: "neon-orange" };
const STATUS_COLORS: Record<Status, string> = { pending: "yellow-400", reviewing: "blue-400", accepted: "neon-green", rejected: "red-400" };
const STATUS_OPTIONS: Status[] = ["pending", "reviewing", "accepted", "rejected"];
const ROLE_TABS = ["all", "student", "innovator", "company"] as const;

export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed]         = useState(false);
  const [loginEmail, setLoginEmail] = useState("admin@bl4ckdot.dev");
  const [loginPass,  setLoginPass]  = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [apps, setApps]         = useState<AppUser[]>([]);
  const [loading, setLoading]   = useState(false);
  const [tab, setTab]           = useState<typeof ROLE_TABS[number]>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const loadApps = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("bl4ckdot_token");
      const res = await fetch("/api/admin/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { setAuthed(false); return; }
      const data = await res.json();
      setApps(data.applications);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const u = localStorage.getItem("bl4ckdot_user");
    const t = localStorage.getItem("bl4ckdot_token");
    if (u && t && JSON.parse(u).role === "admin") { setAuthed(true); }
  }, []);

  useEffect(() => { if (authed) loadApps(); }, [authed, loadApps]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.error || "Invalid credentials"); return; }
      if (data.user.role !== "admin") { setLoginError("Not an admin account"); return; }
      localStorage.setItem("bl4ckdot_token", data.token);
      localStorage.setItem("bl4ckdot_user", JSON.stringify(data.user));
      setAuthed(true);
    } catch { setLoginError("Network error"); }
    finally { setLoginLoading(false); }
  }

  async function updateStatus(userId: string, status: Status) {
    setUpdating(userId);
    const token = localStorage.getItem("bl4ckdot_token");
    await fetch("/api/admin/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId, status }),
    });
    setUpdating(null);
    loadApps();
  }

  async function handleSignOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Best-effort logout: still clear local state if request fails.
    }
    localStorage.clear();
    setAuthed(false);
    router.push("/login");
  }

  const filtered = tab === "all" ? apps : apps.filter((a) => a.role === tab);
  const counts   = { all: apps.length, student: apps.filter((a) => a.role === "student").length, innovator: apps.filter((a) => a.role === "innovator").length, company: apps.filter((a) => a.role === "company").length };

  // ── Login Screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 animate-slide-up">
        <div className="bd-orb-orange fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]
          bg-[radial-gradient(circle,rgba(255,107,0,0.06)_0%,transparent_70%)] rounded-full pointer-events-none" />
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bd-glass border border-neon-orange/30 flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-neon-orange" />
            </div>
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon-orange">Restricted Area</p>
            <h1 className="text-2xl font-bold text-white mt-2">Admin Access</h1>
          </div>
          <div className="bd-glass p-8">
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <GlowInput label="Admin Email" accentColor="orange" type="email"
                value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              <GlowInput label="Password" accentColor="orange" type="password"
                value={loginPass} onChange={(e) => setLoginPass(e.target.value)} />
              {loginError && <p className="text-red-400 text-xs font-mono">{loginError}</p>}
              <GlowButton variant="cyan" type="submit" loading={loginLoading} icon>
                Authenticate
              </GlowButton>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen animate-slide-up">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon-orange mb-1">Admin Panel</p>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Shield size={22} className="text-neon-orange" /> Applications Management
            </h1>
          </div>
          <div className="flex gap-3">
            <button onClick={loadApps} className="flex items-center gap-2 px-4 py-2 rounded-xl bd-glass border border-white/10 text-white/50 hover:text-white text-xs font-mono transition-colors">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bd-glass border border-white/10 text-white/50 hover:text-white text-xs font-mono transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {([["all", "Total"], ["student", "Students"], ["innovator", "Innovators"], ["company", "Companies"]] as const).map(([key, label]) => (
            <div key={key} className="bd-glass p-4 text-center">
              <p className="text-2xl font-bold text-white">{counts[key]}</p>
              <p className="text-white/40 text-xs font-mono mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Role filter tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter size={14} className="text-white/40" />
          {ROLE_TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all duration-200 capitalize
                ${tab === t ? "bg-neon-orange/15 border border-neon-orange/50 text-neon-orange" : "bg-white/[0.03] border border-white/10 text-white/50 hover:text-white"}`}>
              {t} {t !== "all" ? `(${counts[t as keyof typeof counts]})` : ""}
            </button>
          ))}
        </div>

        {/* Application cards */}
        <div className="bd-glass p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users size={18} className="text-neon-orange" />
            <h2 className="text-white font-semibold">Applications ({filtered.length})</h2>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-neon-orange/30 border-t-neon-orange rounded-full animate-spin" />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-white/30 text-sm font-mono text-center py-12">No applications found</p>
          )}

          {!loading && filtered.length > 0 && (
            <div className="flex flex-col gap-3">
              {filtered.map((app) => {
                const rc = ROLE_COLORS[app.role];
                const sc = STATUS_COLORS[app.status];
                return (
                  <div key={app._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bd-glass flex items-center justify-center flex-shrink-0 text-${rc}`}>
                        <span className="text-xs font-bold uppercase">{app.role.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{app.name}</p>
                        <p className="text-white/40 text-xs font-mono">{app.email}</p>
                        <p className="text-white/25 text-xs font-mono mt-0.5">
                          {new Date(app.created_at ?? app.createdAt ?? Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Role badge */}
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-mono border bg-${rc}/10 border-${rc}/30 text-${rc} capitalize`}>
                        {app.role}
                      </span>

                      {/* Status badge + dropdown */}
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-mono text-${sc} bg-${sc}/10 border border-${sc}/30 capitalize`}>
                          {app.status}
                        </span>
                        <select
                          value={app.status}
                          disabled={updating === app._id}
                          onChange={(e) => updateStatus(app._id, e.target.value as Status)}
                          className="bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs font-mono outline-none cursor-pointer"
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="bg-dark-2 capitalize">{s}</option>)}
                        </select>
                        {updating === app._id && <div className="w-4 h-4 border border-neon-orange/30 border-t-neon-orange rounded-full animate-spin" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
