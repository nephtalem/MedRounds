// Core types for MedRounds application

export type RoundStatus = "active" | "completed" | "archived";

export interface Round {
  id: string;
  user_id: string;
  date: string;
  round_number?: string;
  status: RoundStatus;
  created_at: string;
  updated_at: string;
  last_updated_by_email?: string;
  last_updated_by_name?: string;
}

export interface Patient {
  id: string;
  round_id: string;
  user_id?: string; // For performance optimization

  // Patient Data Fields (from Excel)
  name: string;
  bed_number?: string;
  brief_history?: string;
  diagnosis?: string;
  physical_examination?: string;
  imaging?: string;
  lab_result?: string;
  incident?: string;
  medications?: string;
  plan?: string;
  round?: string;

  // Metadata
  serial_no?: number;
  created_at: string;
  updated_at: string;
}

export interface RoundWithPatients extends Round {
  patients: Patient[];
  patient_count: number;
}

export interface PatientFormData {
  name: string;
  bed_number: string;
  brief_history: string;
  diagnosis: string;
  physical_examination: string;
  imaging: string;
  lab_result: string;
  incident: string;
  medications: string;
  plan: string;
  round: string;
}
