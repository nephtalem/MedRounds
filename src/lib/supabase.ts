import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
console.log("supabaseUrl", supabaseUrl);
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Auth helper functions
export const authHelpers = {
  // Sign up with email and password
  signUp: async (
    email: string,
    password: string,
    metadata?: { full_name?: string }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get current session
  getSession: async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    return { session, error };
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/auth/reset-password`,
    });
    return { data, error };
  },

  // Update user
  updateUser: async (updates: {
    email?: string;
    password?: string;
    data?: any;
  }) => {
    const { data, error } = await supabase.auth.updateUser(updates);
    return { data, error };
  },
};

// Database types
export type Patient = {
  id: string;
  round_id: string;
  created_at: string;
  updated_at: string;
  // Fields will be added based on the Excel columns
};

export type Round = {
  id: string;
  user_id: string;
  created_at: string;
  date: string;
  doctor_name?: string;
  status: "active" | "completed" | "archived";
};

export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: "doctor" | "nurse" | "admin";
  created_at: string;
  updated_at: string;
};
