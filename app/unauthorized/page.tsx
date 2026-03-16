"use client";
import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-slide-up">
      <div className="bd-orb-orange fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]
        bg-[radial-gradient(circle,rgba(255,107,0,0.06)_0%,transparent_70%)] rounded-full pointer-events-none" />

      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bd-glass border border-neon-orange/30 flex items-center justify-center mx-auto mb-6">
          <ShieldX size={36} className="text-neon-orange" />
        </div>
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon-orange mb-3">403 — Forbidden</p>
        <h1 className="text-3xl font-bold text-white mb-3">Access Denied</h1>
        <p className="text-white/40 text-sm mb-8 leading-relaxed">
          You don&apos;t have permission to access this page. Please log in with the correct account type.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="neon-btn-orange px-6 py-3 rounded-xl text-sm font-mono tracking-wide">
            Sign In
          </Link>
          <Link href="/" className="bg-white/[0.04] border border-white/10 px-6 py-3 rounded-xl text-sm font-mono tracking-wide text-white/60 hover:text-white transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
