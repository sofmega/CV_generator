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

    // ⭐ Show success message
    alert(
      "A confirmation email has been sent to your inbox. Please verify your email to activate your account."
    );

    // ⭐ Redirect to login page
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

    // ⭐ Go to main product page
    navigate("/");

    return true;
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return { signIn, signUp, signOut, error };
}
