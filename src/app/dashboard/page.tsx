"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ModernSidebar } from "@/components/modern-sidebar";
import { ModernHeader } from "@/components/modern-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { roundsDB, patientsDB } from "@/lib/database";
import {
  ClipboardList,
  Plus,
  Calendar,
  TrendingUp,
  Users,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeRounds: 0,
    totalPatients: 0,
    completedRounds: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentRounds, setRecentRounds] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      const allRounds = await roundsDB.getAll();
      
      const activeRounds = allRounds.filter(r => r.status === 'active');
      const completedRounds = allRounds.filter(r => r.status === 'completed');
      
      // Get patient counts for all active rounds
      let totalPatients = 0;
      for (const round of activeRounds) {
        const patients = await patientsDB.getByRound(round.id);
        totalPatients += patients.length;
      }
      
      // Get recent rounds (last 5 active rounds) with patient counts
      const recent = activeRounds.slice(0, 5);
      const roundsWithCounts = await Promise.all(
        recent.map(async (round) => {
          const patients = await patientsDB.getByRound(round.id);
          return {
            ...round,
            patient_count: patients.length,
          };
        })
      );
      
      setStats({
        activeRounds: activeRounds.length,
        totalPatients: totalPatients,
        completedRounds: completedRounds.length,
      });
      setRecentRounds(roundsWithCounts);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        {/* Modern Sidebar */}
        <ModernSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Modern Header */}
        <ModernHeader
          title="Dashboard"
          subtitle={`${greeting()}, ${user?.user_metadata?.full_name || "Doctor"}!`}
          action={{
            label: "New Round",
            href: "/rounds",
            icon: <Plus className="h-4 w-4" />,
          }}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-modern">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Active Rounds Card */}
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16" />
                <CardHeader className="pb-3 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/30">
                      <Calendar className="h-6 w-6 text-white" strokeWidth={2.5} />
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {loading ? "..." : stats.activeRounds}
                  </div>
                  <p className="text-sm font-medium text-gray-600">Active Rounds</p>
                  <p className="text-xs text-gray-500 mt-1">Currently in progress</p>
                </CardContent>
              </Card>

              {/* Total Patients Card */}
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-cyan-50 to-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16" />
                <CardHeader className="pb-3 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500 shadow-lg shadow-cyan-500/30">
                      <Users className="h-6 w-6 text-white" strokeWidth={2.5} />
                    </div>
                    <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 border-0">
                      Total
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {loading ? "..." : stats.totalPatients}
                  </div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-xs text-gray-500 mt-1">Across active rounds</p>
                </CardContent>
              </Card>

              {/* Completed Rounds Card */}
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16" />
                <CardHeader className="pb-3 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 shadow-lg shadow-green-500/30">
                      <TrendingUp className="h-6 w-6 text-white" strokeWidth={2.5} />
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                      Done
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {loading ? "..." : stats.completedRounds}
                  </div>
                  <p className="text-sm font-medium text-gray-600">Completed Rounds</p>
                  <p className="text-xs text-gray-500 mt-1">Total finished</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
                <CardDescription className="text-sm">Get started with your daily rounds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button 
                    size="lg" 
                    className="h-28 flex flex-col gap-3 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 text-base font-semibold" 
                    asChild
                  >
                    <Link href="/rounds">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                        <Plus className="h-6 w-6" />
                      </div>
                      <span>Create New Round</span>
                    </Link>
                  </Button>
                  <Link href="/rounds" className="group">
                    <div className="h-28 flex flex-col items-center justify-center gap-3 px-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 hover:shadow-lg transition-all duration-300 bg-white">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-500 transition-all duration-300">
                        <ClipboardList className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <span className="text-base font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">View All Rounds</span>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Rounds */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Recent Rounds</CardTitle>
                <CardDescription className="text-sm">Your latest active rounds</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 sm:p-5 rounded-xl border-2 border-gray-100">
                        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                          <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gray-200 flex-shrink-0" />
                          <div className="space-y-2 flex-1 min-w-0">
                            <Skeleton className="h-4 sm:h-5 w-24 sm:w-32 bg-gray-200" />
                            <Skeleton className="h-3 sm:h-4 w-32 sm:w-48 bg-gray-200" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          <Skeleton className="hidden sm:block h-6 w-16 rounded-full bg-gray-200" />
                          <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded bg-gray-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentRounds.length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No rounds yet</h3>
                    <p className="text-gray-500 mb-6">Create your first round to get started</p>
                    <Button asChild>
                      <Link href="/rounds">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Round
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentRounds.map((round) => (
                      <Link
                        key={round.id}
                        href={`/rounds/${round.id}`}
                        className="group flex items-center justify-between p-3 sm:p-5 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 hover:shadow-md"
                      >
                        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                          <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
                            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 mb-1 text-sm sm:text-base truncate">
                              {round.round_number || "Unnamed Round"}
                            </p>
                            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 flex-wrap">
                              <span className="flex items-center gap-1 whitespace-nowrap">
                                <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span className="hidden xs:inline">{new Date(round.date).toLocaleDateString()}</span>
                                <span className="xs:hidden">{new Date(round.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              </span>
                              <span className="flex items-center gap-1 whitespace-nowrap">
                                <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                {round.patient_count} <span className="hidden xs:inline">patient{round.patient_count !== 1 ? 's' : ''}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          <Badge className="hidden sm:inline-flex bg-blue-100 text-blue-700 border-0 capitalize px-3 py-1">
                            {round.status}
                          </Badge>
                          <svg
                            className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M9 5l7 7-7 7"></path>
                          </svg>
                        </div>
                      </Link>
                    ))}
                    {recentRounds.length === 5 && (
                      <Button variant="outline" className="w-full mt-4 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md transition-all duration-300" asChild>
                        <Link href="/rounds">View All Rounds</Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}
