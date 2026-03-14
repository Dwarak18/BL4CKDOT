"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle, BookOpen, Code2, Shield, Brain, Cpu, ChevronDown } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

const tracks = [
  {
    id: "cyber",
    icon: Shield,
    title: "Cybersecurity Engineering",
    color: "#FF3B3B",
    duration: "12 weeks",
    desc: "Learn offensive and defensive security, penetration testing, vulnerability research, and secure software development.",
    modules: ["Web Security Fundamentals", "Network Penetration Testing", "OWASP Top 10 Labs", "Malware Analysis", "CTF Challenges", "Security Tool Development"],
  },
  {
    id: "ai",
    icon: Brain,
    title: "AI Development",
    color: "#7C3AED",
    duration: "12 weeks",
    desc: "Build AI systems from fine-tuning LLMs to deploying edge inference engines. Research-driven, hands-on track.",
    modules: ["Python & ML Foundations", "LLM Fine-tuning", "GGUF Quantization", "FastAPI AI Services", "Edge AI Deployment", "micro-LLM Research"],
  },
  {
    id: "iot",
    icon: Cpu,
    title: "IoT Engineering",
    color: "#00F5FF",
    duration: "10 weeks",
    desc: "Design, build, and secure IoT systems from microcontroller firmware to cloud-connected device networks.",
    modules: ["Embedded C/C++", "RTOS & Protocols", "MQTT & Edge Computing", "Firmware Security", "Hardware Prototyping", "IoT Network Design"],
  },
  {
    id: "fullstack",
    icon: Code2,
    title: "Fullstack Development",
    color: "#22C55E",
    duration: "10 weeks",
    desc: "Ship production-grade web applications using the modern stack. Real projects, real code reviews, real deployment.",
    modules: ["React & Next.js", "Node.js & REST APIs", "MongoDB & PostgreSQL", "Authentication Systems", "Cloud Deployment", "DevOps Fundamentals"],
  },
];

const steps = [
  { num: "01", title: "Apply", desc: "Submit your application with background and motivation. No experience required — just passion." },
  { num: "02", title: "Skill Test", desc: "A short technical assessment to understand your current level. Used to customize your learning path." },
  { num: "03", title: "Training", desc: "Intensive track-specific training with video lessons, reading materials, practical labs, and assignments." },
  { num: "04", title: "Apprenticeship", desc: "Work on real BL4CKDOT projects with mentorship. Build systems that matter. Leave with a portfolio." },
];

const faqs = [
  { q: "Do I need experience to apply?", a: "No. We accept passionate students at all levels. The skill test helps us understand where you are, not disqualify you." },
  { q: "Is this paid?", a: "The training phase is free. Top performers in the apprenticeship phase receive stipends or pre-placement offers." },
  { q: "How much time is required?", a: "15-20 hours per week during training. Apprenticeship is project-based and more flexible." },
  { q: "What do I get at the end?", a: "A verified BL4CKDOT certification, a real project in your portfolio, GitHub contributions, and mentorship network." },
  { q: "Can I apply to multiple tracks?", a: "You can apply to one primary track. After completing it, you can crossover to another." },
];

export default function ApprenticeshipPage() {
  const [selectedTrack, setSelectedTrack] = useState(tracks[0]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", track: "cybersecurity", resume_link: "", motivation: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trackMap: Record<string, string> = {
      cyber: "cybersecurity",
      ai: "AI",
      iot: "IoT",
      fullstack: "fullstack",
      cybersecurity: "cybersecurity",
    };

    const res = await fetch("/api/apprenticeship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        track: trackMap[form.track] || "cybersecurity",
        resume_link: form.resume_link,
        motivation: form.motivation,
      }),
    });

    if (!res.ok) {
      alert("Unable to submit application right now.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top, rgba(34,197,94,0.04) 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-3xl">
            <span className="text-[#22C55E] text-xs font-mono tracking-[0.3em] uppercase">BL4CKDOT / Apprenticeship</span>
            <h1 className="font-orbitron font-black text-4xl sm:text-6xl text-white mt-4 mb-6 leading-tight">
              Talent<br /><span style={{ color: "#22C55E" }}>Forge</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              A structured apprenticeship program turning ambitious students into real engineers. Train on cutting-edge technology, work on live projects, and join BL4CKDOT&apos;s innovation team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-[#060B18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="font-orbitron font-black text-3xl text-white">The Journey</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((step, i) => (
              <motion.div key={step.num} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass-panel rounded-xl p-6 space-y-4 relative">
                <div className="font-orbitron text-4xl font-black text-[#22C55E]/20">{step.num}</div>
                <h3 className="font-orbitron font-bold text-white">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight size={16} className="hidden lg:block absolute -right-3 top-8 text-[#22C55E]/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-12">
          <span className="text-[#00F5FF] text-xs font-mono tracking-[0.3em] uppercase">Choose Your Path</span>
          <h2 className="font-orbitron font-black text-3xl text-white mt-3">Training Tracks</h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Track selector */}
          <div className="space-y-3">
            {tracks.map((track) => {
              const Icon = track.icon;
              const active = selectedTrack.id === track.id;
              return (
                <button key={track.id} onClick={() => setSelectedTrack(track)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left ${active ? "bg-[#0F172A]" : "hover:bg-[#0F172A]/50"}`}
                  style={{ border: `1px solid ${active ? track.color + "40" : "rgba(255,255,255,0.08)"}` }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${track.color}15`, border: `1px solid ${track.color}30` }}>
                    <Icon size={18} style={{ color: track.color }} />
                  </div>
                  <div>
                    <p className="font-space font-semibold text-white text-sm">{track.title}</p>
                    <p className="text-[10px] text-slate-600 font-mono mt-0.5">{track.duration}</p>
                  </div>
                  {active && <ArrowRight size={14} className="ml-auto" style={{ color: track.color }} />}
                </button>
              );
            })}
          </div>

          {/* Track detail */}
          <div className="lg:col-span-2">
            <motion.div key={selectedTrack.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-xl p-8 h-full"
              style={{ borderColor: `${selectedTrack.color}30` }}>
              <div className="flex items-center gap-3 mb-4">
                <selectedTrack.icon size={24} style={{ color: selectedTrack.color }} />
                <h3 className="font-orbitron font-bold text-xl text-white">{selectedTrack.title}</h3>
                <span className="ml-auto text-xs font-mono text-slate-600">{selectedTrack.duration}</span>
              </div>
              <p className="text-slate-400 mb-6">{selectedTrack.desc}</p>
              <h4 className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: selectedTrack.color }}>
                Curriculum
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {selectedTrack.modules.map((mod, i) => (
                  <div key={mod} className="flex items-center gap-3 p-3 rounded-lg bg-[#0F172A] border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-600 w-5">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm text-slate-300">{mod}</span>
                    <CheckCircle size={14} className="ml-auto text-[#22C55E]/50" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Application */}
      <section id="apply" className="py-24 bg-[#060B18]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-10">
            <span className="text-[#22C55E] text-xs font-mono tracking-[0.3em] uppercase">Begin Your Journey</span>
            <h2 className="font-orbitron font-black text-3xl text-white mt-3">Apply Now</h2>
          </motion.div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-panel rounded-xl p-10 text-center space-y-4">
              <CheckCircle size={48} className="text-[#22C55E] mx-auto" />
              <h3 className="font-orbitron font-bold text-xl text-white">Application Received</h3>
              <p className="text-slate-400">We&apos;ll review your application and send a skill assessment within 48 hours.</p>
              <p className="text-xs text-slate-600 font-mono">BL4CKDOT Operations Team</p>
            </motion.div>
          ) : (
            <motion.form variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="glass-panel rounded-xl p-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2 block">Full Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required placeholder="Your name"
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-[#22C55E]/50 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2 block">Email</label>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required type="email" placeholder="your@email.com"
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-[#22C55E]/50 transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2 block">Track</label>
                <select value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value })}
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#22C55E]/50 transition-colors">
                  <option value="cyber">Cybersecurity Engineering</option>
                  <option value="ai">AI Development</option>
                  <option value="iot">IoT Engineering</option>
                  <option value="fullstack">Fullstack Development</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2 block">Resume Link</label>
                <input value={form.resume_link} onChange={(e) => setForm({ ...form, resume_link: e.target.value })}
                  required placeholder="https://drive.google.com/..."
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-[#22C55E]/50 transition-colors" />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2 block">Why BL4CKDOT?</label>
                <textarea value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                  required rows={4} placeholder="Tell us about yourself and what you want to build..."
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-[#22C55E]/50 transition-colors resize-none" />
              </div>

              <button type="submit"
                className="w-full py-4 bg-[#22C55E] text-black font-bold rounded-lg text-sm tracking-wide btn-cyber flex items-center justify-center gap-2">
                <BookOpen size={16} /> Submit Application
              </button>
            </motion.form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="font-orbitron font-black text-3xl text-white">Frequently Asked</h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 glass-panel rounded-xl text-left hover:border-[#00F5FF]/20 transition-all">
                <span className="font-space font-semibold text-white text-sm">{faq.q}</span>
                <ChevronDown size={16} className={`text-slate-500 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  className="px-5 py-4 text-slate-400 text-sm leading-relaxed">
                  {faq.a}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
