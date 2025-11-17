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
  User,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

// Zod validation schema
const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters")
      .regex(
        /^[a-zA-Z\s.'-]+$/,
        "Name can only contain letters, spaces, and . ' -"
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be less than 100 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // Validate form with Zod
    const validationResult = signupSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
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
    const toastId = toast.loading("Creating your account...");

    try {
      const result = await signUp(email, password, fullName, rememberMe);

      // Check if signUp returned an error
      if (result.error) {
        throw result.error;
      }

      setSuccess(true);
      toast.success("Account created successfully! Redirecting...", {
        id: toastId,
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      const errorMessage = (err as Error).message || "Failed to create account";
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
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
              Start Your Journey
            </div>
            <h2 className="text-5xl font-bold leading-tight">
              Transform Your
              <br />
              Medical Rounds
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join healthcare professionals who are modernizing their patient
              documentation workflow.
            </p>

            {/* Benefits */}
            <div className="space-y-4 pt-8">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-lg">
                    Save 50% of Your Time
                  </div>
                  <div className="text-white/80">
                    Focus on patients, not paperwork
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-lg">HIPAA Compliant</div>
                  <div className="text-white/80">
                    Your data is secure and private
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-lg">Free Forever</div>
                  <div className="text-white/80">No credit card required</div>
                </div>
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
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  MedRounds
                </h1>
              </div>
            </Link>
          </div>

          {/* Success Message */}
          {success && (
            <div className="p-6 rounded-xl bg-green-50 border-2 border-green-200 flex items-start gap-3 animate-fade-in">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-green-900">
                  Account created successfully!
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Redirecting to your dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Form Card */}
          <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-2 text-center pb-8">
              <CardTitle className="text-3xl font-bold">
                Create Account
              </CardTitle>
              <CardDescription className="text-base">
                Start managing your medical rounds today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error Alert */}
                {error && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-900">
                        Sign up failed
                      </p>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                )}

                {/* Full Name Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Dr. John Smith"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (fieldErrors.fullName) {
                          setFieldErrors({ ...fieldErrors, fullName: "" });
                        }
                      }}
                      required
                      disabled={loading || success}
                      className={`pl-10 h-12 border-2 focus:border-blue-500 ${
                        fieldErrors.fullName
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />
                  </div>
                  {fieldErrors.fullName && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {fieldErrors.fullName}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                      disabled={loading || success}
                      className={`pl-10 h-12 border-2 focus:border-blue-500 ${
                        fieldErrors.email
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                      disabled={loading || success}
                      className={`pl-10 h-12 border-2 focus:border-blue-500 ${
                        fieldErrors.password
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />
                  </div>
                  {fieldErrors.password ? (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {fieldErrors.password}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Must be at least 6 characters
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (fieldErrors.confirmPassword) {
                          setFieldErrors({
                            ...fieldErrors,
                            confirmPassword: "",
                          });
                        }
                      }}
                      required
                      disabled={loading || success}
                      className={`pl-10 h-12 border-2 focus:border-blue-500 ${
                        fieldErrors.confirmPassword
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {fieldErrors.confirmPassword}
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
                    disabled={loading || success}
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm font-normal text-gray-700 cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || success}
                  className="w-full h-12 text-base font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Account created!
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                      Already have an account?
                    </span>
                  </div>
                </div>

                {/* Sign In Link */}
                <Link href="/auth/login" className="block">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 text-base font-semibold border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </Link>
              </form>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="space-y-3">
            <p className="text-center text-sm text-gray-600">
              <Link
                href="/about"
                className="font-medium text-blue-600 hover:underline"
              >
                Learn more about MedRounds
              </Link>
            </p>
            <p className="text-center text-sm text-gray-600">
              By creating an account, you agree to our{" "}
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
