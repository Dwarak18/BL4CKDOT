import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, Terminal } from "lucide-react";

const links = {
  platform: [
    { label: "Innovation Lab", href: "/innovation-lab" },
    { label: "Cybersecurity", href: "/cybersecurity" },
    { label: "Projects", href: "/projects" },
    { label: "Research", href: "/research" },
  ],
  company: [
    { label: "About", href: "/#about" },
    { label: "Team", href: "/team" },
    { label: "Products", href: "/products" },
    { label: "Contact", href: "/contact" },
  ],
  programs: [
    { label: "Apprenticeship", href: "/apprenticeship" },
    { label: "Hacker Lab", href: "/apprenticeship#lab" },
    { label: "Research Vault", href: "/root" },
    { label: "Join Now", href: "/apprenticeship#apply" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative z-10 mt-32 border-t border-[#00F5FF]/10 bg-[#060B18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-orbitron font-black text-2xl text-white">
                BL4CK<span className="text-[#00F5FF]">DOT</span>
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F5FF]" style={{ boxShadow: "0 0 8px #00F5FF" }} />
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Engineering the Future of Intelligent Systems. A student-driven innovation company at the frontier of AI, IoT, and Cybersecurity.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://github.com" className="text-slate-600 hover:text-[#00F5FF] transition-colors" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com" className="text-slate-600 hover:text-[#00F5FF] transition-colors" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://twitter.com" className="text-slate-600 hover:text-[#00F5FF] transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="mailto:contact@bl4ckdot.dev" className="text-slate-600 hover:text-[#00F5FF] transition-colors" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-orbitron text-xs tracking-widest text-[#00F5FF] uppercase mb-4">Platform</h3>
            <ul className="space-y-2">
              {links.platform.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-slate-500 hover:text-[#00F5FF] text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-[#00F5FF]/30 group-hover:bg-[#00F5FF] transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-orbitron text-xs tracking-widest text-[#00F5FF] uppercase mb-4">Company</h3>
            <ul className="space-y-2">
              {links.company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-slate-500 hover:text-[#00F5FF] text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-[#00F5FF]/30 group-hover:bg-[#00F5FF] transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-orbitron text-xs tracking-widest text-[#00F5FF] uppercase mb-4">Programs</h3>
            <ul className="space-y-2">
              {links.programs.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-slate-500 hover:text-[#00F5FF] text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-[#00F5FF]/30 group-hover:bg-[#00F5FF] transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#00F5FF]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © 2026 BL4CKDOT. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-700">
            <Terminal size={12} className="text-[#00F5FF]/40" />
            <span>Press CTRL+B for terminal mode</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-slate-700">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
