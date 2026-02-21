"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      },
    );

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  };

  // ── Success State ──
  if (sent) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4 font-[family-name:var(--font-geist-sans)]">
        <div className="absolute w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="w-full max-w-md relative">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 text-center">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={26} className="text-emerald-400" />
            </div>

            <h1 className="text-white text-xl font-semibold mb-2">
              Check your email
            </h1>
            <p className="text-white/40 text-sm mb-1 leading-relaxed">
              We sent a password reset link to
            </p>
            <p className="text-emerald-400 text-sm font-medium mb-6">{email}</p>

            {/* Steps */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 text-left space-y-3 mb-6">
              {[
                "Open the email we sent you",
                "Click the reset password link",
                "Create your new password",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <span className="text-emerald-400 text-xs font-bold">
                      {i + 1}
                    </span>
                  </div>
                  <span className="text-white/50 text-xs">{step}</span>
                </div>
              ))}
            </div>

            <p className="text-white/25 text-xs mb-5">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                onClick={() => setSent(false)}
                className="text-emerald-400/70 hover:text-emerald-400 transition-colors"
              >
                try again
              </button>
            </p>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft size={14} />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Form State ──
  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="w-full max-w-md relative">
        {/* Back to login */}
        <Link
          href="/login"
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors mb-6 w-fit"
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>

        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
            <Mail size={20} className="text-emerald-400" />
          </div>

          <h1 className="text-white text-xl font-semibold mb-1">
            Forgot password?
          </h1>
          <p className="text-white/40 text-sm mb-6 leading-relaxed">
            No worries. Enter your email and we&apos;ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
              {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
