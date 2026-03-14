"use client";
import { FormEvent, useState } from "react";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

type Result = {
  id: string;
  type: "project" | "research" | "innovation";
  title: string;
  summary: string;
  score: number;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResults(data.results || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-[#22D3EE] text-xs font-mono tracking-[0.3em] uppercase">AI Search Engine</span>
        <h1 className="font-orbitron font-black text-4xl text-white mt-4">Search the Innovation Network</h1>
        <p className="text-slate-400 mt-4">Try: "Show AI research projects" or "IoT prototypes from BL4CKDOT".</p>

        <form onSubmit={search} className="mt-8 flex flex-col sm:flex-row gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask in natural language..."
            className="flex-1 bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#22D3EE]/50"
          />
          <button className="px-6 py-3 rounded-lg bg-[#22D3EE] text-black font-semibold text-sm">{loading ? "Searching..." : "Search"}</button>
        </form>
      </section>

      <section className="pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {results.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-panel rounded-xl p-5">
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#22D3EE]">{r.type}</p>
              <h3 className="text-white font-space font-semibold mt-1">{r.title}</h3>
              <p className="text-slate-500 text-sm mt-2">{r.summary}</p>
            </motion.div>
          ))}
          {!loading && results.length === 0 && (
            <p className="text-slate-600 text-sm">No results yet. Start with a query above.</p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
