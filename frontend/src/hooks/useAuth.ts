import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

    // User will be redirected automatically by Google → Supabase → /auth/callback
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return { signIn, signUp, signOut, signInWithGoogle, error };
}
