"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ModernSidebar } from "@/components/modern-sidebar";
import { ModernHeader } from "@/components/modern-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { roundsDB, patientsDB } from "@/lib/database";
import {
  Building2,
  Users,
  ArrowRight,
} from "lucide-react";

interface WardStats {
  id: string;
  name: string;
  patientCount: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [wards, setWards] = useState<WardStats[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWardStats();
  }, []);

  async function loadWardStats() {
    try {
      setLoading(true);
      const allRounds = await roundsDB.getAll();
      
      // Find the 3 permanent ward rounds
      const ward3 = allRounds.find(r => r.round_number === 'Ward 3');
      const ward4 = allRounds.find(r => r.round_number === 'Ward 4');
      const icu = allRounds.find(r => r.round_number === 'ICU');
      
      // Get patient counts for each ward
      const wardStats: WardStats[] = [];
      let total = 0;
      
      if (ward3) {
        const patients = await patientsDB.getByRound(ward3.id);
        wardStats.push({ id: ward3.id, name: 'Ward 3', patientCount: patients.length });
        total += patients.length;
      }
      
      if (ward4) {
        const patients = await patientsDB.getByRound(ward4.id);
        wardStats.push({ id: ward4.id, name: 'Ward 4', patientCount: patients.length });
        total += patients.length;
      }
      
      if (icu) {
        const patients = await patientsDB.getByRound(icu.id);
        wardStats.push({ id: icu.id, name: 'ICU', patientCount: patients.length });
        total += patients.length;
      }
      
      setWards(wardStats);
      setTotalPatients(total);
    } catch (error) {
      console.error("Error loading ward stats:", error);
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
      <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-[#030712] dark:via-slate-900/50 dark:to-[#030712]">
        {/* Modern Sidebar */}
        <ModernSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Modern Header */}
        <ModernHeader
          title="Dashboard"
          subtitle={`${greeting()}, ${user?.user_metadata?.full_name || "Doctor"}!`}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-modern">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Total Patients Overview */}
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-600 dark:via-blue-700 dark:to-blue-900">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 dark:bg-white/10 rounded-full -mr-32 -mt-32" />
              <CardContent className="relative p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 dark:text-blue-200 text-sm font-medium mb-2">Total Patients</p>
                    <div className="text-5xl font-bold text-white mb-3">
                      {loading ? "..." : totalPatients}
                    </div>
                    <p className="text-blue-200 dark:text-blue-300 text-sm">Across all wards</p>
                  </div>
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 dark:bg-white/15 backdrop-blur-sm">
                    <Users className="h-10 w-10 text-white" strokeWidth={2} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ward Cards */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Ward Overview</h2>
              {loading ? (
                <div className="grid gap-6 md:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="border-0 shadow-lg">
                      <CardHeader className="pb-3">
                        <Skeleton className="h-12 w-12 rounded-xl bg-gray-200" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-10 w-20 mb-2 bg-gray-200" />
                        <Skeleton className="h-4 w-32 bg-gray-200" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : wards.length === 0 ? (
                <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <CardContent className="text-center py-12">
                    <Building2 className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No wards found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Please run the setup SQL script to create the 3 permanent wards</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-3">
                  {wards.map((ward) => {
                    const wardSlug = ward.name.toLowerCase().replace(' ', '-');
                    const colors = {
                      'Ward 3': { 
                        bg: 'from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900/40', 
                        icon: 'bg-purple-500 dark:bg-purple-600', 
                        badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300', 
                        shadow: 'shadow-purple-500/20 hover:shadow-purple-500/40 dark:shadow-purple-500/10' 
                      },
                      'Ward 4': { 
                        bg: 'from-cyan-50 to-white dark:from-cyan-950/20 dark:to-slate-900/40', 
                        icon: 'bg-cyan-500 dark:bg-cyan-600', 
                        badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300', 
                        shadow: 'shadow-cyan-500/20 hover:shadow-cyan-500/40 dark:shadow-cyan-500/10' 
                      },
                      'ICU': { 
                        bg: 'from-rose-50 to-white dark:from-rose-950/20 dark:to-slate-900/40', 
                        icon: 'bg-rose-500 dark:bg-rose-600', 
                        badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300', 
                        shadow: 'shadow-rose-500/20 hover:shadow-rose-500/40 dark:shadow-rose-500/10' 
                      },
                    };
                    const color = colors[ward.name as keyof typeof colors];

                    return (
                      <Link
                        key={ward.id}
                        href={`/wards/${wardSlug}`}
                        className="group"
                      >
                        <Card className={`relative overflow-hidden border-0 shadow-lg ${color.shadow} transition-all duration-300 bg-gradient-to-br ${color.bg} group-hover:scale-105 cursor-pointer`}>
                          <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 dark:bg-white/5 rounded-full -mr-16 -mt-16" />
                          <CardHeader className="pb-3 relative">
                            <div className="flex items-center justify-between">
                              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color.icon} shadow-lg`}>
                                <Building2 className="h-6 w-6 text-white" strokeWidth={2.5} />
                              </div>
                              <Badge variant="secondary" className={`${color.badge} border-0`}>
                                Active
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="relative">
                            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                              {ward.patientCount}
                            </div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{ward.name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                              <Users className="h-3.5 w-3.5" />
                              {ward.patientCount} patient{ward.patientCount !== 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                              <span>View details</span>
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white dark:from-slate-900/40 dark:to-slate-800/40">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2 dark:text-gray-100">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Ward Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mt-0.5">
                      <span className="text-blue-700 dark:text-blue-300 font-semibold text-xs">1</span>
                    </div>
                    <p><span className="font-semibold dark:text-gray-200">Select a ward</span> from the sidebar or cards above to view and manage patients</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mt-0.5">
                      <span className="text-blue-700 dark:text-blue-300 font-semibold text-xs">2</span>
                    </div>
                    <p><span className="font-semibold dark:text-gray-200">Add patients</span> to any ward and they&apos;ll be automatically tracked</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mt-0.5">
                      <span className="text-blue-700 dark:text-blue-300 font-semibold text-xs">3</span>
                    </div>
                    <p><span className="font-semibold dark:text-gray-200">Remove patients</span> when they&apos;re discharged from the ward</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mt-0.5">
                      <span className="text-blue-700 dark:text-blue-300 font-semibold text-xs">4</span>
                    </div>
                    <p><span className="font-semibold dark:text-gray-200">Print ward rounds</span> directly from each ward&apos;s patient list</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}
