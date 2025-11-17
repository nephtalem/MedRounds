"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ModernSidebar } from "@/components/modern-sidebar";
import { ModernHeader } from "@/components/modern-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PatientForm } from "@/components/patient-form";
import { patientsDB, roundsDB } from "@/lib/database";
import type { Patient, PatientFormData } from "@/types";
import { toast } from "sonner";
import {
  User,
  FileText,
  Stethoscope,
  Activity,
  ImageIcon,
  FlaskConical,
  AlertCircle,
  Pill,
  ClipboardList,
  Calendar,
  Edit,
  ArrowLeft,
  Trash2,
} from "lucide-react";
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

function PatientDetailContent({ patientId }: { patientId: string }) {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [wardName, setWardName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  async function loadPatient() {
    try {
      setLoading(true);
      const patientData = await patientsDB.getById(patientId);
      
      if (!patientData) {
        toast.error("Patient not found");
        router.push("/dashboard");
        return;
      }

      setPatient(patientData);

      // Get ward name from round
      const round = await roundsDB.getById(patientData.round_id);
      if (round) {
        setWardName(round.round_number || "Unknown Ward");
      }
    } catch (error) {
      console.error("Error loading patient:", error);
      toast.error("Failed to load patient data");
    } finally {
      setLoading(false);
    }
  }

  async function updateRoundDate(roundId: string) {
    try {
      await roundsDB.update(roundId, { date: new Date().toISOString() });
    } catch (error) {
      console.error("Error updating round date:", error);
    }
  }

  async function handleEditPatient(data: PatientFormData) {
    if (!patient) return;

    const toastId = toast.loading("Updating patient...");

    try {
      await patientsDB.update(patient.id, data);
      await updateRoundDate(patient.round_id);
      toast.success("Patient updated successfully!", { id: toastId });
      await loadPatient();
      setFormOpen(false);
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error("Failed to update patient", { id: toastId });
      throw error;
    }
  }

  async function handleDeletePatient() {
    if (!patient) return;

    const toastId = toast.loading("Deleting patient...");

    try {
      await patientsDB.delete(patient.id);
      await updateRoundDate(patient.round_id);
      toast.success("Patient deleted successfully!", { id: toastId });
      
      // Navigate back to ward
      const wardSlug = wardName.toLowerCase().replace(' ', '-');
      router.push(`/wards/${wardSlug}`);
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error("Failed to delete patient", { id: toastId });
    }
  }

  const handleBack = () => {
    if (wardName) {
      const wardSlug = wardName.toLowerCase().replace(' ', '-');
      router.push(`/wards/${wardSlug}`);
    } else {
      router.push("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-[#030712] dark:via-slate-900/50 dark:to-[#030712]">
        <ModernSidebar />
        <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <ModernHeader title="Loading Patient..." />
          <div className="flex-1 overflow-auto p-6 space-y-6">
            <div className="max-w-5xl mx-auto space-y-6">
              <Skeleton className="h-10 w-64 bg-gray-300" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="border-0 shadow-lg">
                  <CardHeader className="bg-gray-100">
                    <Skeleton className="h-6 w-40 bg-gray-300" />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Skeleton className="h-20 w-full bg-gray-200" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-[#030712] dark:via-slate-900/50 dark:to-[#030712]">
        <ModernSidebar />
        <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <ModernHeader title="Patient Not Found" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mx-auto">
                <User className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Patient Not Found</h2>
              <p className="text-gray-600">
                This patient does not exist or has been removed
              </p>
              <Button onClick={() => router.push("/dashboard")} className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const detailSections = [
    {
      title: "Patient Information",
      icon: User,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      fields: [
        { label: "Serial No", value: `#${patient.serial_no || "N/A"}` },
        { label: "Name", value: patient.name || "N/A" },
        { label: "Ward", value: wardName || "N/A" },
      ],
    },
    {
      title: "Brief History",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      content: patient.brief_history || "No history recorded",
    },
    {
      title: "Diagnosis",
      icon: Stethoscope,
      color: "text-green-600",
      bgColor: "bg-green-50",
      content: patient.diagnosis || "No diagnosis recorded",
    },
    {
      title: "Physical Examination",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      content: patient.physical_examination || "No examination recorded",
    },
    {
      title: "Imaging",
      icon: ImageIcon,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      content: patient.imaging || "No imaging recorded",
    },
    {
      title: "Lab Results",
      icon: FlaskConical,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      content: patient.lab_result || "No lab results recorded",
    },
    {
      title: "Incident",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      content: patient.incident || "No incidents recorded",
    },
    {
      title: "Medications",
      icon: Pill,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      content: patient.medications || "No medications recorded",
    },
    {
      title: "Plan",
      icon: ClipboardList,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      content: patient.plan || "No plan recorded",
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-[#030712] dark:via-slate-900/50 dark:to-[#030712]">
      <ModernSidebar />

      <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <ModernHeader
          title={patient.name || "Patient Details"}
          subtitle={`${wardName} • Patient #${patient.serial_no || "N/A"}`}
        />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header with Actions */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={handleBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to {wardName}
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <Button onClick={() => setFormOpen(true)} className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Patient
                </Button>
              </div>
            </div>

            {/* Patient Details */}
            <div className="space-y-4">
              {detailSections.map((section, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader className={`pb-3 ${section.bgColor} rounded-t-lg`}>
                    <CardTitle
                      className={`flex items-center gap-2 text-base font-semibold ${section.color}`}
                    >
                      <section.icon className="h-5 w-5" strokeWidth={2.5} />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {section.fields ? (
                      <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {section.fields.map((field, idx) => (
                          <div key={idx}>
                            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                              {field.label}
                            </dt>
                            <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {field.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {section.content}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Metadata Footer */}
            <Card className="border-0 shadow-md bg-gray-50 dark:bg-slate-800/50">
              <CardContent className="py-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Created: {new Date(patient.created_at).toLocaleString()}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs dark:bg-slate-700 dark:text-gray-200">
                    Last Updated: {new Date(patient.updated_at || patient.created_at).toLocaleString()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Edit Patient Form */}
      <PatientForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleEditPatient}
        patient={patient}
        mode="edit"
        existingSerialNumbers={[]}
        suggestedSerialNo={1}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Patient?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold">{patient.name}</span>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePatient}
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

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;

  return (
    <ProtectedRoute>
      <PatientDetailContent patientId={patientId} />
    </ProtectedRoute>
  );
}

