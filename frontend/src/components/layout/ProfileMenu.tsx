// frontend/src/components/layout/ProfileMenu.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function ProfileMenu() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const closeMenuWithDelay = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, 100);
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  //  early return AFTER hooks
  if (!user) return null;

  const email = user.email ?? "";
  const initials = email.slice(0, 2).toUpperCase();
  const avatarUrl =
  user.user_metadata?.avatar_url ||
  user.user_metadata?.picture ||
  user.user_metadata?.avatar;

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenuWithDelay}
    >
      <button
        type="button"
        className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 text-white flex items-center justify-center font-semibold"
        onFocus={openMenu}
        onBlur={closeMenuWithDelay}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {avatarUrl ? (
          <img
  src={avatarUrl}
  alt="avatar"
  className="block w-full h-full object-cover"
  referrerPolicy="no-referrer"
/>

        ) : (
          initials
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50"
          role="menu"
        >
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium text-gray-800 truncate">
              {user.user_metadata?.full_name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
          </div>

          <button
            onClick={() => navigate("/account")}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            role="menuitem"
          >
            Account settings
          </button>

          <button
            onClick={() => navigate("/pricing")}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            role="menuitem"
          >
            Manage subscription
          </button>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/login");
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            role="menuitem"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
