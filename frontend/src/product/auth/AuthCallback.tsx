// frontend/src/product/auth/AuthCallback.tsx
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/"); // success → go to product
      } else {
        navigate("/login"); // error → go back to login
      }
    });
  }, []);

  return (
    <div className="text-center p-10 text-gray-600">
      Signing you in with Google...
    </div>
  );
}

