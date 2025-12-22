// frontend/src/product/auth/AuthCallback.tsx
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;

      if (error) {
        console.error("Auth callback error:", error);
        navigate("/login");
        return;
      }

      if (data.session) {
        navigate("/", { replace: true });
      } else {
        // Wait for auth state change (OAuth hydration)
        const { data: listener } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            if (session) {
              navigate("/", { replace: true });
            } else {
              navigate("/login", { replace: true });
            }
          }
        );

        return () => listener.subscription.unsubscribe();
      }
    });

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="text-center p-10 text-gray-600">
      Signing you in…
    </div>
  );
}
