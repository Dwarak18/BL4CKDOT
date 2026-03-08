"use client";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { Package, ArrowRight, ExternalLink, Star } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

const products = [
  {
    name: "BL4CK-CERT",
    tagline: "Secure Certificate Verification Platform",
    desc: "A blockchain-anchored certificate issuance and verification system. Issues tamper-proof digital credentials and enables instant QR-based verification by employers and institutions.",
    features: ["Instant QR verification", "Tamper-proof blockchain anchoring", "Bulk certificate issuance", "Issuer dashboard", "Public verification portal"],
    status: "Released",
    color: "#22C55E",
    badge: "Live",
    pricing: "Free tier + Enterprise",
  },
  {
    name: "BL4CK-IOT SHIELD",
    tagline: "IoT Device Authentication Framework",
    desc: "Enterprise-grade mutual TLS and hardware attestation framework for securing IoT deployments. Prevents rogue device injection with cryptographic device identity certificates.",
    features: ["Hardware root-of-trust", "Mutual TLS device auth", "Certificate lifecycle management", "Rogue device detection", "REST API integration"],
    status: "Beta",
    color: "#00F5FF",
    badge: "Beta",
    pricing: "Developer preview",
  },
  {
    name: "BL4CKBOT",
    tagline: "Edge AI Study Assistant",
    desc: "A locally-deployed AI study assistant powered by our micro-LLM research. Runs entirely offline on Raspberry Pi, protecting student data while delivering intelligent tutoring.",
    features: ["Runs fully offline", "1B param micro-LLM", "Subject-specific training", "Student progress tracking", "API for integration"],
    status: "Development",
    color: "#7C3AED",
    badge: "Coming Soon",
    pricing: "Open source",
  },
  {
    name: "CYBERTRAIN LAB",
    tagline: "Hacking Practice Platform",
    desc: "A containerized CTF and cybersecurity training platform. Students practice real attack techniques in safe, isolated environments with automated scoring and progress tracking.",
    features: ["20+ CTF challenges", "Docker-isolated environments", "Automated flag validation", "Leaderboard system", "Custom challenge creation"],
    status: "Research",
    color: "#FF3B3B",
    badge: "Research",
    pricing: "TBD",
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top, rgba(34,197,94,0.04) 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-3xl">
            <span className="text-[#22C55E] text-xs font-mono tracking-[0.3em] uppercase">What We Ship</span>
            <h1 className="font-orbitron font-black text-4xl sm:text-6xl text-white mt-4 mb-6">
              BL4CKDOT <span className="gradient-text">Products</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Research-backed, security-first software products built by BL4CKDOT. Each product solves a real problem discovered through our research.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {products.map((product, i) => (
          <motion.div key={product.name} variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true }} custom={i}
            className="glass-panel rounded-2xl p-8 lg:p-10 group hover:border-[#00F5FF]/20 transition-all">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Package size={20} style={{ color: product.color }} />
                  <span className="text-[9px] font-mono px-2 py-1 rounded"
                    style={{ color: product.color, background: `${product.color}15`, border: `1px solid ${product.color}40` }}>
                    {product.badge}
                  </span>
                </div>
                <h2 className="font-orbitron font-black text-2xl text-white group-hover:text-[#00F5FF] transition-colors">
                  {product.name}
                </h2>
                <p className="text-slate-400 font-space text-base leading-relaxed">{product.desc}</p>
                <div className="flex items-center gap-3 pt-2">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold btn-cyber"
                    style={{ background: product.color, color: product.color === "#22C55E" ? "#000" : "#fff" }}>
                    Learn More <ArrowRight size={14} />
                  </button>
                  <span className="text-xs text-slate-600 font-mono">{product.pricing}</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: product.color }}>
                  Key Features
                </p>
                {product.features.map((f, fi) => (
                  <div key={f} className="flex items-center gap-3 p-3 rounded-lg bg-[#0F172A] border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-600 w-4">{fi + 1}</span>
                    <span className="text-sm text-slate-300">{f}</span>
                    <Star size={10} className="ml-auto" style={{ color: product.color, opacity: 0.5 }} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="py-16 bg-[#060B18] border-t border-[#00F5FF]/10">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-orbitron font-black text-3xl text-white">Want to Collaborate?</h2>
          <p className="text-slate-400">Partner with BL4CKDOT to integrate our technology or co-develop solutions.</p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#00F5FF] text-black font-bold rounded-lg btn-cyber">
            Get In Touch <ExternalLink size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
