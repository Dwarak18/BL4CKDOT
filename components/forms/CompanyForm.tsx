"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { GlowInput } from "@/components/ui/GlowInput";
import { GlowButton } from "@/components/ui/GlowButton";

const INDUSTRIES      = ["Technology", "Healthcare", "Finance", "Education", "Manufacturing", "Retail", "Government", "Other"];
const TECH_INTERESTS  = ["AI", "IoT", "Cybersecurity", "Automation Systems"];
const BUDGET_RANGES   = ["Under $5k", "$5k–$20k", "$20k–$100k", "Enterprise"];
const PARTNERSHIP_TYPES = ["Research Collaboration", "Prototype Development", "Full Product Engineering"];

export function CompanyForm() {
  const router = useRouter();
  const [loading, setLoading]       = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [techInterest, setTechInterest] = useState<string[]>([]);
  const [fields, setFields] = useState({
    companyName: "", website: "", industry: "", contactPerson: "",
    contactEmail: "", contactPhone: "", projectDescription: "",
    budgetRange: "", partnershipType: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(key: string, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  function toggleTech(opt: string) {
    setTechInterest((t) => t.includes(opt) ? t.filter((x) => x !== opt) : [...t, opt]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    const newErrors: Record<string, string> = {};
    if (!fields.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!fields.industry) newErrors.industry = "Industry is required";
    if (!fields.contactPerson.trim()) newErrors.contactPerson = "Contact person is required";
    if (!fields.contactEmail.trim()) newErrors.contactEmail = "Contact email is required";
    if (!fields.projectDescription.trim()) newErrors.projectDescription = "Project description is required";
    else if (fields.projectDescription.trim().length < 50) newErrors.projectDescription = "At least 50 characters required";
    if (!fields.budgetRange) newErrors.budgetRange = "Budget range is required";
    if (!fields.partnershipType) newErrors.partnershipType = "Partnership type is required";
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    setLoading(true);
    try {
      const res = await fetch("/api/register/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, technologyInterest: techInterest }),
      });
      const data = await res.json();
      if (!res.ok) { setSubmitError(data.error || "Registration failed"); return; }
      localStorage.setItem("bl4ckdot_token", data.token);
      localStorage.setItem("bl4ckdot_user", JSON.stringify(data.user));
      router.push("/dashboard/company");
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const descLen = fields.projectDescription.trim().length;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlowInput label="Company Name" accentColor="green" value={fields.companyName}
          onChange={(e) => set("companyName", e.target.value)} placeholder="Acme Corp" error={errors.companyName} />
        <GlowInput label="Company Website" accentColor="green" type="url" value={fields.website}
          onChange={(e) => set("website", e.target.value)} placeholder="https://yourcompany.com" />
      </div>

      {/* Row 2 */}
      <div className="flex flex-col gap-1.5">
        <label className="font-mono text-xs tracking-[0.3em] uppercase text-neon-green">Industry</label>
        <select value={fields.industry} onChange={(e) => set("industry", e.target.value)}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono outline-none input-glow-green">
          <option value="" className="bg-dark-2">Select industry</option>
          {INDUSTRIES.map((i) => <option key={i} value={i} className="bg-dark-2">{i}</option>)}
        </select>
        {errors.industry && <p className="text-red-400 text-xs font-mono">{errors.industry}</p>}
      </div>

      <div className="border-t border-white/5 pt-2">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon-green/60 mb-4">Contact Details</p>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlowInput label="Contact Person Name" accentColor="green" value={fields.contactPerson}
              onChange={(e) => set("contactPerson", e.target.value)} placeholder="Jane Doe" error={errors.contactPerson} />
            <GlowInput label="Contact Email" accentColor="green" type="email" value={fields.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)} placeholder="contact@company.com" error={errors.contactEmail} />
          </div>
          <GlowInput label="Contact Phone (optional)" accentColor="green" type="tel" value={fields.contactPhone}
            onChange={(e) => set("contactPhone", e.target.value)} placeholder="+1 555 000 0000" />
        </div>
      </div>

      <div className="border-t border-white/5 pt-2">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon-green/60 mb-4">Project Details</p>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-xs tracking-[0.3em] uppercase text-neon-green">Project Description</label>
          <textarea rows={5} value={fields.projectDescription} onChange={(e) => set("projectDescription", e.target.value)}
            placeholder="Describe the project or challenge you need help with…"
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm font-mono outline-none input-glow-green resize-none transition-all duration-200" />
          <div className="flex justify-between">
            {errors.projectDescription ? <p className="text-red-400 text-xs font-mono">{errors.projectDescription}</p> : <span />}
            <p className={`text-xs font-mono ${descLen >= 50 ? "text-neon-green/60" : "text-white/30"}`}>{descLen} / 50 min</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-2">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon-green/60 mb-4">Technology Interest</p>
        <div className="grid grid-cols-2 gap-3">
          {TECH_INTERESTS.map((opt) => {
            const active = techInterest.includes(opt);
            return (
              <button key={opt} type="button" onClick={() => toggleTech(opt)}
                className={cn(
                  "py-3 px-4 rounded-xl text-xs font-mono tracking-wide transition-all duration-200 text-left",
                  active
                    ? "bg-neon-green/10 border border-neon-green/60 text-neon-green"
                    : "bg-white/[0.03] border border-white/10 text-white/50 hover:border-neon-green/30 hover:text-white/70",
                )}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/5 pt-2">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon-green/60 mb-4">Engagement Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs tracking-[0.3em] uppercase text-neon-green">Budget Range</label>
            <select value={fields.budgetRange} onChange={(e) => set("budgetRange", e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono outline-none input-glow-green">
              <option value="" className="bg-dark-2">Select range</option>
              {BUDGET_RANGES.map((b) => <option key={b} value={b} className="bg-dark-2">{b}</option>)}
            </select>
            {errors.budgetRange && <p className="text-red-400 text-xs font-mono">{errors.budgetRange}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs tracking-[0.3em] uppercase text-neon-green">Partnership Type</label>
            <select value={fields.partnershipType} onChange={(e) => set("partnershipType", e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono outline-none input-glow-green">
              <option value="" className="bg-dark-2">Select type</option>
              {PARTNERSHIP_TYPES.map((p) => <option key={p} value={p} className="bg-dark-2">{p}</option>)}
            </select>
            {errors.partnershipType && <p className="text-red-400 text-xs font-mono">{errors.partnershipType}</p>}
          </div>
        </div>
      </div>

      {submitError && (
        <div className="bd-glass border border-red-400/30 p-4 rounded-xl">
          <p className="text-red-400 text-sm font-mono">{submitError}</p>
        </div>
      )}

      <GlowButton variant="green" type="submit" loading={loading} icon>
        Request Collaboration
      </GlowButton>
    </form>
  );
}
