"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { GlowInput } from "@/components/ui/GlowInput";
import { GlowButton } from "@/components/ui/GlowButton";

const TECH_DOMAINS = ["AI", "IoT", "Cybersecurity", "Software Platform", "Other"];
const STAGES       = ["Idea", "Prototype", "MVP", "Existing Product"];
const SUPPORT_OPTS = [
  "Research",
  "Prototype Development",
  "Technical Mentorship",
  "Engineering Team Collaboration",
];

export function InnovatorForm() {
  const router = useRouter();
  const [loading, setLoading]     = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [support, setSupport]   = useState<string[]>([]);
  const [fields, setFields]     = useState({
    name: "", email: "", password: "", location: "", startupName: "",
    problem: "", solution: "", technologyDomain: "", stage: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(key: string, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  function toggleSupport(opt: string) {
    setSupport((s) => s.includes(opt) ? s.filter((x) => x !== opt) : [...s, opt]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    const newErrors: Record<string, string> = {};
    if (!fields.name.trim()) newErrors.name = "Name is required";
    if (!fields.email.trim()) newErrors.email = "Email is required";
    if (!fields.password) newErrors.password = "Password required";
    else if (fields.password.length < 8) newErrors.password = "Min 8 characters";
    if (!fields.location.trim()) newErrors.location = "Location is required";
    if (!fields.startupName.trim()) newErrors.startupName = "Startup name is required";
    if (!fields.problem.trim()) newErrors.problem = "Problem statement is required";
    else if (fields.problem.trim().length < 50) newErrors.problem = "At least 50 characters";
    if (!fields.solution.trim()) newErrors.solution = "Solution is required";
    else if (fields.solution.trim().length < 50) newErrors.solution = "At least 50 characters";
    if (!fields.technologyDomain) newErrors.technologyDomain = "Domain is required";
    if (!fields.stage) newErrors.stage = "Stage is required";
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    setLoading(true);
    try {
      const res = await fetch("/api/register/innovator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, supportNeeded: support }),
      });
      const data = await res.json();
      if (!res.ok) { setSubmitError(data.error || "Registration failed"); return; }
      localStorage.setItem("bl4ckdot_token", data.token);
      localStorage.setItem("bl4ckdot_user", JSON.stringify(data.user));
      router.push("/dashboard/innovator");
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const probLen = fields.problem.trim().length;
  const solLen  = fields.solution.trim().length;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlowInput label="Full Name" accentColor="purple" value={fields.name}
          onChange={(e) => set("name", e.target.value)} placeholder="Your name" error={errors.name} />
        <GlowInput label="Email Address" accentColor="purple" type="email" value={fields.email}
          onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" error={errors.email} />
      </div>
      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlowInput label="Password" accentColor="purple" type="password" value={fields.password}
          onChange={(e) => set("password", e.target.value)} placeholder="Min 8 characters" error={errors.password} />
        <GlowInput label="Country / Location" accentColor="purple" value={fields.location}
          onChange={(e) => set("location", e.target.value)} placeholder="e.g. Colombo, Sri Lanka" error={errors.location} />
      </div>

      <div className="border-t border-white/5 pt-2">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon-purple/60 mb-4">Your Innovation</p>
        <div className="flex flex-col gap-4">
          <GlowInput label="Startup / Project Name" accentColor="purple" value={fields.startupName}
            onChange={(e) => set("startupName", e.target.value)} placeholder="Your innovation name" error={errors.startupName} />

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs tracking-[0.3em] uppercase text-neon-purple">Problem Statement</label>
            <textarea rows={4} value={fields.problem} onChange={(e) => set("problem", e.target.value)}
              placeholder="Describe the problem your innovation solves…"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm font-mono outline-none input-glow-purple resize-none transition-all duration-200" />
            <div className="flex justify-between">
              {errors.problem ? <p className="text-red-400 text-xs font-mono">{errors.problem}</p> : <span />}
              <p className={`text-xs font-mono ${probLen >= 50 ? "text-neon-green/60" : "text-white/30"}`}>{probLen} / 50 min</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs tracking-[0.3em] uppercase text-neon-purple">Solution Idea</label>
            <textarea rows={4} value={fields.solution} onChange={(e) => set("solution", e.target.value)}
              placeholder="Describe your proposed solution…"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm font-mono outline-none input-glow-purple resize-none transition-all duration-200" />
            <div className="flex justify-between">
              {errors.solution ? <p className="text-red-400 text-xs font-mono">{errors.solution}</p> : <span />}
              <p className={`text-xs font-mono ${solLen >= 50 ? "text-neon-green/60" : "text-white/30"}`}>{solLen} / 50 min</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-2">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon-purple/60 mb-4">Technical Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs tracking-[0.3em] uppercase text-neon-purple">Technology Domain</label>
            <select value={fields.technologyDomain} onChange={(e) => set("technologyDomain", e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono outline-none input-glow-purple">
              <option value="" className="bg-dark-2">Select domain</option>
              {TECH_DOMAINS.map((d) => <option key={d} value={d} className="bg-dark-2">{d}</option>)}
            </select>
            {errors.technologyDomain && <p className="text-red-400 text-xs font-mono">{errors.technologyDomain}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs tracking-[0.3em] uppercase text-neon-purple">Stage of Idea</label>
            <select value={fields.stage} onChange={(e) => set("stage", e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono outline-none input-glow-purple">
              <option value="" className="bg-dark-2">Select stage</option>
              {STAGES.map((s) => <option key={s} value={s} className="bg-dark-2">{s}</option>)}
            </select>
            {errors.stage && <p className="text-red-400 text-xs font-mono">{errors.stage}</p>}
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-2">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon-purple/60 mb-4">Support Needed</p>
        <div className="grid grid-cols-2 gap-3">
          {SUPPORT_OPTS.map((opt) => {
            const active = support.includes(opt);
            return (
              <button key={opt} type="button" onClick={() => toggleSupport(opt)}
                className={cn(
                  "py-3 px-4 rounded-xl text-xs font-mono tracking-wide transition-all duration-200 text-left",
                  active
                    ? "bg-neon-purple/15 border border-neon-purple/60 text-neon-purple"
                    : "bg-white/[0.03] border border-white/10 text-white/50 hover:border-neon-purple/30 hover:text-white/70",
                )}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {submitError && (
        <div className="bd-glass border border-red-400/30 p-4 rounded-xl">
          <p className="text-red-400 text-sm font-mono">{submitError}</p>
        </div>
      )}

      <GlowButton variant="purple" type="submit" loading={loading} icon>
        Submit Innovation Concept
      </GlowButton>
    </form>
  );
}
