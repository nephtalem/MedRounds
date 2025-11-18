"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ModernSidebar } from "@/components/modern-sidebar";
import { ModernHeader } from "@/components/modern-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Calendar,
  Save,
  Loader2,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

function ProfileContent() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only run when user ID changes (i.e., different user logs in)

  async function handleUpdateProfile() {
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-[#030712] dark:via-slate-900/50 dark:to-[#030712]">
      {/* Modern Sidebar */}
      <ModernSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Modern Header */}
        <ModernHeader
          title="Profile"
          subtitle="Manage your personal information and preferences"
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-modern">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Overview Card */}
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48" />
              <CardContent className="p-8 relative">
                <div className="flex items-center gap-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-2xl">
                    <span className="text-4xl font-bold text-white">
                      {user?.user_metadata?.full_name?.[0]?.toUpperCase() ||
                        user?.email?.[0]?.toUpperCase() ||
                        "U"}
                    </span>
                  </div>
                  <div className="flex-1 text-white">
                    <h2 className="text-3xl font-bold mb-2">
                      {user?.user_metadata?.full_name || "User"}
                    </h2>
                    <p className="text-white/90 text-lg mb-3">{user?.email}</p>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {joinedDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Profile Form */}
            <Card className="border-0 shadow-lg dark:bg-slate-900/40 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2 dark:text-gray-100">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-sm dark:text-gray-400">
                  Update your profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {success && (
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-medium text-green-900 dark:text-green-300">
                      Profile updated successfully!
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-semibold dark:text-gray-300">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. John Smith"
                        disabled={loading}
                        className="pl-10 h-12 border-2 focus:border-blue-500 dark:bg-slate-800/50 dark:border-slate-700 dark:text-gray-200 dark:placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold dark:text-gray-300">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="pl-10 h-12 border-2 bg-gray-50 text-gray-500 dark:bg-slate-800/30 dark:border-slate-700 dark:text-gray-400"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setFullName(user?.user_metadata?.full_name || "")}
                    disabled={loading}
                    className="border-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateProfile}
                    disabled={loading || !fullName.trim()}
                    className="gap-2 shadow-lg shadow-blue-500/30"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card className="border-0 shadow-lg dark:bg-slate-900/40 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2 dark:text-gray-100">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Account Information
                </CardTitle>
                <CardDescription className="text-sm dark:text-gray-400">
                  Your account details and statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-slate-700">
                    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Account Status</dt>
                    <dd>
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-semibold">
                        <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-500"></div>
                        Active
                      </span>
                    </dd>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-slate-700">
                    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">User ID</dt>
                    <dd className="text-sm font-mono text-gray-900 dark:text-gray-300 bg-gray-100 dark:bg-slate-800/50 px-3 py-1 rounded">
                      {user?.id.slice(0, 8)}...
                    </dd>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-slate-700">
                    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Sign In</dt>
                    <dd className="text-sm text-gray-900 dark:text-gray-300 font-medium">
                      {user?.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleString()
                        : "N/A"}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Member Since</dt>
                    <dd className="text-sm text-gray-900 dark:text-gray-300 font-medium">{joinedDate}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
