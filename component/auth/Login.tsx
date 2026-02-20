"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/component/ui/Card";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import Link from "next/link";
import { useState } from "react";
import { validateSignIn } from "@/lib/validate";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

interface SignInErrors {
  email?: string;
  password?: string;
}

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<SignInErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // useUser hook
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

    // fetch user profile after login
    const { data: user } = await refetchUser();

    if (!user) {
      setServerError("Profile not found. Contact support.");
      setLoading(false);
      return;
    }

    // check if first login → force password reset
    if (user.is_first_login) {
      router.push("/reset-password");
      return;
    }

    // check role and redirect accordingly
    if (user.role === "super_admin") {
      router.push("/dashboard");
    } else {
      // not super_admin → sign out and block
      await supabase.auth.signOut();
      setServerError("You are not authorized to access this portal.");
      setLoading(false);
      return;
    }

    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Chama Management</CardTitle>
          <CardDescription>
            Sign in to manage your investment group
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                  setServerError(null);
                  setServerError(null);
                }}
                required
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2 mt-4 mb-4">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
              <div className="mt-3 w-full flex justify-start text-sm">
                <Link
                  href="/forgot-password"
                  className="text-[#F44336] font-light"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {serverError && (
              <p className="text-sm text-red-500 mb-4">{serverError}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
