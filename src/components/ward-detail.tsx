"use client";

import { useState, useEffect, useRef } from "react";
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
  Download,
  FileSpreadsheet,
  FileText,
  Building2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  exportPatientsToExcel,
  exportPatientsToCSV,
  exportPatientsToPDF,
} from "@/lib/export";

interface WardDetailProps {
  wardName: string;
}

function WardDetailContent({ wardName }: WardDetailProps) {
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
    user?.user_metadata?.print_header || "Axon Stroke and Spine Center";
  const printSubheader =
    user?.user_metadata?.print_subheader || "Daily Patient Rounds";
  const doctorName =
    user?.user_metadata?.full_name || user?.user_metadata?.title || "";

  // Configure react-to-print
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${wardName} - ${new Date().toLocaleDateString()}`,
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
  }, [wardName]);

  async function loadData() {
    try {
      setLoading(true);
      // Find the round by ward name (round_number)
      const allRounds = await roundsDB.getAll();
      const wardRound = allRounds.find(r => r.round_number === wardName);
      
      if (!wardRound) {
        setRound(null);
        setPatients([]);
        return;
      }

      const patientsData = await patientsDB.getByRound(wardRound.id);
      setRound(wardRound);
      setPatients(patientsData);
    } catch (error) {
      console.error("Error loading ward data:", error);
      toast.error("Failed to load ward data");
    } finally {
      setLoading(false);
    }
  }

  async function updateRoundDate(roundId: string) {
    try {
      // Update round date to current timestamp
      await roundsDB.update(roundId, { date: new Date().toISOString() });
    } catch (error) {
      console.error("Error updating round date:", error);
    }
  }

  async function handleAddPatient(data: PatientFormData) {
    if (!round) return;
    
    const toastId = toast.loading("Adding patient...");

    try {
      await patientsDB.create(round.id, data);
      await updateRoundDate(round.id);
      toast.success("Patient added successfully!", { id: toastId });
      await loadData();
    } catch (error) {
      console.error("Error adding patient:", error);
      toast.error("Failed to add patient", { id: toastId });
      throw error;
    }
  }

  async function handleEditPatient(data: PatientFormData) {
    if (!editingPatient || !round) return;

    const toastId = toast.loading("Updating patient...");

    try {
      await patientsDB.update(editingPatient.id, data);
      await updateRoundDate(round.id);
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
    if (!round) return;
    
    const toastId = toast.loading("Deleting patient...");

    try {
      await patientsDB.delete(patientId);
      await updateRoundDate(round.id);
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

  function handleExportExcel() {
    exportPatientsToExcel(patients, wardName);
    toast.success("Exported to Excel successfully!");
  }

  function handleExportCSV() {
    exportPatientsToCSV(patients, wardName);
    toast.success("Exported to CSV successfully!");
  }

  function handleExportPDF() {
    const roundDate = round ? new Date(round.date).toLocaleDateString() : new Date().toLocaleDateString();
    exportPatientsToPDF(
      patients,
      wardName,
      roundDate,
      printHeader,
      printSubheader,
      doctorName
    );
    toast.success("Exported to PDF successfully!");
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-[#030712] dark:via-slate-900/50 dark:to-[#030712]">
        <ModernSidebar />
        <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <ModernHeader title={`Loading ${wardName}...`} />
          <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* Loading skeleton */}
            <div className="max-w-[1600px] mx-auto space-y-6">
              {/* Page header skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-10 w-48 bg-gray-300" />
                <Skeleton className="h-5 w-64 bg-gray-200" />
              </div>

              {/* Ward info card skeleton */}
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
      <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-[#030712] dark:via-slate-900/50 dark:to-[#030712]">
        <ModernSidebar />
        <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <ModernHeader title={`${wardName} Not Found`} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-md">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mx-auto">
                <Loader2 className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {wardName} Not Found
              </h2>
              <p className="text-gray-600">
                This ward has not been set up yet. Please run the SQL setup script to create the 3 permanent wards (Ward 3, Ward 4, ICU).
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800 font-medium">💡 Setup Required</p>
                <p className="text-sm text-blue-700 mt-1">Run <code className="bg-blue-100 px-2 py-1 rounded">setup-permanent-rounds.sql</code> in your Supabase SQL editor</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-[#030712] dark:via-slate-900/50 dark:to-[#030712]">
      <ModernSidebar />

      <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <ModernHeader
          title={wardName}
          subtitle={`Last updated: ${new Date(round.date).toLocaleString()} • ${
            patients.length
          } patient${patients.length !== 1 ? "s" : ""}`}
        />

        <div className="flex-1 overflow-auto p-4 sm:p-6 print:p-0">
          {/* Page Header */}
          <div className="max-w-[1600px] mx-auto mb-6 print-hide">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left: Ward Icon and Title */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
                    {wardName}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5 sm:mt-1 truncate">
                    Last updated: {new Date(round.date).toLocaleString()} •{" "}
                    {patients.length} patient
                    {patients.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {/* Export Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="gap-2 dark:bg-slate-800/50 dark:border-slate-700 dark:hover:bg-slate-700/50 dark:text-gray-200 h-9 sm:h-10"
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden xs:inline">Export</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 dark:bg-slate-900 dark:border-slate-800">
                    <DropdownMenuItem onClick={handleExportPDF} className="dark:hover:bg-slate-800 dark:text-gray-300">
                      <FileText className="mr-2 h-4 w-4" />
                      Export to PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportExcel} className="dark:hover:bg-slate-800 dark:text-gray-300">
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Export to Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportCSV} className="dark:hover:bg-slate-800 dark:text-gray-300">
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Export to CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Print Button */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePrint} 
                  className="dark:bg-slate-800/50 dark:border-slate-700 dark:hover:bg-slate-700/50 dark:text-gray-200 gap-2 h-9 sm:h-10"
                >
                  <Printer className="h-4 w-4" />
                  <span className="hidden sm:inline">Print</span>
                </Button>

                {/* Add Patient Button */}
                <Button 
                  onClick={handleAddClick} 
                  size="sm"
                  className="gap-2 h-9 sm:h-10 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
                >
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
                Date: {new Date(round.date).toLocaleString()} | Round:{" "}
                {wardName} | Total Patients:{" "}
                {patients.length}
              </div>
              <hr />
            </div>

            {/* Ward Info */}
            <div className="max-w-[1600px] mx-auto space-y-6 print:max-w-full print:mx-0 print:space-y-0">
              <Card className="border-0 shadow-lg print:hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-4 w-4" />
                      Ward Information
                    </CardTitle>
                    <Badge className="capitalize bg-green-100 text-green-700 border-0">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <dl className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Ward Name
                      </dt>
                      <dd className="text-sm font-semibold mt-1 dark:text-gray-100">
                        {wardName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Last Updated
                      </dt>
                      <dd className="text-sm font-semibold mt-1 dark:text-gray-100">
                        {new Date(round.date).toLocaleString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Last Updated By
                      </dt>
                      <dd className="text-sm font-semibold mt-1 dark:text-gray-100">
                        {round.last_updated_by_name || 
                         (round.last_updated_by_email?.split('@')[0]?.charAt(0).toUpperCase() + 
                          round.last_updated_by_email?.split('@')[0]?.slice(1)) || 
                         'Not yet updated'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Total Patients
                      </dt>
                      <dd className="text-sm font-semibold flex items-center gap-2 mt-1 dark:text-gray-100">
                        <Users className="h-3 w-3" />
                        {patients.length}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Patient List */}
              <div className="print:pt-0">
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
        existingSerialNumbers={patients.map(p => p.serial_no || 0).filter(n => n > 0)}
        suggestedSerialNo={Math.max(0, ...patients.map(p => p.serial_no || 0)) + 1}
      />
    </div>
  );
}

export function WardDetail({ wardName }: WardDetailProps) {
  return (
    <ProtectedRoute>
      <WardDetailContent wardName={wardName} />
    </ProtectedRoute>
  );
}

