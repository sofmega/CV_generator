// frontend/src/hooks/useAuth.ts
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";

export function useAuth() {
  const { user } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // -----------------------
  // Register user
  // -----------------------
  async function signUp(email: string, password: string) {
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      setError(error.message);
      return false;
    }

    return true;
  }

  // -----------------------
  // Login user
  // -----------------------
  async function signIn(email: string, password: string) {
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return false;
    }

    navigate("/");
    return true;
  }

  // -----------------------
  // Google OAuth Login
  // -----------------------
  async function signInWithGoogle() {
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) setError(error.message);
  }

  // -----------------------
  // Password reset (Forgot password)
  // -----------------------
  async function resetPassword(email: string) {
    setError(null);

    if (!email) {
      setError("Please enter your email first.");
      return false;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      return false;
    }

    return true;
  }

  // -----------------------
  // Logout
  // -----------------------
  async function signOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return {
    user,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    error,
  };
}
