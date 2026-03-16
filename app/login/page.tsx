"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlowInput } from "@/components/ui/GlowInput";
import { GlowButton } from "@/components/ui/GlowButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]   = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Email and password are required"); return; }
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid credentials"); return; }
      localStorage.setItem("bl4ckdot_token", data.token);
      localStorage.setItem("bl4ckdot_user", JSON.stringify(data.user));
      const role: string = data.user.role;
      const redirects: Record<string, string> = {
        student: "/dashboard/student",
        innovator: "/dashboard/innovator",
        company: "/dashboard/company",
        admin: "/admin",
      };
      router.push(redirects[role] ?? "/");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative animate-slide-up">
      {/* Ambient orbs */}
      <div className="bd-orb-cyan" />
      <div className="bd-orb-purple" />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 font-mono text-xs tracking-[0.3em] uppercase text-neon-cyan mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            Access Portal
          </span>
          <h1 className="text-3xl font-bold text-white mt-2">Welcome Back</h1>
          <p className="text-white/40 text-sm mt-2">Sign in to your BL4CKDOT account</p>
        </div>

        <div className="bd-glass p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <GlowInput label="Email Address" accentColor="cyan" type="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" />
            <GlowInput label="Password" accentColor="cyan" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password" />

            {error && (
              <div className="bd-glass border border-red-400/30 p-3 rounded-xl">
                <p className="text-red-400 text-xs font-mono">{error}</p>
              </div>
            )}

            <GlowButton variant="cyan" type="submit" loading={loading} icon>
              Sign In
            </GlowButton>
          </form>

          <div className="mt-6 border-t border-white/5 pt-6 flex flex-col gap-2 text-center">
            <p className="text-white/40 text-xs font-mono">Don&apos;t have an account?</p>
            <div className="flex flex-wrap justify-center gap-3 text-xs font-mono">
              <Link href="/register/student" className="text-neon-cyan hover:underline">Student</Link>
              <span className="text-white/20">·</span>
              <Link href="/register/innovator" className="text-neon-purple hover:underline">Innovator</Link>
              <span className="text-white/20">·</span>
              <Link href="/register/company" className="text-neon-green hover:underline">Company</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
