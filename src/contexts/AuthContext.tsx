"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    fullName?: string,
    rememberMe?: boolean
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const sessionCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownExpiryToast = useRef(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle different auth events
      if (event === "SIGNED_OUT") {
        hasShownExpiryToast.current = false;
        toast.info("You have been signed out");
        router.push("/auth/login");
      } else if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed successfully");
        hasShownExpiryToast.current = false;
      } else if (event === "USER_UPDATED") {
        console.log("User updated");
      }
    });

    // Check session validity every minute
    sessionCheckIntervalRef.current = setInterval(async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        // Check custom session expiry for non-remember-me users
        if (typeof window !== "undefined") {
          const sessionExpiry = localStorage.getItem("sessionExpiry");
          if (sessionExpiry && Date.now() > parseInt(sessionExpiry)) {
            // Custom session expired (4 hours for non-remember-me)
            if (!hasShownExpiryToast.current) {
              hasShownExpiryToast.current = true;
              toast.error("Your session has expired. Please sign in again.", {
                duration: 5000,
              });
              await supabase.auth.signOut();
              localStorage.removeItem("sessionExpiry");
              setSession(null);
              setUser(null);
              router.push("/auth/login");
            }
            return;
          }
        }

        if (!currentSession && user && !hasShownExpiryToast.current) {
          // Session expired
          hasShownExpiryToast.current = true;
          toast.error("Your session has expired. Please sign in again.", {
            duration: 5000,
          });
          setSession(null);
          setUser(null);
          router.push("/auth/login");
        } else if (currentSession) {
          // Check if session is about to expire (within 5 minutes)
          const expiresAt = currentSession.expires_at;
          if (expiresAt) {
            const expiresInMs = expiresAt * 1000 - Date.now();
            const expiresInMinutes = Math.floor(expiresInMs / 60000);

            if (
              expiresInMinutes <= 5 &&
              expiresInMinutes > 0 &&
              !hasShownExpiryToast.current
            ) {
              hasShownExpiryToast.current = true;
              toast.warning(
                `Your session will expire in ${expiresInMinutes} minute${
                  expiresInMinutes !== 1 ? "s" : ""
                }. Please save your work.`,
                {
                  duration: 10000,
                }
              );
            }
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    }, 60000); // Check every minute

    return () => {
      subscription.unsubscribe();
      if (sessionCheckIntervalRef.current) {
        clearInterval(sessionCheckIntervalRef.current);
      }
    };
  }, [router, user]);

  const signIn = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ) => {
    try {
      // Set session persistence based on remember me
      await supabase.auth.setSession({
        access_token: "",
        refresh_token: "",
      });

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Store remember me preference
      if (typeof window !== "undefined") {
        localStorage.setItem("rememberMe", rememberMe.toString());
      }

      // If not remember me, set a shorter session timeout (4 hours)
      if (!rememberMe && typeof window !== "undefined") {
        const expiryTime = Date.now() + 4 * 60 * 60 * 1000; // 4 hours
        localStorage.setItem("sessionExpiry", expiryTime.toString());
      } else if (typeof window !== "undefined") {
        localStorage.removeItem("sessionExpiry");
      }

      return { error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: error as Error };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName?: string,
    rememberMe: boolean = false
  ) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      // Store remember me preference
      if (typeof window !== "undefined") {
        localStorage.setItem("rememberMe", rememberMe.toString());
      }

      // If not remember me, set a shorter session timeout (4 hours)
      if (!rememberMe && typeof window !== "undefined") {
        const expiryTime = Date.now() + 4 * 60 * 60 * 1000; // 4 hours
        localStorage.setItem("sessionExpiry", expiryTime.toString());
      } else if (typeof window !== "undefined") {
        localStorage.removeItem("sessionExpiry");
      }

      return { error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Clear remember me settings
      if (typeof window !== "undefined") {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("sessionExpiry");
      }
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
