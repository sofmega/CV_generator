// frontend/src/product/account/AccountPage.tsx
import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function AccountPage() {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
  if (!loading && !user) {
    navigate("/login");
  }
}, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  // ✅ From here, user is guaranteed (TS will know)
  const email = user.email ?? "";

  async function handlePasswordChange() {
    setError(null);
    setMessage(null);

    if (!email) {
      setError("Missing account email. Please log in again.");
      return;
    }

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setUpdating(true);

    // 1) Re-authenticate (verify old password)
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (reauthError) {
      setUpdating(false);
      setError("Current password is incorrect.");
      return;
    }

    // 2) Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setUpdating(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("Password updated successfully.");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Account settings</h1>

        <Card>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-500">Full name</p>
              <p className="font-medium text-gray-900">
                {user.user_metadata?.full_name || "—"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Change password</h2>

          <div className="max-w-sm space-y-4">
            <Input
              label="Current password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <Input
              label="New password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Input
              label="Confirm new password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button loading={updating} onClick={handlePasswordChange}>
              Update password
            </Button>

            {message && <p className="text-green-600 text-sm">{message}</p>}
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
