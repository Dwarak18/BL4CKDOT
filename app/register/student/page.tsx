import Link from "next/link";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { StudentForm } from "@/components/forms/StudentForm";

export default function RegisterStudentPage() {
  return (
    <div className="min-h-screen py-16 px-4 relative animate-slide-up">
      <div className="bd-orb-cyan" />
      <div className="bd-orb-purple" />

      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-neon-cyan text-xs font-mono tracking-widest uppercase mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🎓</div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 font-mono text-xs tracking-[0.3em] uppercase text-neon-cyan mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            Apprenticeship
          </span>
          <h1 className="text-3xl font-bold text-white mt-3">Join as a Student</h1>
          <p className="text-white/40 text-sm max-w-lg mx-auto mt-2 leading-relaxed">
            Learners &amp; Builders — Build real systems.
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
