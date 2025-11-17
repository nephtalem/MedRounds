"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ClipboardList,
  Users,
  FileText,
  BarChart3,
  Clock,
  Shield,
  Activity,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  TrendingUp,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-[#030712] dark:via-slate-900/50 dark:to-[#030712]">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="container mx-auto flex h-[97px] items-center justify-between px-8">
          <Link href="/about" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
              <Activity className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                MedRounds
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Medical Rounds
              </p>
            </div>
          </Link>
          <nav className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200"
              asChild
            >
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 gap-2"
              asChild
            >
              <Link href="/auth/signup">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold border border-blue-200 dark:border-blue-800">
              <Sparkles className="h-4 w-4" />
              Modern Healthcare Management
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-tight">
              Streamline Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Medical Rounds
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The modern web application for medical practitioners to
              efficiently manage, document, and print daily patient rounds.
              <span className="block mt-2 font-semibold text-gray-900 dark:text-gray-100">
                Say goodbye to Excel spreadsheets.
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="h-14 px-8 text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 gap-2 bg-blue-600 hover:bg-blue-700"
                asChild
              >
                <Link href="/auth/signup" className="flex items-center">
                  <Zap className="h-5 w-5" />
                  Start Free Today
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg border-2 border-gray-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 gap-2 dark:bg-slate-800/50 dark:text-gray-200"
                asChild
              >
                <Link href="/auth/login" className="flex items-center">
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span>HIPAA compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span>Free forever</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-sm font-semibold border border-cyan-200 dark:border-cyan-800 mb-6">
            <TrendingUp className="h-4 w-4" />
            Everything You Need
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900 dark:text-gray-100">
            Built for Medical Professionals
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Designed specifically for general practitioners with features that
            matter most during daily rounds
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {/* Feature Cards */}
          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-900/40 dark:border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500 dark:bg-blue-600 shadow-lg shadow-blue-500/30 mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>
              <CardTitle className="text-xl dark:text-gray-100">Patient Management</CardTitle>
              <CardDescription className="text-base dark:text-gray-400">
                Quick add, edit, and organize patient information with an
                intuitive interface designed for speed
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-950/20 dark:to-slate-900/40 dark:border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500 dark:bg-cyan-600 shadow-lg shadow-cyan-500/30 mb-4 group-hover:scale-110 transition-transform">
                <FileText className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>
              <CardTitle className="text-xl dark:text-gray-100">Professional Printing</CardTitle>
              <CardDescription className="text-base dark:text-gray-400">
                Generate clean, formatted printouts optimized for use during
                rounds. One-click printing
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-slate-900/40 dark:border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 dark:bg-green-500/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500 dark:bg-green-600 shadow-lg shadow-green-500/30 mb-4 group-hover:scale-110 transition-transform">
                <Clock className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>
              <CardTitle className="text-xl dark:text-gray-100">Save Time</CardTitle>
              <CardDescription className="text-base dark:text-gray-400">
                Reduce documentation time by up to 50%. Focus more on patient
                care, less on paperwork
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900/40 dark:border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 dark:bg-purple-500/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500 dark:bg-purple-600 shadow-lg shadow-purple-500/30 mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>
              <CardTitle className="text-xl dark:text-gray-100">Search & Filter</CardTitle>
              <CardDescription className="text-base dark:text-gray-400">
                Instantly find patients, sort by any field. Smart filtering and
                search built-in
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-slate-900/40 dark:border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 dark:bg-orange-500/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500 dark:bg-orange-600 shadow-lg shadow-orange-500/30 mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>
              <CardTitle className="text-xl dark:text-gray-100">Secure & Private</CardTitle>
              <CardDescription className="text-base dark:text-gray-400">
                Your patient data is secure with modern authentication and
                privacy-first design
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-pink-50 to-white dark:from-pink-950/20 dark:to-slate-900/40 dark:border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 dark:bg-pink-500/10 rounded-full -mr-16 -mt-16" />
            <CardHeader className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-pink-500 dark:bg-pink-600 shadow-lg shadow-pink-500/30 mb-4 group-hover:scale-110 transition-transform">
                <ClipboardList
                  className="h-7 w-7 text-white"
                  strokeWidth={2.5}
                />
              </div>
              <CardTitle className="text-xl dark:text-gray-100">Round History</CardTitle>
              <CardDescription className="text-base dark:text-gray-400">
                Access your completed rounds anytime. Full history with search
                and export capabilities
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 p-12 md:p-20 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48" />
          <div className="relative text-center space-y-8 text-white">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Modernize Your Rounds?
            </h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Join medical practitioners who are saving time and improving their
              documentation workflow
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="h-14 px-8 text-lg bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl gap-2"
                asChild
              >
                <Link href="/auth/signup" className="flex items-center">
                  Start Free Today
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="h-14 px-8 text-lg bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white hover:text-blue-600 hover:border-white hover:scale-105 transition-all duration-300 gap-2"
                asChild
              >
                <Link href="/auth/login" className="flex items-center">
                  Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-100">MedRounds</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Built for healthcare professionals
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 MedRounds. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
