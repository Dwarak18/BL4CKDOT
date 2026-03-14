"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { GraduationCap, Lightbulb, Building2, ArrowRight } from "lucide-react";

const cards = [
  {
    title: "For Students",
    desc: "Bring your idea, build with mentors, and ship production-grade systems.",
    href: "/innovation-lab/submissions?tab=students",
    cta: "Submit Student Idea",
    color: "#22D3EE",
    Icon: GraduationCap,
  },
  {
    title: "For Innovators",
    desc: "Transform startup concepts into validated prototypes with a real engineering team.",
    href: "/innovation-lab/submissions?tab=innovators",
    cta: "Submit Innovation Concept",
    color: "#8B5CF6",
    Icon: Lightbulb,
  },
  {
    title: "For Companies",
    desc: "Collaborate with BL4CKDOT on AI, IoT, and cybersecurity innovation programs.",
    href: "/innovation-lab/submissions?tab=companies",
    cta: "Request Collaboration",
    color: "#22C55E",
    Icon: Building2,
  },
];

export default function BuildWithUsPage() {
  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(34,211,238,0.08), transparent 65%)" }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#22D3EE] text-xs font-mono tracking-[0.28em] uppercase">Action Hub</span>
          <h1 className="font-orbitron font-black text-4xl sm:text-6xl text-white mt-4 tracking-[0.02em] leading-[1.15]">
            Build With BL4CKDOT
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto mt-6 leading-[1.6]">
            Choose your path and start building real technology through the BL4CKDOT innovation ecosystem.
          </p>
        </div>
      </section>

      <section className="pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => {
            const Icon = card.Icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-2xl p-7 border"
                style={{ background: "rgba(7,11,20,0.72)", borderColor: `${card.color}35`, backdropFilter: "blur(18px)" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${card.color}18`, boxShadow: `0 0 20px ${card.color}22` }}>
                  <Icon size={22} style={{ color: card.color }} />
                </div>
                <h2 className="font-orbitron text-white text-xl mt-5 tracking-[0.02em]">{card.title}</h2>
                <p className="text-slate-400 text-sm mt-3 leading-[1.6]">{card.desc}</p>
                <Link
                  href={card.href}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
                  style={{ color: card.color, border: `1px solid ${card.color}55` }}
                >
                  {card.cta} <ArrowRight size={14} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
