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

  // Get ward round by name
  async getByWardName(wardName: string): Promise<Round | null> {
    const { data, error } = await supabase
      .from("rounds")
      .select("*")
      .eq("round_number", wardName)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
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
// HELPER FUNCTIONS
// ============================================

// Update round's last updated by tracking
async function updateRoundTracking(roundId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    await supabase
      .from("rounds")
      .update({
        last_updated_by_email: user.email,
        last_updated_by_name: user.user_metadata?.full_name || user.user_metadata?.title || null,
      })
      .eq("id", roundId);
  }
}

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
    patientData: PatientFormData & { serial_no?: number }
  ): Promise<Patient> {
    // Get round to fetch user_id
    const { data: round, error: roundError } = await supabase
      .from("rounds")
      .select("user_id")
      .eq("id", roundId)
      .single();

    if (roundError) throw roundError;

    // Use provided serial_no or calculate next one
    let serialNo = patientData.serial_no;
    
    if (!serialNo) {
      // Get next serial number only if not provided
      const { data: existingPatients } = await supabase
        .from("patients")
        .select("serial_no")
        .eq("round_id", roundId)
        .order("serial_no", { ascending: false })
        .limit(1);

      serialNo =
        existingPatients && existingPatients.length > 0
          ? (existingPatients[0].serial_no || 0) + 1
          : 1;
    }

    // Remove serial_no from patientData to avoid duplication
    const { serial_no: _, ...dataWithoutSerialNo } = patientData;

    const { data, error } = await supabase
      .from("patients")
      .insert({
        round_id: roundId,
        user_id: round.user_id,
        serial_no: serialNo,
        ...dataWithoutSerialNo,
      })
      .select()
      .single();

    if (error) throw error;
    
    // Update round tracking
    await updateRoundTracking(roundId);
    
    return data;
  },

  // Update patient
  async update(
    id: string,
    updates: Partial<PatientFormData>
  ): Promise<Patient> {
    // Get patient's round_id first
    const { data: patient } = await supabase
      .from("patients")
      .select("round_id")
      .eq("id", id)
      .single();

    const { data, error } = await supabase
      .from("patients")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    // Update round tracking
    if (patient?.round_id) {
      await updateRoundTracking(patient.round_id);
    }
    
    return data;
  },

  // Delete patient and resequence serial numbers
  async delete(id: string): Promise<void> {
    // Get patient's round_id first (before deleting)
    const { data: patient } = await supabase
      .from("patients")
      .select("round_id")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("patients").delete().eq("id", id);

    if (error) throw error;
    
    // Resequence remaining patients to avoid gaps
    if (patient?.round_id) {
      await this.resequenceSerialNumbers(patient.round_id);
      await updateRoundTracking(patient.round_id);
    }
  },

  // Resequence serial numbers to ensure no gaps (1, 2, 3, ...)
  async resequenceSerialNumbers(roundId: string): Promise<void> {
    // Get all patients ordered by current serial_no
    const { data: patients, error: fetchError } = await supabase
      .from("patients")
      .select("id, serial_no")
      .eq("round_id", roundId)
      .order("serial_no", { ascending: true });

    if (fetchError) throw fetchError;
    if (!patients || patients.length === 0) return;

    // Update all in parallel
    const updates = patients.map((patient, index) =>
      supabase
        .from("patients")
        .update({ serial_no: index + 1 })
        .eq("id", patient.id)
    );

    await Promise.all(updates);
  },

  // Update patient order (for drag and drop)
  async updateOrder(roundId: string, orderedPatientIds: string[]): Promise<void> {
    // Update all patients in parallel for speed
    const updates = orderedPatientIds.map((id, index) =>
      supabase
        .from("patients")
        .update({ serial_no: index + 1 })
        .eq("id", id)
    );

    const results = await Promise.all(updates);
    
    // Check for errors
    const failed = results.find(r => r.error);
    if (failed?.error) {
      console.error("Error updating patient order:", failed.error.message);
      throw new Error(failed.error.message);
    }

    // Update round tracking
    await updateRoundTracking(roundId);
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
