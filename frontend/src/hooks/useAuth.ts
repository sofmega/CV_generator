// frontend/src/hooks/useAuth.ts
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // -----------------------
  // Get current logged user
  // -----------------------
  async function getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user || null;
  }

  // (Optional) Get session token
  async function getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session || null;
  }

  // -----------------------
  // Register user
  // -----------------------
  async function signUp(email: string, password: string) {
    setError(null);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      return;
    }

    alert(
      "A confirmation email has been sent to your inbox. Please verify your email before logging in."
    );

    navigate("/login");
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
      return;
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

    if (error) {
      setError(error.message);
      return;
    }
  }

  // -----------------------
  // Logout
  // -----------------------
  async function signOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return {
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    getCurrentUser,
    getSession,
    error,
  };
}
