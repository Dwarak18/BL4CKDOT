import Link from "next/link";
import { Building2 } from "lucide-react";
import { CompanyForm } from "@/components/forms/CompanyForm";

export default function RegisterCompanyPage() {
  return (
    <div className="min-h-screen py-16 px-4 relative animate-slide-up">
      <div className="bd-orb-green" />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-green/30 bg-neon-green/5 font-mono text-xs tracking-[0.3em] uppercase text-neon-green mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            Company Portal
          </span>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bd-glass border border-neon-green/30 flex items-center justify-center">
              <Building2 size={24} className="text-neon-green" />
            </div>
            <h1 className="text-3xl font-bold text-white">Request Collaboration</h1>
          </div>
          <p className="text-white/40 text-sm max-w-lg mx-auto leading-relaxed">
            Build advanced solutions together. Partner with BL4CKDOT engineering teams to research, prototype, and deploy intelligent systems.
          </p>
        </div>

        <div className="bd-glass p-8">
          <CompanyForm />
        </div>

        <p className="text-center text-white/30 text-xs font-mono mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-neon-green hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
