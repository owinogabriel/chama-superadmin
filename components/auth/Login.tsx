"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import Link from "next/link";
import { useState } from "react";
import { validateSignIn } from "@/lib/validate";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { CheckCircle2 } from "lucide-react";

interface SignInErrors {
  email?: string;
  password?: string;
}

const Toast = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => (
  <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-white/[0.05] border border-emerald-500/20 backdrop-blur-sm text-white px-4 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2">
    <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
      <CheckCircle2 size={13} className="text-emerald-400" />
    </div>
    <p className="text-sm text-white/80">{message}</p>
    <button
      onClick={onClose}
      className="text-white/25 hover:text-white transition-colors ml-2 text-xs"
    >
      ✕
    </button>
  </div>
);

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<SignInErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const { refetch: refetchUser } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const newErrors = validateSignIn({ email, password });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }

    const { data: user } = await refetchUser();

    if (!user) {
      setServerError("Profile not found. Contact support.");
      setLoading(false);
      return;
    }

    if (user.is_first_login) {
    if (user.is_first_login) {
      setLoading(false);
      router.push("/reset-password");
      return;
    }

    if (user.role === "super_admin") {
      setLoading(false);
      router.push("/dashboard");
      return;
    }

    await supabase.auth.signOut();
    setServerError("You are not authorized to access this portal.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0c10] p-4">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      {/* subtle background glow */}
      <div className="absolute w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md relative">
        <CardHeader className="text-center pb-2">
          {/* Logo mark */}
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-emerald-400 font-bold text-lg">C</span>
          </div>
          <CardTitle className="text-white text-xl">
            Chama Admin Portal
          </CardTitle>
          <CardDescription className="text-white/40 text-sm">
            Sign in to manage your platform
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} noValidate className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-white/50 text-xs">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                  setServerError(null);
                }}
                required
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-white/50 text-xs">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                    setServerError(null);
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password}</p>
              )}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-emerald-400/70 hover:text-emerald-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Server error */}
            {serverError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-sm text-red-400">{serverError}</p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-70 text-white font-medium rounded-xl transition-colors"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
