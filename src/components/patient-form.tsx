"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { Patient, PatientFormData } from "@/types";

interface PatientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PatientFormData) => Promise<void>;
  patient?: Patient | null;
  mode: "create" | "edit";
}

export function PatientForm({ open, onOpenChange, onSubmit, patient, mode }: PatientFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PatientFormData>({
    name: "",
    brief_history: "",
    diagnosis: "",
    physical_examination: "",
    imaging: "",
    lab_result: "",
    incident: "",
    medications: "",
    plan: "",
    round: "",
  });

  // Update form data when patient changes or dialog opens
  useEffect(() => {
    if (open && patient) {
      setFormData({
        name: patient.name || "",
        brief_history: patient.brief_history || "",
        diagnosis: patient.diagnosis || "",
        physical_examination: patient.physical_examination || "",
        imaging: patient.imaging || "",
        lab_result: patient.lab_result || "",
        incident: patient.incident || "",
        medications: patient.medications || "",
        plan: patient.plan || "",
        round: patient.round || "",
      });
    } else if (open && !patient) {
      // Reset form for create mode
      setFormData({
        name: "",
        brief_history: "",
        diagnosis: "",
        physical_examination: "",
        imaging: "",
        lab_result: "",
        incident: "",
        medications: "",
        plan: "",
        round: "",
      });
    }
  }, [open, patient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Patient" : "Edit Patient"}
          </DialogTitle>
          <DialogDescription>
            Fill in the patient information below. Name is required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Name - Required */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-semibold">
                1. Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Patient name"
                required
                disabled={loading}
              />
            </div>

            {/* Brief History */}
            <div className="grid gap-2">
              <Label htmlFor="brief_history" className="font-semibold">
                2. Brief History
              </Label>
              <Textarea
                id="brief_history"
                value={formData.brief_history}
                onChange={(e) => setFormData({ ...formData, brief_history: e.target.value })}
                placeholder="Brief medical history..."
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Diagnosis */}
            <div className="grid gap-2">
              <Label htmlFor="diagnosis" className="font-semibold">
                3. Diagnosis
              </Label>
              <Textarea
                id="diagnosis"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="Current diagnosis..."
                rows={2}
                disabled={loading}
              />
            </div>

            {/* Physical Examination */}
            <div className="grid gap-2">
              <Label htmlFor="physical_examination" className="font-semibold">
                4. Physical Examination
              </Label>
              <Textarea
                id="physical_examination"
                value={formData.physical_examination}
                onChange={(e) => setFormData({ ...formData, physical_examination: e.target.value })}
                placeholder="Physical examination findings..."
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Imaging */}
            <div className="grid gap-2">
              <Label htmlFor="imaging" className="font-semibold">
                5. Imaging
              </Label>
              <Textarea
                id="imaging"
                value={formData.imaging}
                onChange={(e) => setFormData({ ...formData, imaging: e.target.value })}
                placeholder="Imaging results (X-ray, CT, MRI, etc.)..."
                rows={2}
                disabled={loading}
              />
            </div>

            {/* Lab Result */}
            <div className="grid gap-2">
              <Label htmlFor="lab_result" className="font-semibold">
                6. Lab Result
              </Label>
              <Textarea
                id="lab_result"
                value={formData.lab_result}
                onChange={(e) => setFormData({ ...formData, lab_result: e.target.value })}
                placeholder="Laboratory test results..."
                rows={2}
                disabled={loading}
              />
            </div>

            {/* Incident */}
            <div className="grid gap-2">
              <Label htmlFor="incident" className="font-semibold">
                7. Incident
              </Label>
              <Textarea
                id="incident"
                value={formData.incident}
                onChange={(e) => setFormData({ ...formData, incident: e.target.value })}
                placeholder="Any incidents or complications..."
                rows={2}
                disabled={loading}
              />
            </div>

            {/* Medications */}
            <div className="grid gap-2">
              <Label htmlFor="medications" className="font-semibold">
                8. Medications
              </Label>
              <Textarea
                id="medications"
                value={formData.medications}
                onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                placeholder="Current medications and dosages..."
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Plan */}
            <div className="grid gap-2">
              <Label htmlFor="plan" className="font-semibold">
                9. Plan
              </Label>
              <Textarea
                id="plan"
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                placeholder="Treatment plan..."
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Round */}
            <div className="grid gap-2">
              <Label htmlFor="round" className="font-semibold">
                10. Round
              </Label>
              <Input
                id="round"
                value={formData.round}
                onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                placeholder="Round information"
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : mode === "create" ? (
                "Add Patient"
              ) : (
                "Update Patient"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

