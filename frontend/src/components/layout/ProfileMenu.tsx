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
  const rootRef = useRef<HTMLDivElement | null>(null);

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
    }, 120);
  };

  // Close on outside click
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!open) return;
      const target = e.target as Node | null;

      if (rootRef.current && target && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      clearCloseTimer();
    };
  }, [open]);

  // early return AFTER hooks
  if (!user) return null;

  const email = user.email ?? "";
  const initials = (email.slice(0, 2) || "U").toUpperCase();
  const fullName = user.user_metadata?.full_name || "User";

  const avatarUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    user.user_metadata?.avatar;

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenuWithDelay}
    >
      {/* Avatar button */}
      <button
        type="button"
        className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 text-gray-700 flex items-center justify-center font-semibold ring-1 ring-gray-200 shadow-sm hover:shadow transition"
        onClick={() => setOpen((v) => !v)}
        onFocus={openMenu}
        onBlur={closeMenuWithDelay}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          initials
        )}
      </button>

      {/* Dropdown (animated, not conditional) */}
      <div
        className={[
          "absolute right-0 mt-3 w-64 origin-top-right z-50",
          "transition-all duration-150 ease-out",
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none",
        ].join(" ")}
        role="menu"
      >
        <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {fullName}
            </p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
          </div>

          {/* Itemss */}
          <div className="p-2">
            <button
              onClick={() => go("/account")}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
              role="menuitem"
            >
              Account settings
            </button>

            <button
              onClick={() => go("/pricing")}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
              role="menuitem"
            >
              Manage subscription
            </button>

            {/* Feedback added */}
            <button
              onClick={() => go("/feedback")}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
              role="menuitem"
            >
              Feedback
            </button>

            <div className="my-2 h-px bg-gray-100" />

            <button
              onClick={async () => {
                setOpen(false);
                await supabase.auth.signOut();
                navigate("/login");
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition"
              role="menuitem"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
