"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Footer from "@/components/Footer";

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
  pending: "#F59E0B",
  reviewing: "#00F5FF",
  approved: "#22C55E",
  rejected: "#FF3B3B",
};

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/innovation-submissions")
      .then((response) => response.json())
      .then((data) =>
        setSubmissions(Array.isArray(data) ? data : data.submissions ?? []),
      )
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all"
      ? submissions
      : submissions.filter((submission) => submission.submission_type === filter);

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-white/40 hover:text-[#00F5FF] text-xs font-mono tracking-widest uppercase mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Admin
        </Link>
        <span className="text-[#22D3EE] text-xs font-mono tracking-[0.3em] uppercase">
          Admin View
        </span>
        <h1 className="font-orbitron font-black text-4xl text-white mt-2">
          Innovation Submissions
        </h1>
        <p className="text-slate-400 mt-3 text-sm">
          All idea and collaboration submissions from the BL4CKDOT ecosystem.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex gap-2 mb-8 flex-wrap">
          {["all", "idea", "student", "innovator", "company"].map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-lg text-xs tracking-widest uppercase font-mono border transition-all ${
                filter === value
                  ? "text-[#22D3EE] border-[#22D3EE]/60 bg-[#22D3EE]/10"
                  : "text-slate-500 border-slate-700 hover:text-[#22D3EE]"
              }`}
            >
              {value === "all"
                ? "All"
                : value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-500 font-mono text-sm">
            Loading submissions...
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel rounded-xl p-10 text-center">
            <p className="text-slate-500 font-mono text-sm">
              No submissions found.
            </p>
            <Link
              href="/innovation-lab/submissions"
              className="mt-4 inline-flex items-center gap-2 text-[#00F5FF] text-xs font-mono hover:underline"
            >
              Open submission form <ExternalLink size={12} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((submission, index) => {
              const statusColor =
                STATUS_COLORS[submission.status ?? "pending"] ?? "#F59E0B";

              return (
                <motion.div
                  key={submission._id ?? index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="glass-panel rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span
                        className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border"
                        style={{
                          color: "#22D3EE",
                          borderColor: "rgba(34,211,238,0.3)",
                          background: "rgba(34,211,238,0.06)",
                        }}
                      >
                        {submission.submission_type}
                      </span>
                      <span
                        className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border"
                        style={{
                          color: statusColor,
                          borderColor: `${statusColor}40`,
                          background: `${statusColor}10`,
                        }}
                      >
                        {submission.status ?? "pending"}
                      </span>
                    </div>
                    <h3 className="font-space font-semibold text-white truncate">
                      {submission.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                      {submission.description}
                    </p>
                    {submission.submitted_by && (
                      <p className="text-slate-600 text-xs mt-1 font-mono">
                        {submission.submitted_by.name}
                        {submission.submitted_by.email
                          ? ` | ${submission.submitted_by.email}`
                          : ""}
                        {submission.submitted_by.organization
                          ? ` | ${submission.submitted_by.organization}`
                          : ""}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    {submission.createdAt && (
                      <p className="text-slate-600 font-mono text-[10px]">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    <span className="text-slate-700 font-mono text-[10px]">
                      {submission.category}
                    </span>
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
