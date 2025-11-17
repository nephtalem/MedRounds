"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

// Zod validation schema for login
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // Validate form with Zod
    const validationResult = loginSchema.safeParse({
      email,
      password,
    });

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((err: z.ZodIssue) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFieldErrors(errors);

      // Show first error in toast
      const firstError = validationResult.error.issues[0];
      toast.error(firstError.message);
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Signing in...");

    try {
      const result = await signIn(email, password, rememberMe);

      // Check if signIn returned an error
      if (result.error) {
        throw result.error;
      }

      toast.success("Welcome back!", { id: toastId });
      router.push("/dashboard");
    } catch (err) {
      const errorMessage = (err as Error).message || "Failed to sign in";
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-[#030712] dark:via-slate-900/50 dark:to-[#030712]">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48" />

        <div className="relative z-10 flex flex-col justify-between w-full max-w-lg">
          {/* Logo */}
          <Link href="/about" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
              <Activity className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                MedRounds
              </h1>
              <p className="text-sm text-white/80 font-medium">
                Medical Rounds
              </p>
            </div>
          </Link>

          {/* Content */}
          <div className="space-y-6 text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-semibold border border-white/20">
              <Sparkles className="h-4 w-4" />
              Welcome Back
            </div>
            <h2 className="text-5xl font-bold leading-tight">
              Continue Your
              <br />
              Medical Excellence
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Access your patient rounds, manage documentation, and streamline
              your daily workflow.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <div className="text-4xl font-bold">50%</div>
                <div className="text-sm text-white/80">Time Saved</div>
              </div>
              <div>
                <div className="text-4xl font-bold">100%</div>
                <div className="text-sm text-white/80">Secure</div>
              </div>
              <div>
                <div className="text-4xl font-bold">24/7</div>
                <div className="text-sm text-white/80">Access</div>
              </div>
            </div>
          </div>

          {/* Bottom Text */}
          <p className="text-sm text-white/70">
            © 2025 MedRounds. Built for healthcare professionals.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-3 group mb-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30">
                <Activity className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                  MedRounds
                </h1>
              </div>
            </Link>
          </div>

          {/* Form Card */}
          <Card className="border-0 shadow-2xl dark:bg-slate-900/60 dark:border-slate-800 dark:shadow-black/40">
            <CardHeader className="space-y-2 text-center pb-8">
              <CardTitle className="text-3xl font-bold dark:text-gray-100">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-base dark:text-gray-400">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Alert */}
                {error && (
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-900 dark:text-red-300">
                        Sign in failed
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="doctor@hospital.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) {
                          setFieldErrors({ ...fieldErrors, email: "" });
                        }
                      }}
                      required
                      disabled={loading}
                      className={`pl-10 h-12 border-2 focus:border-blue-500 dark:bg-slate-800/50 dark:border-slate-700 dark:text-gray-200 dark:placeholder:text-gray-500 ${
                        fieldErrors.email
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) {
                          setFieldErrors({ ...fieldErrors, password: "" });
                        }
                      }}
                      required
                      disabled={loading}
                      className={`pl-10 h-12 border-2 focus:border-blue-500 dark:bg-slate-800/50 dark:border-slate-700 dark:text-gray-200 dark:placeholder:text-gray-500 ${
                        fieldErrors.password
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />
                  </div>
                  {fieldErrors.password && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                    disabled={loading}
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm font-normal text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-base font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400 font-medium">
                      New to MedRounds?
                    </span>
                  </div>
                </div>

                {/* Sign Up Link */}
                <Link href="/auth/signup" className="block">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 text-base font-semibold border-2 border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-300 dark:bg-slate-800/50 dark:text-gray-200"
                  >
                    Create Account
                  </Button>
                </Link>
              </form>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="space-y-3">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              <Link
                href="/about"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Learn more about MedRounds
              </Link>
            </p>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              By signing in, you agree to our{" "}
              <a
                href="#"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
