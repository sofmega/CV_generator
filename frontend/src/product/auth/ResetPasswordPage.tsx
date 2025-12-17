// frontend/src/product/auth/ResetPasswordPage.tsx
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);

    // Redirect after short delay
    setTimeout(() => {
      navigate("/");
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Reset your password
        </h2>

        {success ? (
          <p className="text-green-600 text-center">
            Password updated successfully. Redirecting…
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <Input
              label="New password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              label="Confirm new password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button loading={loading} onClick={handleReset}>
              Update password
            </Button>

            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        )}
      </Card>
    </div>
  );
}
