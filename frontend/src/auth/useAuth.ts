// frontend/src/auth/useAuth.ts
import { useState } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [error, setError] = useState<string | null>(null);

  async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return { signUp, signIn, signOut, error };
}
