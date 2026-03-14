"use client";
import { FormEvent, useState } from "react";
import Footer from "@/components/Footer";

type DashboardData = {
  summary: {
    users: number;
    apprenticeship: number;
    innovations: number;
    projects: number;
    research: number;
    timeline: number;
    contacts: number;
  };
  apprenticeship: Array<{ _id: string; name: string; email: string; track: string; status: string }>;
  innovations: Array<{ _id: string; title: string; status: string; submission_type: string }>;
  contacts: Array<{ _id: string; name: string; email: string; subject: string; message: string }>;
};

export default function AdminPage() {
  const [email, setEmail] = useState("admin@bl4ckdot.dev");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  const login = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      alert(json.error || "Login failed");
      return;
    }
    setToken("session");
    await loadDashboard();
  };

  const loadDashboard = async () => {
    const res = await fetch("/api/admin/dashboard");
    const json = await res.json();
    if (!res.ok) {
      alert(json.error || "Failed to load dashboard");
      return;
    }
    setData(json);
  };

  const updateStatus = async (type: "apprenticeship" | "innovation", id: string, status: string) => {
    const res = await fetch("/api/admin/dashboard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id, status }),
    });
    if (res.ok) {
      await loadDashboard();
    }
  };

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-orbitron text-4xl text-white font-black">Admin Dashboard</h1>
        <p className="text-slate-500 mt-3">Manage users, submissions, applications, messages, and timeline data.</p>
      </section>

      {!token && (
        <section className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <form onSubmit={login} className="glass-panel rounded-xl p-6 space-y-4">
            <Input label="Admin Email" value={email} onChange={setEmail} />
            <Input label="Password" value={password} onChange={setPassword} type="password" />
            <button className="w-full py-3 rounded-lg bg-[#22D3EE] text-black font-semibold">Sign In</button>
          </form>
        </section>
      )}

      {token && data && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">
          <div className="grid sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {Object.entries(data.summary).map(([k, v]) => (
              <div key={k} className="glass-panel rounded-lg p-4 text-center">
                <p className="text-xl text-[#22D3EE] font-orbitron font-bold">{v}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-600">{k}</p>
              </div>
            ))}
          </div>

          <Block title="Apprenticeship Applications">
            {data.apprenticeship.map((item) => (
              <div key={item._id} className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between border border-slate-800 rounded-lg p-3">
                <div>
                  <p className="text-white text-sm">{item.name} ({item.track})</p>
                  <p className="text-slate-500 text-xs">{item.email}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus("apprenticeship", item._id, "approved")} className="px-3 py-1 text-xs rounded border border-[#22C55E]/50 text-[#22C55E]">Approve</button>
                  <button onClick={() => updateStatus("apprenticeship", item._id, "rejected")} className="px-3 py-1 text-xs rounded border border-[#FF3B3B]/50 text-[#FF3B3B]">Reject</button>
                </div>
              </div>
            ))}
          </Block>

          <Block title="Innovation Submissions">
            {data.innovations.map((item) => (
              <div key={item._id} className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between border border-slate-800 rounded-lg p-3">
                <div>
                  <p className="text-white text-sm">{item.title}</p>
                  <p className="text-slate-500 text-xs">{item.submission_type} • {item.status}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus("innovation", item._id, "review")} className="px-3 py-1 text-xs rounded border border-[#F59E0B]/50 text-[#F59E0B]">Review</button>
                  <button onClick={() => updateStatus("innovation", item._id, "development")} className="px-3 py-1 text-xs rounded border border-[#22C55E]/50 text-[#22C55E]">Advance</button>
                </div>
              </div>
            ))}
          </Block>

          <Block title="Contact Messages">
            {data.contacts.map((msg) => (
              <div key={msg._id} className="border border-slate-800 rounded-lg p-3">
                <p className="text-white text-sm">{msg.subject}</p>
                <p className="text-slate-500 text-xs mt-1">{msg.name} • {msg.email}</p>
                <p className="text-slate-400 text-sm mt-2">{msg.message}</p>
              </div>
            ))}
          </Block>
        </section>
      )}

      <Footer />
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2 block">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} type={type} required className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#22D3EE]/50" />
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-xl p-6 space-y-3">
      <h2 className="font-orbitron text-lg text-white">{title}</h2>
      {children}
    </div>
  );
}
