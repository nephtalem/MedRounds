import { supabase } from "./supabase";
import type { Round, Patient, PatientFormData } from "@/types";

// ============================================
// ROUNDS CRUD OPERATIONS
// ============================================

export const roundsDB = {
  // Get all rounds for current user
  async getAll(): Promise<Round[]> {
    const { data, error } = await supabase
      .from("rounds")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get round by ID
  async getById(id: string): Promise<Round | null> {
    const { data, error } = await supabase
      .from("rounds")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get active rounds
  async getActive(): Promise<Round[]> {
    const { data, error } = await supabase
      .from("rounds")
      .select("*")
      .eq("status", "active")
      .order("date", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get rounds by status
  async getByStatus(status: string): Promise<Round[]> {
    const { data, error } = await supabase
      .from("rounds")
      .select("*")
      .eq("status", status)
      .order("date", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create new round
  async create(userId: string, roundData: Partial<Round>): Promise<Round> {
    const { data, error } = await supabase
      .from("rounds")
      .insert({
        user_id: userId,
        date: roundData.date || new Date().toISOString().split("T")[0],
        round_number: roundData.round_number,
        status: roundData.status || "active",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update round
  async update(id: string, updates: Partial<Round>): Promise<Round> {
    const { data, error } = await supabase
      .from("rounds")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete round (and all its patients due to CASCADE)
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("rounds").delete().eq("id", id);

    if (error) throw error;
  },

  // Get round with patient count
  async getWithPatientCount(id: string) {
    const { data: round, error: roundError } = await supabase
      .from("rounds")
      .select("*")
      .eq("id", id)
      .single();

    if (roundError) throw roundError;

    const { count, error: countError } = await supabase
      .from("patients")
      .select("*", { count: "exact", head: true })
      .eq("round_id", id);

    if (countError) throw countError;

    return {
      ...round,
      patient_count: count || 0,
    };
  },
};

// ============================================
// PATIENTS CRUD OPERATIONS
// ============================================

export const patientsDB = {
  // Get all patients for a round
  async getByRound(roundId: string): Promise<Patient[]> {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("round_id", roundId)
      .order("serial_no", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get patient by ID
  async getById(id: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new patient
  async create(
    roundId: string,
    patientData: PatientFormData
  ): Promise<Patient> {
    // Get round to fetch user_id
    const { data: round, error: roundError } = await supabase
      .from("rounds")
      .select("user_id")
      .eq("id", roundId)
      .single();

    if (roundError) throw roundError;

    // Get next serial number
    const { data: existingPatients } = await supabase
      .from("patients")
      .select("serial_no")
      .eq("round_id", roundId)
      .order("serial_no", { ascending: false })
      .limit(1);

    const nextSerialNo =
      existingPatients && existingPatients.length > 0
        ? (existingPatients[0].serial_no || 0) + 1
        : 1;

    const { data, error } = await supabase
      .from("patients")
      .insert({
        round_id: roundId,
        user_id: round.user_id, // Add user_id for performance
        serial_no: nextSerialNo,
        ...patientData,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update patient
  async update(
    id: string,
    updates: Partial<PatientFormData>
  ): Promise<Patient> {
    const { data, error } = await supabase
      .from("patients")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete patient
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("patients").delete().eq("id", id);

    if (error) throw error;
  },

  // Search patients
  async search(roundId: string, searchTerm: string): Promise<Patient[]> {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("round_id", roundId)
      .or(
        `name.ilike.%${searchTerm}%,diagnosis.ilike.%${searchTerm}%,medications.ilike.%${searchTerm}%`
      )
      .order("serial_no", { ascending: true });

    if (error) throw error;
    return data || [];
  },
};
