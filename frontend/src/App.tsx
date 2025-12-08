// frontend/src/App.tsx
import { supabase } from "./lib/supabase";
import { useEffect, useState } from "react";
import AuthPage from "./auth/AuthPage";
import { GeneratePage } from "./product/generator/GeneratePage";
import type { Session } from "@supabase/supabase-js";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  function handleLogout() {
    supabase.auth.signOut();
  }

  return (
    <>
      {/* HEADER */}
      <div
        style={{
          width: "100%",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "flex-end",
          borderBottom: "1px solid #ddd",
        }}
      >
        {session ? (
          <>
            <span style={{ marginRight: 15 }}>
              Logged in as <b>{session.user.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={() => setShowAuth(true)}>Login / Register</button>
        )}
      </div>

      {/* AUTH MODAL */}
      {showAuth && !session && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setShowAuth(false)}
        >
          <div
            style={{ background: "white", padding: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <AuthPage />
          </div>
        </div>
      )}

      {/* ALWAYS PUBLIC GENERATOR PAGE */}
      <GeneratePage />
    </>
  );
}
