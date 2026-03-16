import Link from "next/link";
import { Lightbulb } from "lucide-react";
import { InnovatorForm } from "@/components/forms/InnovatorForm";

export default function RegisterInnovatorPage() {
  return (
    <div className="min-h-screen py-16 px-4 relative animate-slide-up">
      <div className="bd-orb-purple" />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-purple/30 bg-neon-purple/5 font-mono text-xs tracking-[0.3em] uppercase text-neon-purple mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
            Innovator Portal
          </span>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bd-glass border border-neon-purple/30 flex items-center justify-center">
              <Lightbulb size={24} className="text-neon-purple" />
            </div>
            <h1 className="text-3xl font-bold text-white">Submit Your Concept</h1>
          </div>
          <p className="text-white/40 text-sm max-w-lg mx-auto leading-relaxed">
            Transform your concept into reality. Connect with engineering teams to prototype, validate, and launch your innovation.
          </p>
        </div>

        <div className="bd-glass p-8">
          <InnovatorForm />
        </div>

        <p className="text-center text-white/30 text-xs font-mono mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-neon-purple hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
