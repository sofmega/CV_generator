// src/product/generator/components/AuthRequiredModal.tsx
import { useEffect, useState } from "react";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import GoogleIcon from "../../../components/ui/icons/GoogleIcon";
import { supabase } from "../../../lib/supabase";

type Mode = "login" | "register";

type Props = {
  open: boolean;
  onClose: () => void;
  onAuthed?: () => void; // called after successful login
};

export default function AuthRequiredModal({ open, onClose, onAuthed }: Props) {
  const [mode, setMode] = useState<Mode>("login");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Close on ESC + lock scroll (this is an "external system" effect → OK)
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  // Reset messages ONLY from user actions (no setState in effects)
  const resetNotices = () => {
    setError(null);
    setMessage(null);
  };

  const close = () => {
    resetNotices();
    onClose();
  };

  const switchMode = (m: Mode) => {
    resetNotices();
    setMode(m);
  };

  if (!open) return null;

  const cleanEmail = email.trim();
  const cleanName = fullName.trim();

  async function handleLogin() {
    resetNotices();

    if (!cleanEmail) return setError("Please enter your email.");
    if (!password) return setError("Please enter your password.");

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });
    setLoading(false);

    if (error) return setError(error.message);

    close();
    onAuthed?.();
  }

  async function handleRegister() {
    resetNotices();

    if (!cleanEmail) return setError("Please enter your email.");
    if (!password) return setError("Please enter your password.");

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: cleanName ? { full_name: cleanName } : undefined,
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    setLoading(false);

    if (error) return setError(error.message);

    setMessage(
      "✔ A confirmation email has been sent. Please verify your email, then log in."
    );
    // Switch to login tab after signup success
    setMode("login");
  }

  async function handleGoogle() {
    resetNotices();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) setError(error.message);
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={close}
        aria-label="Close"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md">
        <Card className="p-6 rounded-3xl shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                You’re not authenticated
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Please log in or create an account to upload your resume.
              </p>
            </div>

            <button
              type="button"
              onClick={close}
              className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={[
                "flex-1 rounded-xl px-3 py-2 text-sm font-semibold border",
                mode === "login"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
              ].join(" ")}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={[
                "flex-1 rounded-xl px-3 py-2 text-sm font-semibold border",
                mode === "register"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
              ].join(" ")}
            >
              Register
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {mode === "register" && (
              <Input
                label="Full name (optional)"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            )}

            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {message && <p className="text-green-600 text-sm">{message}</p>}
            {error && <p className="text-red-600 text-sm">{error}</p>}

           <div className="flex gap-3">
  {mode === "login" ? (
    <Button
      onClick={handleLogin}
      loading={loading}
      className="flex-1"
    >
      Login
    </Button>
  ) : (
    <Button
      onClick={handleRegister}
      loading={loading}
      className="flex-1"
    >
      Create account
    </Button>
  )}

  <Button
    variant="secondary"
    onClick={handleGoogle}
    className="flex-1"
  >
    <span className="flex items-center justify-center gap-2">
      <GoogleIcon />
      Google
    </span>
  </Button>
</div>

          </div>
        </Card>
      </div>
    </div>
  );
}
