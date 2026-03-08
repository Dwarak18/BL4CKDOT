"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { Github, Linkedin, ExternalLink } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

const members = [
  {
    name: "Dwarak",
    role: "Lead Architect",
    title: "Founder & System Architect",
    color: "#00F5FF",
    skills: ["System Design", "Full-stack Dev", "AI Integration", "Team Leadership"],
    bio: "Visionary behind BL4CKDOT. Designs the systems that others build. Specializes in turning research ideas into scalable architectures.",
    github: "#",
    linkedin: "#",
    initials: "DW",
  },
  {
    name: "Sarvesh",
    role: "AI Engineer",
    title: "AI Research Lead",
    color: "#7C3AED",
    skills: ["LLM Fine-tuning", "Python", "Edge AI", "GGUF"],
    bio: "Drives BL4CKDOT's AI research. Working on deploying micro-LLMs on constrained hardware and automating intelligence at the edge.",
    github: "#",
    linkedin: "#",
    initials: "SA",
  },
  {
    name: "Anto",
    role: "IoT Specialist",
    title: "Hardware & IoT Engineer",
    color: "#00F5FF",
    skills: ["Embedded C/C++", "Raspberry Pi", "MQTT", "Firmware Security"],
    bio: "The hardware whisperer. Turns microcontrollers into intelligent, secure IoT systems.",
    github: "#",
    linkedin: "#",
    initials: "AN",
  },
  {
    name: "Deepak",
    role: "Cybersecurity Analyst",
    title: "Security Research Lead",
    color: "#FF3B3B",
    skills: ["Penetration Testing", "VAPT", "Bug Bounty", "Threat Analysis"],
    bio: "Finds vulnerabilities across web apps, APIs, and hardware systems. Responsible for all VAPT and security research operations.",
    github: "#",
    linkedin: "#",
    initials: "DE",
  },
  {
    name: "Pranav Krishna",
    role: "Fullstack Developer",
    title: "Product Engineer",
    color: "#22C55E",
    skills: ["Next.js", "React", "Node.js", "PostgreSQL"],
    bio: "Ships polished, production-grade applications. The bridge between design and backend systems at BL4CKDOT.",
    github: "#",
    linkedin: "#",
    initials: "PK",
  },
  {
    name: "Goutham",
    role: "ML Researcher",
    title: "Machine Learning Engineer",
    color: "#7C3AED",
    skills: ["Python", "PyTorch", "Data Science", "Model Training"],
    bio: "Researches and trains the models that power BL4CKDOT's AI products. Passionate about making ML efficient and accessible.",
    github: "#",
    linkedin: "#",
    initials: "GO",
  },
  {
    name: "Kalaiarasan",
    role: "Embedded Systems",
    title: "Embedded & Hardware Engineer",
    color: "#00F5FF",
    skills: ["RTOS", "ARM Cortex", "Hardware Design", "PCB Layout"],
    bio: "Designs custom PCBs and writes firmware for BL4CKDOT's IoT devices. Bridges the gap between silicon and software.",
    github: "#",
    linkedin: "#",
    initials: "KA",
  },
  {
    name: "Dhanush",
    role: "Security Researcher",
    title: "Offensive Security Researcher",
    color: "#FF3B3B",
    skills: ["Binary Exploitation", "Reverse Engineering", "Malware Analysis", "CTF"],
    bio: "Deep security researcher specializing in low-level exploitation techniques and reverse engineering. Active CTF player and bug bounty hunter.",
    github: "#",
    linkedin: "#",
    initials: "DH",
  },
];

export default function TeamPage() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<typeof members[0] | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top, rgba(124,58,237,0.06) 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center max-w-2xl mx-auto">
            <span className="text-[#7C3AED] text-xs font-mono tracking-[0.3em] uppercase">The People</span>
            <h1 className="font-orbitron font-black text-4xl sm:text-6xl text-white mt-4 mb-6">
              BL4CKDOT <span className="gradient-text">Team</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              8 students. 4 engineering disciplines. One shared mission — building technology that matters.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, i) => {
            const isHovered = hovered === i;
            return (
              <motion.div
                key={member.name}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(member)}
                className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                style={{
                  background: isHovered
                    ? `linear-gradient(135deg, ${member.color}08, rgba(15,23,42,0.95))`
                    : "rgba(15,23,42,0.7)",
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${isHovered ? member.color + "50" : "rgba(255,255,255,0.06)"}`,
                  boxShadow: isHovered ? `0 0 30px ${member.color}20, 0 0 60px ${member.color}08` : "none",
                  transform: isHovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
                }}>
                {/* Holographic scan line on hover */}
                {isHovered && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px animate-[scan_2s_linear_infinite]"
                      style={{ background: `linear-gradient(90deg, transparent, ${member.color}60, transparent)` }} />
                    <div className="absolute inset-0 scan-overlay opacity-30" />
                  </div>
                )}

                <div className="p-6 space-y-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center font-orbitron font-black text-xl"
                      style={{
                        background: `linear-gradient(135deg, ${member.color}20, ${member.color}10)`,
                        border: `1px solid ${member.color}30`,
                        color: member.color,
                        boxShadow: isHovered ? `0 0 20px ${member.color}30` : "none",
                      }}>
                      {member.initials}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#060B18]"
                      style={{ background: "#22C55E", boxShadow: "0 0 6px #22C55E" }} />
                  </div>

                  <div>
                    <h3 className="font-orbitron font-bold text-white text-base">{member.name}</h3>
                    <p className="text-xs font-mono mt-0.5" style={{ color: member.color }}>{member.role}</p>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.slice(0, isHovered ? 4 : 2).map((skill) => (
                      <span key={skill} className="text-[9px] px-2 py-0.5 rounded font-mono"
                        style={{
                          color: member.color,
                          background: `${member.color}10`,
                          border: `1px solid ${member.color}25`,
                        }}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Hover bio */}
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? "auto" : 0 }}
                    className="text-slate-500 text-xs leading-relaxed overflow-hidden">
                    {member.bio}
                  </motion.p>

                  {/* Social links */}
                  {isHovered && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                      <a href={member.github} className="p-2 rounded-lg text-slate-500 hover:text-white transition-colors"
                        style={{ background: `${member.color}10`, border: `1px solid ${member.color}20` }}>
                        <Github size={14} />
                      </a>
                      <a href={member.linkedin} className="p-2 rounded-lg text-slate-500 hover:text-white transition-colors"
                        style={{ background: `${member.color}10`, border: `1px solid ${member.color}20` }}>
                        <Linkedin size={14} />
                      </a>
                      <button onClick={() => setSelected(member)}
                        className="p-2 rounded-lg text-slate-500 hover:text-white transition-colors ml-auto"
                        style={{ background: `${member.color}10`, border: `1px solid ${member.color}20` }}>
                        <ExternalLink size={14} />
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Team values */}
      <section className="py-24 bg-[#060B18]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-orbitron font-black text-3xl text-white">
            What Drives Us
          </motion.h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: "Build Real Things", desc: "No slide decks. No mock projects. We ship systems that work in production.", color: "#00F5FF" },
              { title: "Research-First", desc: "Every product starts with understanding the problem deeply, not jumping to solutions.", color: "#7C3AED" },
              { title: "Open by Default", desc: "We share our findings, code, and learnings with the community.", color: "#22C55E" },
            ].map((v, i) => (
              <motion.div key={v.title} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="glass-panel rounded-xl p-6 space-y-3 hover:border-[#00F5FF]/20 transition-all">
                <h3 className="font-orbitron font-bold text-base" style={{ color: v.color }}>{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Member detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelected(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-2xl p-8 max-w-md w-full"
            style={{ borderColor: `${selected.color}40`, boxShadow: `0 0 40px ${selected.color}15` }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-orbitron font-black text-2xl flex-shrink-0"
                style={{ background: `${selected.color}15`, border: `1px solid ${selected.color}30`, color: selected.color }}>
                {selected.initials}
              </div>
              <div>
                <h2 className="font-orbitron font-black text-xl text-white">{selected.name}</h2>
                <p className="text-sm font-mono mt-1" style={{ color: selected.color }}>{selected.title}</p>
                <div className="flex gap-2 mt-3">
                  <a href={selected.github} className="text-slate-500 hover:text-white transition-colors"><Github size={16} /></a>
                  <a href={selected.linkedin} className="text-slate-500 hover:text-white transition-colors"><Linkedin size={16} /></a>
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">{selected.bio}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {selected.skills.map((s) => (
                <span key={s} className="text-xs px-3 py-1 rounded-full font-mono"
                  style={{ color: selected.color, background: `${selected.color}10`, border: `1px solid ${selected.color}30` }}>
                  {s}
                </span>
              ))}
            </div>
            <button onClick={() => setSelected(null)}
              className="w-full py-3 border border-slate-700 text-slate-400 rounded-xl text-sm hover:border-slate-500 transition-colors">
              Close
            </button>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
