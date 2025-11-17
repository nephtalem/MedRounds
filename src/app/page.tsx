"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // If user is logged in, go to dashboard
        router.push("/dashboard");
      } else {
        // If user is not logged in, go to login
        router.push("/auth/login");
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-[#030712] dark:via-slate-900/50 dark:to-[#030712]">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
        <p className="text-gray-600 font-medium">Loading MedRounds...</p>
        </div>
    </div>
  );
}
