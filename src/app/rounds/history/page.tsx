"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ModernSidebar } from "@/components/modern-sidebar";
import { ModernHeader } from "@/components/modern-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  Calendar,
  Users,
  ArrowRight,
  Archive,
  RotateCcw,
  CheckCircle2,
  Search,
  Trash2,
  History as HistoryIcon,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { roundsDB, patientsDB } from "@/lib/database";
import type { Round } from "@/types";
import { toast } from "sonner";

interface RoundWithCount extends Round {
  patient_count: number;
}

function HistoryContent() {
  const [rounds, setRounds] = useState<RoundWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roundToDelete, setRoundToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    loadRounds();
  }, [statusFilter]);

  async function loadRounds() {
    try {
      setLoading(true);
      let data: Round[] = [];

      if (statusFilter === "all") {
        const allRounds = await roundsDB.getAll();
        data = allRounds.filter((r) => r.status === "completed" || r.status === "archived");
      } else {
        data = await roundsDB.getByStatus(statusFilter);
      }

      // Get patient counts
      const withCounts = await Promise.all(
        data.map(async (round) => {
          const patients = await patientsDB.getByRound(round.id);
          return {
            ...round,
            patient_count: patients.length,
          };
        })
      );

      setRounds(withCounts);
    } catch (error) {
      console.error("Error loading rounds:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore(roundId: string) {
    const toastId = toast.loading("Restoring round...");
    
    try {
      await roundsDB.update(roundId, { status: "active" });
      toast.success("Round restored to active!", { id: toastId });
      await loadRounds();
    } catch (error) {
      console.error("Error restoring round:", error);
      toast.error("Failed to restore round", { id: toastId });
    }
  }

  function openDeleteDialog(roundId: string) {
    setRoundToDelete(roundId);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!roundToDelete) return;

    const toastId = toast.loading("Deleting round...");
    
    try {
      await roundsDB.delete(roundToDelete);
      toast.success("Round deleted successfully!", { id: toastId });
      setDeleteDialogOpen(false);
      setRoundToDelete(null);
      await loadRounds();
    } catch (error) {
      console.error("Error deleting round:", error);
      toast.error("Failed to delete round", { id: toastId });
    }
  }

  const filteredRounds = rounds.filter((round) =>
    round.round_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredRounds.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRounds = filteredRounds.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  const completedCount = rounds.filter((r) => r.status === "completed").length;
  const archivedCount = rounds.filter((r) => r.status === "archived").length;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Modern Sidebar */}
      <ModernSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Modern Header */}
        <ModernHeader
          title="Round History"
          subtitle="View and manage your completed and archived rounds"
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-modern">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats Overview */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2 md:grid-cols-3">
              <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-white">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-green-500/5 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />
                <CardHeader className="pb-2 sm:pb-3 relative p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-green-500 shadow-lg shadow-green-500/30">
                      <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative p-4 pt-0 sm:p-6 sm:pt-0">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {loading ? "..." : completedCount}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Completed Rounds</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Successfully finished</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-50 to-white">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-orange-500/5 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />
                <CardHeader className="pb-2 sm:pb-3 relative p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-orange-500 shadow-lg shadow-orange-500/30">
                      <Archive className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative p-4 pt-0 sm:p-6 sm:pt-0">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {loading ? "..." : archivedCount}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Archived Rounds</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">Stored for reference</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-white xs:col-span-2 md:col-span-1">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-purple-500/5 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />
                <CardHeader className="pb-2 sm:pb-3 relative p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-purple-500 shadow-lg shadow-purple-500/30">
                      <HistoryIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative p-4 pt-0 sm:p-6 sm:pt-0">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {loading ? "..." : rounds.length}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total History</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">All past rounds</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <Input
                      placeholder="Search rounds..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 sm:pl-10 h-10 sm:h-12 border-2 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <Select 
                    value={statusFilter} 
                    onValueChange={(value) => setStatusFilter(value as "all" | "completed" | "archived")}
                  >
                    <SelectTrigger className="w-full sm:w-48 h-10 sm:h-12 border-2 text-sm">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All History</SelectItem>
                      <SelectItem value="completed">Completed Only</SelectItem>
                      <SelectItem value="archived">Archived Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Rounds List */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Historical Rounds</CardTitle>
                <CardDescription className="text-sm">
                  {filteredRounds.length === 0
                    ? "No rounds found"
                    : `${filteredRounds.length} round${filteredRounds.length !== 1 ? "s" : ""} in history`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : filteredRounds.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mx-auto">
                      <HistoryIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No History Yet</h3>
                      <p className="text-gray-600 mb-6">
                        {searchQuery ? "No rounds match your search" : "Completed and archived rounds will appear here"}
                      </p>
                      {!searchQuery && (
                        <Button asChild>
                          <Link href="/rounds">Go to Active Rounds</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Pagination Info */}
                    {filteredRounds.length > 0 && (
                      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-0 text-xs sm:text-sm text-gray-600 pb-2 border-b">
                        <span className="whitespace-nowrap">
                          Showing <span className="font-bold text-gray-900">{startIndex + 1}-{Math.min(endIndex, filteredRounds.length)}</span> of{" "}
                          <span className="font-bold text-gray-900">{filteredRounds.length}</span>
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
                            <div className={
                              round.status === "completed"
                                ? "flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50 transition-all duration-300"
                                : "flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all duration-300"
                            }>
                              {round.status === "completed" ? (
                                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2.5} />
                              ) : (
                                <Archive className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2.5} />
                              )}
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
                          <Badge className={`hidden md:inline-flex ${
                            round.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          } border-0 capitalize px-3 py-1`}>
                            {round.status}
                          </Badge>
                          <div className="flex gap-0.5 xs:gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRestore(round.id)}
                              className="hover:bg-blue-50 hover:text-blue-700 h-7 w-7 xs:h-8 xs:w-8 p-0"
                              title="Restore to active"
                            >
                              <RotateCcw className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog(round.id)}
                              className="hover:bg-red-50 hover:text-red-700 h-7 w-7 xs:h-8 xs:w-8 p-0"
                              title="Delete permanently"
                            >
                              <Trash2 className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
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
                    {filteredRounds.length > pageSize && totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="border-2"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                        {totalPages <= 10 ? (
                          <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <Button
                                key={page}
                                variant={page === currentPage ? "default" : "outline"}
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
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-xl">Delete Round</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base">
              Are you sure you want to permanently delete this round? This action cannot be undone and will also delete all patients in this round.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <HistoryContent />
    </ProtectedRoute>
  );
}
