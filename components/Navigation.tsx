"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/",                  label: "Home" },
  { href: "/build-with-us",    label: "Build With Us" },
  { href: "/innovation-lab",   label: "Innovation Lab" },
  { href: "/projects",         label: "Projects" },
  { href: "/research",         label: "Research" },
  { href: "/timeline",         label: "Timeline" },
  { href: "/contact",          label: "Contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0F1E]/95 backdrop-blur-xl border-b border-[#22D3EE]/20 shadow-[0_0_30px_rgba(34,211,238,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group mr-14 shrink-0">
            <span className="font-orbitron font-black text-xl tracking-wider text-white">
              BL4CK
              <span className="text-[#22D3EE]">DOT</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE] group-hover:animate-ping" />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1">
            {navLinks.map((link) => {
              const hrefPath = link.href.split("#")[0] || "/";
              const active = hrefPath === "/" ? pathname === "/" : pathname.startsWith(hrefPath);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-1.5 text-[11px] font-medium tracking-widest uppercase transition-all duration-200 rounded whitespace-nowrap
                    ${active ? "text-[#22D3EE]" : "text-slate-400 hover:text-[#22D3EE]"}`}
                >
                  {active && (
                    <span className="absolute inset-0 rounded bg-[#22D3EE]/10 border border-[#22D3EE]/30" />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            <Link
              href="/build-with-us"
              className="btn-cyber px-4 py-2 text-xs font-semibold tracking-widest uppercase text-black bg-[#22D3EE] rounded hover:bg-[#22D3EE]/90 transition-all"
            >
              Build With Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-[#00F5FF] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0A0F1E]/98 backdrop-blur-xl border-b border-[#22D3EE]/20">
          <div className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 text-sm font-medium tracking-wider uppercase rounded transition-all
                  ${
                    pathname === link.href.split("#")[0]
                      ? "text-[#22D3EE] bg-[#22D3EE]/10 border border-[#22D3EE]/30"
                      : "text-slate-400 hover:text-[#22D3EE] hover:bg-[#22D3EE]/5"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/build-with-us"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-4 py-3 text-sm font-semibold text-black bg-[#22D3EE] rounded text-center"
            >
              Build With Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
