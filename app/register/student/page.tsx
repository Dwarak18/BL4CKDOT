import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { StudentForm } from "@/components/forms/StudentForm";

export default function RegisterStudentPage() {
  return (
    <div className="min-h-screen py-16 px-4 relative animate-slide-up">
      <div className="bd-orb-cyan" />
      <div className="bd-orb-purple" />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 font-mono text-xs tracking-[0.3em] uppercase text-neon-cyan mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            Student Portal
          </span>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bd-glass border border-neon-cyan/30 flex items-center justify-center">
              <GraduationCap size={24} className="text-neon-cyan" />
            </div>
            <h1 className="text-3xl font-bold text-white">Join the Apprenticeship</h1>
          </div>
          <p className="text-white/40 text-sm max-w-lg mx-auto leading-relaxed">
            Shape your future with real engineering projects. Apply to the BL4CKDOT apprenticeship and work on cutting-edge AI, IoT and cybersecurity systems.
          </p>
        </div>

        {/* Form card */}
        <div className="bd-glass p-8">
          <StudentForm />
        </div>

        <p className="text-center text-white/30 text-xs font-mono mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-neon-cyan hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
