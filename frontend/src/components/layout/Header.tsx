import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import NavbarButton from "../ui/NavbarButton";
import { Link } from "react-router-dom";

export default function Header() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <header className="w-full bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
      <div className="text-xl font-semibold text-gray-800">
        <Link to="/">CVPRO AI</Link>
      </div>

      <div>
        {!session ? (
          <div className="flex gap-4">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-medium transition"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{session.user.email}</span>

            <NavbarButton
              className="text-red-500"
              onClick={() => supabase.auth.signOut()}
            >
              Logout
            </NavbarButton>
          </div>
        )}
      </div>
    </header>
  );
}
