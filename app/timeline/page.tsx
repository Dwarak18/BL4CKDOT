"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

type TimelineEvent = {
  _id?: string;
  year: number;
  title: string;
  description: string;
};

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/timeline");
      const data = await res.json();
      setEvents(data.events || []);
    })();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top, rgba(34,211,238,0.08) 0%, transparent 60%)" }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-[#22D3EE] text-xs font-mono tracking-[0.3em] uppercase">Vision Timeline</span>
          <h1 className="font-orbitron font-black text-4xl sm:text-6xl text-white mt-4">
            BL4CKDOT Growth Journey
          </h1>
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">
            From student-led initiative to living innovation ecosystem where ideas become products.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pl-8 border-l border-[#22D3EE]/20 space-y-8">
            {events.map((event, idx) => (
              <motion.div
                key={`${event.year}-${event.title}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="relative"
              >
                <div className="absolute -left-[2.45rem] w-5 h-5 rounded-full border border-[#22D3EE]/50 bg-[#22D3EE]/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#22D3EE]" />
                </div>
                <div className="glass-panel rounded-xl p-5 space-y-2">
                  <p className="font-orbitron font-black text-2xl text-[#22D3EE]">{event.year}</p>
                  <h3 className="text-white font-space font-semibold text-lg">{event.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
