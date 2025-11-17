"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ModernSidebar } from "@/components/modern-sidebar";
import { ModernHeader } from "@/components/modern-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Loader2,
  Calendar,
  Users,
  ArrowRight,
  CheckCircle2,
  Archive,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { roundsDB, patientsDB } from "@/lib/database";
import type { Round } from "@/types";
import { toast } from "sonner";

function RoundsContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [roundNumber, setRoundNumber] = useState("");
  const [creating, setCreating] = useState(false);
  const [roundsWithCounts, setRoundsWithCounts] = useState<
    Array<Round & { patient_count: number }>
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Pagination calculations
  const totalPages = Math.ceil(roundsWithCounts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRounds = roundsWithCounts.slice(startIndex, endIndex);

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  useEffect(() => {
    loadRounds();
  }, []);

  async function loadRounds() {
    try {
      setLoading(true);
      const data = await roundsDB.getActive();
      setRounds(data);

      // Get patient counts for each round
      const countsPromises = data.map(async (round) => {
        const patients = await patientsDB.getByRound(round.id);
        return {
          ...round,
          patient_count: patients.length,
        };
      });

      const roundsWithPatientCounts = await Promise.all(countsPromises);
      setRoundsWithCounts(roundsWithPatientCounts);
    } catch (error) {
      console.error("Error loading rounds:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateRound() {
    if (!roundNumber.trim() || !user) return;

    setCreating(true);
    const toastId = toast.loading("Creating round...");

    try {
      const newRound = await roundsDB.create(user.id, {
        round_number: roundNumber,
        date: new Date().toISOString(),
        status: "active",
      });

      toast.success("Round created successfully!", { id: toastId });
      setShowCreateDialog(false);
      setRoundNumber("");
      router.push(`/rounds/${newRound.id}`);
    } catch (error) {
      console.error("Error creating round:", error);
      toast.error("Failed to create round", { id: toastId });
    } finally {
      setCreating(false);
    }
  }

  async function handleStatusChange(
    roundId: string,
    newStatus: "completed" | "archived"
  ) {
    const toastId = toast.loading(`Marking round as ${newStatus}...`);

    try {
      await roundsDB.update(roundId, { status: newStatus });
      toast.success(`Round ${newStatus} successfully!`, { id: toastId });
      await loadRounds();
    } catch (error) {
      console.error("Error updating round:", error);
      toast.error("Failed to update round status", { id: toastId });
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Modern Sidebar */}
      <ModernSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Modern Header */}
        <ModernHeader
          title="Active Rounds"
          subtitle="Manage your ongoing patient rounds"
          action={{
            label: "New Round",
            href: "#",
            icon: <Plus className="h-4 w-4" />,
          }}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-modern">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats Overview */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2 md:grid-cols-3">
              <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/5 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />
                <CardHeader className="pb-2 sm:pb-3 relative p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/30">
                      <Calendar
                        className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative p-4 pt-0 sm:p-6 sm:pt-0">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {loading ? "..." : rounds.length}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Active Rounds
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                    Currently in progress
                  </p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-white">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-cyan-500/5 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />
                <CardHeader className="pb-2 sm:pb-3 relative p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-cyan-500 shadow-lg shadow-cyan-500/30">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative p-4 pt-0 sm:p-6 sm:pt-0">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {loading
                      ? "..."
                      : roundsWithCounts.reduce(
                          (sum, r) => sum + r.patient_count,
                          0
                        )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Patients
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                    Across all rounds
                  </p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-white xs:col-span-2 md:col-span-1">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-green-500/5 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />
                <CardHeader className="pb-2 sm:pb-3 relative p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-green-500 shadow-lg shadow-green-500/30">
                      <CheckCircle2
                        className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative p-4 pt-0 sm:p-6 sm:pt-0">
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-bold text-3xl sm:text-4xl text-gray-900 hover:text-blue-600 hover:bg-transparent"
                    asChild
                  >
                    <Link href="/rounds/history">View</Link>
                  </Button>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mt-1 sm:mt-2">
                    Round History
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                    Completed & archived
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Action */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 sm:space-y-2 flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                      Start a New Round
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Create a new patient round and begin documentation
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => setShowCreateDialog(true)}
                    className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 gap-2"
                  >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="whitespace-nowrap">Create Round</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Rounds List */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Your Active Rounds
                </CardTitle>
                <CardDescription className="text-sm">
                  {rounds.length === 0
                    ? "No active rounds"
                    : `${rounds.length} active round${
                        rounds.length !== 1 ? "s" : ""
                      }`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : rounds.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mx-auto">
                      <Calendar className="h-10 w-10 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Active Rounds
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Create your first round to get started with patient
                        documentation
                      </p>
                      <Button
                        onClick={() => setShowCreateDialog(true)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Create Your First Round
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Pagination Info */}
                    {roundsWithCounts.length > 0 && (
                      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-0 text-xs sm:text-sm text-gray-600 pb-2 border-b">
                        <span className="whitespace-nowrap">
                          Showing{" "}
                          <span className="font-bold text-gray-900">
                            {startIndex + 1}-
                            {Math.min(endIndex, roundsWithCounts.length)}
                          </span>{" "}
                          of{" "}
                          <span className="font-bold text-gray-900">
                            {roundsWithCounts.length}
                          </span>
                        </span>
                        <div className="flex items-center gap-2 xs:gap-3 w-full xs:w-auto">
                          <Select
                            value={pageSize.toString()}
                            onValueChange={handlePageSizeChange}
                          >
                            <SelectTrigger className="w-24 xs:w-28 sm:w-32 h-8 xs:h-9 border-2 text-xs sm:text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 / page</SelectItem>
                              <SelectItem value="10">10 / page</SelectItem>
                              <SelectItem value="25">25 / page</SelectItem>
                              <SelectItem value="50">50 / page</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">
                            Page {currentPage} of {totalPages}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Rounds List */}
                    <div className="space-y-3">
                      {paginatedRounds.map((round) => (
                        <div
                          key={round.id}
                          className="group flex items-center justify-between p-3 sm:p-5 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300"
                        >
                          <Link href={`/rounds/${round.id}`} className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 sm:gap-4">
                              <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
                                <Calendar
                                  className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                                  strokeWidth={2.5}
                                />
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
                                    {round.patient_count} <span className="hidden xs:inline">patient{round.patient_count !== 1 ? "s" : ""}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-3 flex-shrink-0">
                            <Badge className="hidden md:inline-flex bg-blue-100 text-blue-700 border-0 capitalize px-3 py-1">
                              {round.status}
                            </Badge>
                            <div className="flex gap-0.5 xs:gap-1 sm:gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(round.id, "completed")
                                }
                                className="hover:bg-green-50 hover:text-green-700 h-7 w-7 xs:h-8 xs:w-8 p-0"
                                title="Mark as completed"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(round.id, "archived")
                                }
                                className="hover:bg-orange-50 hover:text-orange-700 h-7 w-7 xs:h-8 xs:w-8 p-0"
                                title="Archive"
                              >
                                <Archive className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                              </Button>
                            </div>
                            <Link href={`/rounds/${round.id}`} className="hidden xs:block">
                              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {roundsWithCounts.length > pageSize && totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={currentPage === 1}
                          className="border-2"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                        {totalPages <= 10 ? (
                          <div className="flex gap-1">
                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1
                            ).map((page) => (
                              <Button
                                key={page}
                                variant={
                                  page === currentPage ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 ${
                                  page === currentPage
                                    ? "bg-blue-600 hover:bg-blue-700 border-0"
                                    : "border-2"
                                }`}
                              >
                                {page}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-600 px-4">
                            Page {currentPage} of {totalPages}
                          </span>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="border-2"
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Create Round Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Create New Round
            </DialogTitle>
            <DialogDescription className="text-base">
              Enter a name or number for this round
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roundNumber" className="text-sm font-semibold">
                Round Name / Number
              </Label>
              <Input
                id="roundNumber"
                placeholder="e.g., Morning Round - Ward A"
                value={roundNumber}
                onChange={(e) => setRoundNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && roundNumber.trim()) {
                    handleCreateRound();
                  }
                }}
                className="h-12 border-2 focus:border-blue-500"
                autoFocus
              />
              <p className="text-xs text-gray-500">
                This helps you identify the round later
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setRoundNumber("");
              }}
              disabled={creating}
              className="border-2"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateRound}
              disabled={!roundNumber.trim() || creating}
              className="gap-2 shadow-lg shadow-blue-500/30"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Round
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function RoundsPage() {
  return (
    <ProtectedRoute>
      <RoundsContent />
    </ProtectedRoute>
  );
}
