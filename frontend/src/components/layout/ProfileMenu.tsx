// frontend/src/components/layout/ProfileMenu.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function ProfileMenu() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const email = user.email ?? "";
  const initials = email.slice(0, 2).toUpperCase();

  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Avatar */}
      <button className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium text-gray-800 truncate">
              {user.user_metadata?.full_name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
          </div>

          <button
            onClick={() => navigate("/account")}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Account settings
          </button>

          <button
            onClick={() => navigate("/pricing")}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Manage subscription
          </button>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/login");
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
