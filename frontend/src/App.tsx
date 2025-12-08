// frontend/src/App.tsx
import { supabase } from "./lib/supabase";
import { useEffect, useState } from "react";
import AuthPage from "./auth/AuthPage";
import { GeneratePage } from "./product/generator/GeneratePage";
import type { Session } from "@supabase/supabase-js";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Load existing session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Listen for login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Cleanup listener when component unmounts
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!session) return <AuthPage />;

  return <GeneratePage />;
}
