"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { GlowInput } from "@/components/ui/GlowInput";
import { GlowButton } from "@/components/ui/GlowButton";
import { TagSelector } from "@/components/ui/TagSelector";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate"];
const DOMAINS = ["AI Engineering", "Cybersecurity", "IoT Development", "Full Stack Development"];

export function StudentForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [fields, setFields] = useState({
    name: "", email: "", password: "", university: "", degree: "",
    year: "", domain: "", portfolio: "", motivation: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(key: string, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    const newErrors: Record<string, string> = {};
    if (!fields.name.trim()) newErrors.name = "Name is required";
    if (!fields.email.trim()) newErrors.email = "Email is required";
    if (!fields.password) newErrors.password = "Password is required";
    else if (fields.password.length < 8) newErrors.password = "Min 8 characters";
    if (!fields.university.trim()) newErrors.university = "University is required";
    if (!fields.degree.trim()) newErrors.degree = "Degree is required";
    if (!fields.year) newErrors.year = "Year is required";
    if (!fields.domain) newErrors.domain = "Domain is required";
    if (!fields.motivation.trim()) newErrors.motivation = "Motivation is required";
    else if (fields.motivation.trim().length < 50) newErrors.motivation = "At least 50 characters required";
    if (resumeFile && !resumeFile.name.toLowerCase().endsWith(".pdf")) newErrors.resume = "Only PDF files allowed";
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
      fd.append("skills", JSON.stringify(skills));
      if (resumeFile) fd.append("resume", resumeFile);

      const res = await fetch("/api/register/student", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Registration failed");
        return;
      }
      localStorage.setItem("bl4ckdot_token", data.token);
      localStorage.setItem("bl4ckdot_user", JSON.stringify(data.user));
      router.push("/dashboard/student");
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const motLen = fields.motivation.trim().length;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlowInput label="Full Name" accentColor="cyan" id="name" name="name" type="text"
          value={fields.name} onChange={(e) => set("name", e.target.value)}
          placeholder="Your full name" error={errors.name} />
        <GlowInput label="Email Address" accentColor="cyan" id="email" name="email" type="email"
          value={fields.email} onChange={(e) => set("email", e.target.value)}
          placeholder="you@example.com" error={errors.email} />
      </div>

      {/* Row 2 */}
      <GlowInput label="Password" accentColor="cyan" id="password" name="password" type="password"
        value={fields.password} onChange={(e) => set("password", e.target.value)}
        placeholder="Min 8 characters" error={errors.password} />

      <div className="border-t border-white/5 pt-2">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon-cyan/60 mb-4">Academic Background</p>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlowInput label="University / College" accentColor="cyan" value={fields.university}
              onChange={(e) => set("university", e.target.value)} placeholder="Your institution" error={errors.university} />
            <GlowInput label="Degree Program" accentColor="cyan" value={fields.degree}
              onChange={(e) => set("degree", e.target.value)} placeholder="B.Sc. Computer Science" error={errors.degree} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs tracking-[0.3em] uppercase text-neon-cyan">Year of Study</label>
              <select value={fields.year} onChange={(e) => set("year", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono outline-none input-glow-cyan">
                <option value="" className="bg-dark-2">Select year</option>
                {YEARS.map((y) => <option key={y} value={y} className="bg-dark-2">{y}</option>)}
              </select>
              {errors.year && <p className="text-red-400 text-xs font-mono">{errors.year}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs tracking-[0.3em] uppercase text-neon-cyan">Primary Domain</label>
              <select value={fields.domain} onChange={(e) => set("domain", e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono outline-none input-glow-cyan">
                <option value="" className="bg-dark-2">Select domain</option>
                {DOMAINS.map((d) => <option key={d} value={d} className="bg-dark-2">{d}</option>)}
              </select>
              {errors.domain && <p className="text-red-400 text-xs font-mono">{errors.domain}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-2">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon-cyan/60 mb-4">Skills &amp; Portfolio</p>
        <div className="flex flex-col gap-4">
          <TagSelector label="Skills" value={skills} onChange={setSkills} accentColor="cyan" placeholder="Add a skill…" />
          <GlowInput label="Portfolio / GitHub Link" accentColor="cyan" type="url"
            value={fields.portfolio} onChange={(e) => set("portfolio", e.target.value)}
            placeholder="https://github.com/yourprofile" />
        </div>
      </div>

      <div className="border-t border-white/5 pt-2">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon-cyan/60 mb-4">Your Story</p>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-xs tracking-[0.3em] uppercase text-neon-cyan">Motivation</label>
          <textarea rows={5} value={fields.motivation} onChange={(e) => set("motivation", e.target.value)}
            placeholder="Tell us why you want to join the BL4CKDOT apprenticeship…"
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm font-mono outline-none input-glow-cyan resize-none transition-all duration-200" />
          <div className="flex justify-between items-center">
            {errors.motivation ? <p className="text-red-400 text-xs font-mono">{errors.motivation}</p> : <span />}
            <p className={`text-xs font-mono transition-colors ${motLen >= 50 ? "text-neon-green/60" : "text-white/30"}`}>
              {motLen} / 50 min
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-2">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon-cyan/60 mb-4">Resume</p>
        <div
          className="relative flex flex-col items-center justify-center gap-2 h-28 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-neon-cyan/40 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={20} className="text-white/40" />
          <p className="text-white/50 text-sm font-mono">
            {resumeFile ? resumeFile.name : "Click to upload PDF resume"}
          </p>
          <input ref={fileRef} type="file" accept=".pdf" className="hidden"
            onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)} />
        </div>
        {errors.resume && <p className="text-red-400 text-xs font-mono mt-1">{errors.resume}</p>}
      </div>

      {submitError && (
        <div className="bd-glass border border-red-400/30 p-4 rounded-xl">
          <p className="text-red-400 text-sm font-mono">{submitError}</p>
        </div>
      )}

      <GlowButton variant="cyan" type="submit" loading={loading} icon>
        Apply for Apprenticeship
      </GlowButton>
    </form>
  );
}
