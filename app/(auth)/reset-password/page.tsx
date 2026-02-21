"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, Eye, EyeOff, CheckCircle2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

// password strength checker
const getStrength = (
  pwd: string,
): { score: number; label: string; color: string } => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score === 2) return { score, label: "Fair", color: "bg-amber-500" };
  if (score === 3) return { score, label: "Good", color: "bg-sky-500" };
  return { score, label: "Strong", color: "bg-emerald-500" };
};

const requirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  {
    label: "One special character",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
];

// ── Two modes:
// 1. isFirstLogin=true  → came from login redirect, just update password + profile flag
// 2. isFirstLogin=false → came from email reset link, use supabase session from URL

interface ResetPasswordPageProps {
  isFirstLogin?: boolean;
}

export default function ResetPasswordPage({
  isFirstLogin = false,
}: ResetPasswordPageProps) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(isFirstLogin);

  const strength = getStrength(newPassword);

  // For email reset links — supabase sets session from URL hash
 useEffect(() => {
  if (isFirstLogin) return;

  const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
    if (event === "PASSWORD_RECOVERY") {
      setSessionReady(true);
    }
  });

  return () => subscription.unsubscribe();
}, [isFirstLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (strength.score < 2) {
      setError("Password is too weak. Please make it stronger.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Update password via supabase
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    // If first login — update is_first_login flag in profiles table
    if (isFirstLogin) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ is_first_login: false } as never)
          .eq("id", user.id);
      }
    }

    setLoading(false);
    setSuccess(true);

    // redirect after 2 seconds
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  // ── Not ready yet (waiting for email link session) ──
  if (!sessionReady) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4 font-[family-name:var(--font-geist-sans)]">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // ── Success State ──
  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4 font-[family-name:var(--font-geist-sans)]">
        <div className="absolute w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="w-full max-w-md relative">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={26} className="text-emerald-400" />
            </div>
            <h1 className="text-white text-xl font-semibold mb-2">
              Password Updated!
            </h1>
            <p className="text-white/40 text-sm mb-6">
              Your password has been changed successfully. Redirecting you to
              the dashboard...
            </p>
            <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full animate-[shrink_2s_linear_forwards]"
                style={{ animation: "progress 2s linear forwards" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ──
  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="w-full max-w-md relative">
        {/* Back link — only show for non first login */}
        {!isFirstLogin && (
          <Link
            href="/login"
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors mb-6 w-fit"
          >
            <ArrowLeft size={14} />
            Back to login
          </Link>
        )}

        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
            <KeyRound size={20} className="text-emerald-400" />
          </div>

          <h1 className="text-white text-xl font-semibold mb-1">
            {isFirstLogin ? "Set your password" : "Reset your password"}
          </h1>
          <p className="text-white/40 text-sm mb-6 leading-relaxed">
            {isFirstLogin
              ? "Welcome! Please set a new password to secure your account."
              : "Create a new password for your account."}
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Strength bar */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= strength.score
                            ? strength.color
                            : "bg-white/[0.06]"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs ${
                      strength.score <= 1
                        ? "text-red-400"
                        : strength.score === 2
                          ? "text-amber-400"
                          : strength.score === 3
                            ? "text-sky-400"
                            : "text-emerald-400"
                    }`}
                  >
                    {strength.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                  }}
                  className={`w-full bg-white/[0.04] border rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors ${
                    confirmPassword && confirmPassword !== newPassword
                      ? "border-red-500/50 focus:border-red-500/50"
                      : "border-white/[0.08] focus:border-emerald-500/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-red-400 text-xs mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Requirements checklist */}
            {newPassword && (
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 space-y-2">
                {requirements.map((req) => {
                  const passed = req.test(newPassword);
                  return (
                    <div key={req.label} className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          passed
                            ? "bg-emerald-500/20 border border-emerald-500/30"
                            : "bg-white/[0.04] border border-white/[0.08]"
                        }`}
                      >
                        {passed && (
                          <CheckCircle2
                            size={10}
                            className="text-emerald-400"
                          />
                        )}
                      </div>
                      <span
                        className={`text-xs transition-colors ${passed ? "text-white/60" : "text-white/25"}`}
                      >
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
            >
              {loading
                ? "Updating..."
                : isFirstLogin
                  ? "Set Password & Continue"
                  : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

