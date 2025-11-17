"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ModernSidebar } from "@/components/modern-sidebar";
import { ModernHeader } from "@/components/modern-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PatientForm } from "@/components/patient-form";
import { PatientTable } from "@/components/patient-table";
import { roundsDB, patientsDB } from "@/lib/database";
import type { Round, Patient, PatientFormData } from "@/types";
import { toast } from "sonner";
import {
  Plus,
  Loader2,
  Calendar,
  Users,
  Printer,
  ArrowLeft,
} from "lucide-react";

function RoundDetailContent({ roundId }: { roundId: string }) {
  const { user } = useAuth();
  const [round, setRound] = useState<Round | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const printRef = useRef<HTMLDivElement>(null);

  // Get print header settings from user metadata or use defaults
  const printHeader =
    user?.user_metadata?.print_header || "Axon Neurology Specialty Center";
  const printSubheader =
    user?.user_metadata?.print_subheader || "Daily Patient Rounds";
  const doctorName =
    user?.user_metadata?.full_name || user?.user_metadata?.title || "";

  // Configure react-to-print
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${round?.round_number || "Round"} - ${new Date(
      round?.date || ""
    ).toLocaleDateString()}`,
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 0.4cm;
      }
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundId]);

  async function loadData() {
    try {
      setLoading(true);
      const [roundData, patientsData] = await Promise.all([
        roundsDB.getById(roundId),
        patientsDB.getByRound(roundId),
      ]);
      setRound(roundData);
      setPatients(patientsData);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Failed to load round data");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddPatient(data: PatientFormData) {
    const toastId = toast.loading("Adding patient...");

    try {
      await patientsDB.create(roundId, data);
      toast.success("Patient added successfully!", { id: toastId });
      await loadData();
    } catch (error) {
      console.error("Error adding patient:", error);
      toast.error("Failed to add patient", { id: toastId });
      throw error;
    }
  }

  async function handleEditPatient(data: PatientFormData) {
    if (!editingPatient) return;

    const toastId = toast.loading("Updating patient...");

    try {
      await patientsDB.update(editingPatient.id, data);
      toast.success("Patient updated successfully!", { id: toastId });
      await loadData();
      setEditingPatient(null);
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error("Failed to update patient", { id: toastId });
      throw error;
    }
  }

  async function handleDeletePatient(patientId: string) {
    const toastId = toast.loading("Deleting patient...");

    try {
      await patientsDB.delete(patientId);
      toast.success("Patient deleted successfully!", { id: toastId });
      await loadData();
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error("Failed to delete patient", { id: toastId });
    }
  }

  function handleEditClick(patient: Patient) {
    setEditingPatient(patient);
    setFormMode("edit");
    setFormOpen(true);
  }

  function handleAddClick() {
    setEditingPatient(null);
    setFormMode("create");
    setFormOpen(true);
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <ModernSidebar />
        <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <ModernHeader title="Loading Round..." />
          <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* Loading skeleton */}
            <div className="max-w-[1600px] mx-auto space-y-6">
              {/* Page header skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-10 w-48 bg-gray-300" />
                <Skeleton className="h-5 w-64 bg-gray-200" />
              </div>

              {/* Round info card skeleton */}
              <div className="p-6 border rounded-lg space-y-4 bg-white">
                <Skeleton className="h-6 w-40 bg-gray-300" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-5 w-full bg-gray-200" />
                  <Skeleton className="h-5 w-full bg-gray-200" />
                </div>
              </div>

              {/* Patient table skeleton */}
              <div className="p-6 border rounded-lg space-y-4 bg-white">
                <Skeleton className="h-6 w-32 bg-gray-300" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full bg-gray-200" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!round) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <ModernSidebar />
        <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <ModernHeader title="Round Not Found" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mx-auto">
                <Loader2 className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Round Not Found
              </h2>
              <p className="text-gray-600">
                This round does not exist or you don&apos;t have access to it
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <ModernSidebar />

      <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <ModernHeader
          title="Round Details"
          subtitle={`${new Date(round.date).toLocaleDateString()} • ${
            patients.length
          } patient${patients.length !== 1 ? "s" : ""}`}
        />

        <div className="flex-1 overflow-auto p-6 print:p-0">
          {/* Page Header */}
          <div className="max-w-[1600px] mx-auto mb-6 print-hide">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/rounds">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Round Details
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(round.date).toLocaleDateString()} •{" "}
                    {patients.length} patient
                    {patients.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button onClick={handleAddClick} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Patient
                </Button>
              </div>
            </div>
          </div>

          {/* Printable Content Wrapper */}
          <div ref={printRef} className="print-content">
            {/* Print-only Header */}
            <div className="hidden print:block text-center">
              <h1>{printHeader}</h1>
              <h2>{printSubheader}</h2>
              {doctorName && <p>Dr. {doctorName}</p>}
              <div>
                Date: {new Date(round.date).toLocaleDateString()} | Round:{" "}
                {round.round_number || "N/A"} | Total Patients:{" "}
                {patients.length}
              </div>
              <hr />
            </div>

            {/* Round Info */}
            <div className="max-w-[1600px] mx-auto space-y-6">
              <Card className="border-0 shadow-lg print:hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-4 w-4" />
                      Round Information
                    </CardTitle>
                    <Badge className="capitalize">{round.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <dl className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <dt className="text-xs font-medium text-gray-500">
                        Date
                      </dt>
                      <dd className="text-sm font-semibold mt-1">
                        {new Date(round.date).toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">
                        Round Number
                      </dt>
                      <dd className="text-sm font-semibold mt-1">
                        {round.round_number || "N/A"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">
                        Total Patients
                      </dt>
                      <dd className="text-sm font-semibold flex items-center gap-2 mt-1">
                        <Users className="h-3 w-3" />
                        {patients.length}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">
                        Status
                      </dt>
                      <dd className="text-sm font-semibold capitalize mt-1">
                        {round.status}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Patient List */}
              <div>
                <PatientTable
                  patients={patients}
                  onEdit={handleEditClick}
                  onDelete={handleDeletePatient}
                />
              </div>
            </div>
            {/* End of printable content */}
          </div>
        </div>
      </main>

      {/* Patient Form Dialog */}
      <PatientForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={formMode === "create" ? handleAddPatient : handleEditPatient}
        patient={editingPatient}
        mode={formMode}
      />
    </div>
  );
}

export default function RoundDetailPage() {
  const params = useParams();
  const roundId = params.id as string;

  return (
    <ProtectedRoute>
      <RoundDetailContent roundId={roundId} />
    </ProtectedRoute>
  );
}
