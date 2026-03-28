#!/usr/bin/env python3
import os
import sys

# Create directories
dir1 = r'c:\Users\Bixbie\Documents\event\bl4cksite\app\innovation-lab\submit'
dir2 = r'c:\Users\Bixbie\Documents\event\bl4cksite\app\build-with-us-DELETE'

try:
    os.makedirs(dir1, exist_ok=True)
    print('✓ Directory 1 created')
    
    os.makedirs(dir2, exist_ok=True)
    print('✓ Directory 2 created')
    
    # Create page.tsx
    page_content = r'''"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, FlaskConical } from "lucide-react";

type SubmitState = "idle" | "submitting" | "success";

const DOMAINS  = ["AI / Machine Learning", "IoT / Embedded Systems", "Cybersecurity", "Micro-LLM / Edge AI", "Software Engineering", "Hardware Prototyping"];
const STAGES   = ["Concept only", "Early research", "Prototype in progress", "MVP ready", "Seeking scaling support"];
const SUPPORTS = ["Research", "Prototype Development", "Mentorship", "Engineering Collaboration"];

export default function IdeaSubmitPage() {
  const [status, setStatus] = useState<SubmitState>("idle");
  const [supports, setSupports] = useState<string[]>([]);
  const [fields, setFields] = useState({
    projectName: "",
    problemStatement: "",
    solutionIdea: "",
    domain: "",
    stage: "",
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(key: string, val: string) {
    setFields((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  function toggleSupport(s: string) {
    setSupports((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!fields.name.trim())            newErrors.name = "Required";
    if (!fields.email.trim())           newErrors.email = "Required";
    if (!fields.projectName.trim())     newErrors.projectName = "Required";
    if (!fields.problemStatement.trim() || fields.problemStatement.trim().length < 50)
      newErrors.problemStatement = "At least 50 characters required";
    if (!fields.solutionIdea.trim() || fields.solutionIdea.trim().length < 50)
      newErrors.solutionIdea = "At least 50 characters required";
    if (!fields.domain) newErrors.domain = "Select a domain";
    if (!fields.stage)  newErrors.stage  = "Select a stage";
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    setStatus("submitting");
    try {
      const res = await fetch("/api/innovation-submissions", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_type: "idea",
          title:           fields.projectName,
          description:     fields.solutionIdea,
          category:        fields.domain,
          submitted_by:    { name: fields.name, email: fields.email },
          details: {
            problem_statement: fields.problemStatement,
            stage:             fields.stage,
            support_needed:    supports,
          },
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("idle");
      alert("Submission failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen py-16 px-4 relative">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top, rgba(0,245,255,0.04), transparent 60%)" }} />

      <div className="max-w-2xl mx-auto relative z-10">
        <Link href="/innovation-lab"
          className="inline-flex items-center gap-2 text-white/40 hover:text-[#00F5FF] text-xs font-mono tracking-widest uppercase mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Innovation Lab
        </Link>

        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🔬</div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/5 font-mono text-xs tracking-[0.3em] uppercase text-[#00F5FF] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] animate-pulse" />
            Idea Submission
          </span>
          <h1 className="font-orbitron font-black text-3xl text-white mt-3">Submit Your Idea</h1>
          <p className="text-white/40 text-sm max-w-lg mx-auto mt-2 leading-relaxed">
            Share your innovation concept with the BL4CKDOT team. We review every submission for research, prototyping, and collaboration potential.
          </p>
        </div>

        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-10 text-center border border-[#22C55E]/30"
          >
            <FlaskConical size={40} className="text-[#22C55E] mx-auto mb-4" />
            <h2 className="font-orbitron font-black text-2xl text-white mb-3">Idea Received</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The BL4CKDOT team will review your submission and reach out within 5–7 business days.
            </p>
            <Link href="/innovation-lab"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/40 text-[#22C55E] text-sm font-semibold">
              Back to Innovation Lab
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 border border-[#00F5FF]/15 space-y-6">
            <div>
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#00F5FF]/60 mb-4">Your Identity</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" error={errors.name}>
                  <input value={fields.name} onChange={(e) => set("name", e.target.value)}
                    placeholder="Your name" className={inputCls} />
                </Field>
                <Field label="Email Address" error={errors.email}>
                  <input type="email" value={fields.email} onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com" className={inputCls} />
                </Field>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#00F5FF]/60 mb-4">Your Innovation</p>
              <div className="space-y-4">
                <Field label="Project / Startup Name" error={errors.projectName}>
                  <input value={fields.projectName} onChange={(e) => set("projectName", e.target.value)}
                    placeholder="What is it called?" className={inputCls} />
                </Field>
                <Field label="Problem Statement" error={errors.problemStatement}>
                  <textarea rows={4} value={fields.problemStatement}
                    onChange={(e) => set("problemStatement", e.target.value)}
                    placeholder="What problem does this solve? (min 50 chars)"
                    className={`${inputCls} resize-none`} />
                  <CharCount n={fields.problemStatement.trim().length} />
                </Field>
                <Field label="Solution Idea" error={errors.solutionIdea}>
                  <textarea rows={4} value={fields.solutionIdea}
                    onChange={(e) => set("solutionIdea", e.target.value)}
                    placeholder="How do you plan to solve it? (min 50 chars)"
                    className={`${inputCls} resize-none`} />
                  <CharCount n={fields.solutionIdea.trim().length} />
                </Field>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#00F5FF]/60 mb-4">Technical Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Tech Domain" error={errors.domain}>
                  <select value={fields.domain} onChange={(e) => set("domain", e.target.value)} className={inputCls}>
                    <option value="">Select domain</option>
                    {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Stage of Idea" error={errors.stage}>
                  <select value={fields.stage} onChange={(e) => set("stage", e.target.value)} className={inputCls}>
                    <option value="">Select stage</option>
                    {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#00F5FF]/60 mb-4">Support Needed</p>
              <div className="flex flex-wrap gap-2">
                {SUPPORTS.map((s) => (
                  <button key={s} type="button" onClick={() => toggleSupport(s)}
                    className={`px-4 py-2 rounded-lg text-xs font-mono border transition-all ${
                      supports.includes(s)
                        ? "bg-[#00F5FF]/15 border-[#00F5FF]/60 text-[#00F5FF]"
                        : "border-slate-700 text-slate-500 hover:border-[#00F5FF]/30"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={status === "submitting"}
              className="w-full py-4 rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/40 text-[#00F5FF] font-semibold text-sm hover:bg-[#00F5FF]/20 transition-all disabled:opacity-50">
              {status === "submitting" ? "Submitting…" : "Submit Idea →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputCls = "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono outline-none focus:border-[#00F5FF]/50 transition-colors [&_option]:bg-[#0a0f1e]";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-xs tracking-[0.3em] uppercase text-[#00F5FF]/70">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
    </div>
  );
}

function CharCount({ n }: { n: number }) {
  return (
    <p className={`text-xs font-mono text-right transition-colors ${n >= 50 ? "text-[#22C55E]/60" : "text-white/30"}`}>
      {n} / 50 min
    </p>
  );
}
'''
    
    file_path = os.path.join(dir1, 'page.tsx')
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(page_content)
    print('✓ File created: page.tsx')
    
    print('\n✅ SUCCESS: All directories and files created!')
    print(f'  1. Directory: {dir1}')
    print(f'  2. Directory: {dir2}')
    print(f'  3. File: {file_path}')
    
except Exception as e:
    print(f'❌ ERROR: {e}', file=sys.stderr)
    sys.exit(1)
