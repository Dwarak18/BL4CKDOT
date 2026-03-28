"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";

type Submission = {
  _id: string;
  submission_type: string;
  title: string;
  description: string;
  category: string;
  status?: string;
  createdAt?: string;
  submitted_by?: { name?: string; email?: string; organization?: string };
};

const STATUS_COLORS: Record<string, string> = {
  pending:  "#F59E0B",
  reviewing: "#00F5FF",
  approved:  "#22C55E",
  rejected:  "#FF3B3B",
};

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/innovation-submissions")
      .then((r) => r.json())
      .then((data) => setSubmissions(Array.isArray(data) ? data : data.submissions ?? []))
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all"
    ? submissions
    : submissions.filter((s) => s.submission_type === filter);

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/innovation-lab"
          className="inline-flex items-center gap-2 text-white/40 hover:text-[#00F5FF] text-xs font-mono tracking-widest uppercase mb-8 transition-colors">
          <ArrowLeft size={14} /> Innovation Lab
        </Link>
        <span className="text-[#22D3EE] text-xs font-mono tracking-[0.3em] uppercase">Admin View</span>
        <h1 className="font-orbitron font-black text-4xl text-white mt-2">Submissions</h1>
        <p className="text-slate-400 mt-3 text-sm">All idea and collaboration submissions from the BL4CKDOT ecosystem.</p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {["all", "idea", "student", "innovator", "company"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs tracking-widest uppercase font-mono border transition-all ${
                filter === f
                  ? "text-[#22D3EE] border-[#22D3EE]/60 bg-[#22D3EE]/10"
                  : "text-slate-500 border-slate-700 hover:text-[#22D3EE]"
              }`}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-500 font-mono text-sm">Loading submissions...</div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel rounded-xl p-10 text-center">
            <p className="text-slate-500 font-mono text-sm">No submissions found.</p>
            <Link href="/innovation-lab/submit" className="mt-4 inline-flex items-center gap-2 text-[#00F5FF] text-xs font-mono hover:underline">
              Go to submission form <ExternalLink size={12} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((sub, i) => {
              const statusColor = STATUS_COLORS[sub.status ?? "pending"] ?? "#F59E0B";
              return (
                <motion.div key={sub._id ?? i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass-panel rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border"
                        style={{ color: "#22D3EE", borderColor: "rgba(34,211,238,0.3)", background: "rgba(34,211,238,0.06)" }}>
                        {sub.submission_type}
                      </span>
                      <span className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border"
                        style={{ color: statusColor, borderColor: `${statusColor}40`, background: `${statusColor}10` }}>
                        {sub.status ?? "pending"}
                      </span>
                    </div>
                    <h3 className="font-space font-semibold text-white truncate">{sub.title}</h3>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">{sub.description}</p>
                    {sub.submitted_by && (
                      <p className="text-slate-600 text-xs mt-1 font-mono">
                        {sub.submitted_by.name}
                        {sub.submitted_by.email ? ` · ${sub.submitted_by.email}` : ""}
                        {sub.submitted_by.organization ? ` · ${sub.submitted_by.organization}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    {sub.createdAt && (
                      <p className="text-slate-600 font-mono text-[10px]">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    <span className="text-slate-700 font-mono text-[10px]">{sub.category}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

import Footer from "@/components/Footer";
import { motion } from "framer-motion";

type Tab = "students" | "innovators" | "companies";

type SubmitState = "idle" | "submitting" | "success";

const tabs: { id: Tab; label: string }[] = [
  { id: "students", label: "For Students" },
  { id: "innovators", label: "For Innovators" },
  { id: "companies", label: "For Companies" },
];

export default function InnovationSubmissionsPage() {
  const searchParams = useSearchParams();
  const [active, setActive] = useState<Tab>("students");
  const [status, setStatus] = useState<SubmitState>("idle");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "students" || tab === "innovators" || tab === "companies") {
      setActive(tab);
    }
  }, [searchParams]);

  const [student, setStudent] = useState({
    name: "",
    email: "",
    domain: "AI",
    description: "",
    skills: "",
    portfolio: "",
  });

  const [innovator, setInnovator] = useState({
    name: "",
    organization: "",
    problemStatement: "",
    solutionIdea: "",
    technologyRequirements: "",
    collaborationRequest: "",
  });

  const [company, setCompany] = useState({
    companyName: "",
    industry: "",
    problemDescription: "",
    desiredTechnology: "AI",
    projectBudgetRange: "",
    contactPerson: "",
  });

  async function submit(payload: Record<string, unknown>) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/innovation-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
    } catch {
      setStatus("idle");
      alert("Submission failed. Please try again.");
    }
  }

  const studentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({
      submission_type: "student",
      title: `Student Idea: ${student.domain}`,
      description: student.description,
      category: student.domain === "Cybersecurity" ? "security" : student.domain === "Software" ? "software" : student.domain,
      submitted_by: { name: student.name, email: student.email },
      target_users: "students",
      technology_stack: student.skills.split(",").map((x) => x.trim()).filter(Boolean),
      details: {
        skills: student.skills,
        portfolio_link: student.portfolio,
      },
    });
  };

  const innovatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({
      submission_type: "innovator",
      title: innovator.problemStatement,
      description: innovator.solutionIdea,
      category: "software",
      submitted_by: { name: innovator.name, email: `${innovator.name.replace(/\s+/g, "").toLowerCase()}@placeholder.com`, organization: innovator.organization },
      target_users: "innovators",
      technology_stack: innovator.technologyRequirements.split(",").map((x) => x.trim()).filter(Boolean),
      details: {
        collaboration_request: innovator.collaborationRequest,
        problem_statement: innovator.problemStatement,
      },
    });
  };

  const companySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({
      submission_type: "company",
      title: `${company.companyName} Innovation Request`,
      description: company.problemDescription,
      category: company.desiredTechnology === "security" ? "security" : company.desiredTechnology,
      submitted_by: { name: company.contactPerson, email: `${company.contactPerson.replace(/\s+/g, "").toLowerCase()}@placeholder.com`, organization: company.companyName, contact_person: company.contactPerson },
      target_users: "companies",
      technology_stack: [company.desiredTechnology],
      details: {
        industry: company.industry,
        project_budget_range: company.projectBudgetRange,
      },
    });
  };

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-[#22D3EE] text-xs font-mono tracking-[0.3em] uppercase">Innovation Lab Submissions</span>
        <h1 className="font-orbitron font-black text-4xl text-white mt-4">Submit Innovations to BL4CKDOT</h1>
        <p className="text-slate-400 mt-4">Students, innovators, and companies can submit ideas for mentorship, prototyping, and collaboration.</p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatus("idle");
                setActive(tab.id);
              }}
              className={`px-4 py-2 rounded-lg text-xs tracking-widest uppercase font-mono border transition-all ${active === tab.id ? "text-[#22D3EE] border-[#22D3EE]/60 bg-[#22D3EE]/10" : "text-slate-500 border-slate-700 hover:text-[#22D3EE]"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {status === "success" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-lg border border-[#22C55E]/40 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#22C55E]">
            Submission received. BL4CKDOT will review and follow up.
          </motion.div>
        )}

        {active === "students" && (
          <form onSubmit={studentSubmit} className="glass-panel rounded-xl p-6 space-y-4">
            <Input label="Name" value={student.name} onChange={(v) => setStudent({ ...student, name: v })} />
            <Input label="Email" value={student.email} onChange={(v) => setStudent({ ...student, email: v })} type="email" />
            <Select label="Domain" value={student.domain} onChange={(v) => setStudent({ ...student, domain: v })} options={["AI", "IoT", "Cybersecurity", "Software"]} />
            <TextArea label="Idea description" value={student.description} onChange={(v) => setStudent({ ...student, description: v })} />
            <Input label="Skills" value={student.skills} onChange={(v) => setStudent({ ...student, skills: v })} placeholder="Python, TensorFlow, Embedded C" />
            <Input label="Portfolio link" value={student.portfolio} onChange={(v) => setStudent({ ...student, portfolio: v })} />
            <SubmitButton submitting={status === "submitting"} />
          </form>
        )}

        {active === "innovators" && (
          <form onSubmit={innovatorSubmit} className="glass-panel rounded-xl p-6 space-y-4">
            <Input label="Name" value={innovator.name} onChange={(v) => setInnovator({ ...innovator, name: v })} />
            <Input label="Organization" value={innovator.organization} onChange={(v) => setInnovator({ ...innovator, organization: v })} />
            <TextArea label="Problem statement" value={innovator.problemStatement} onChange={(v) => setInnovator({ ...innovator, problemStatement: v })} />
            <TextArea label="Solution idea" value={innovator.solutionIdea} onChange={(v) => setInnovator({ ...innovator, solutionIdea: v })} />
            <Input label="Technology requirements" value={innovator.technologyRequirements} onChange={(v) => setInnovator({ ...innovator, technologyRequirements: v })} placeholder="LLM, edge devices, cloud infra" />
            <TextArea label="Collaboration request" value={innovator.collaborationRequest} onChange={(v) => setInnovator({ ...innovator, collaborationRequest: v })} />
            <SubmitButton submitting={status === "submitting"} />
          </form>
        )}

        {active === "companies" && (
          <form onSubmit={companySubmit} className="glass-panel rounded-xl p-6 space-y-4">
            <Input label="Company name" value={company.companyName} onChange={(v) => setCompany({ ...company, companyName: v })} />
            <Input label="Industry" value={company.industry} onChange={(v) => setCompany({ ...company, industry: v })} />
            <TextArea label="Problem description" value={company.problemDescription} onChange={(v) => setCompany({ ...company, problemDescription: v })} />
            <Select label="Desired technology" value={company.desiredTechnology} onChange={(v) => setCompany({ ...company, desiredTechnology: v })} options={["AI", "IoT", "security"]} />
            <Input label="Project budget range" value={company.projectBudgetRange} onChange={(v) => setCompany({ ...company, projectBudgetRange: v })} placeholder="$10k - $50k" />
            <Input label="Contact person" value={company.contactPerson} onChange={(v) => setCompany({ ...company, contactPerson: v })} />
            <SubmitButton submitting={status === "submitting"} />
          </form>
        )}
      </section>
      <Footer />
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        required
        className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#22D3EE]/50"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#22D3EE]/50"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2 block">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        required
        className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white resize-none outline-none focus:border-[#22D3EE]/50"
      />
    </div>
  );
}

function SubmitButton({ submitting }: { submitting: boolean }) {
  return (
    <button type="submit" disabled={submitting} className="w-full py-3 rounded-lg bg-[#22D3EE] text-black font-semibold text-sm disabled:opacity-60">
      {submitting ? "Submitting..." : "Submit Innovation"}
    </button>
  );
}
