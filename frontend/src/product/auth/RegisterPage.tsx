// frontend/src/product/auth/RegisterPage.tsx
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Link } from "react-router-dom";
import GoogleIcon from "../../components/ui/icons/GoogleIcon";

export default function RegisterPage() {
  const { signUp, signInWithGoogle, error } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registered, setRegistered] = useState(false);

  async function handleRegister() {
    const success = await signUp(fullName, email, password);
    if (success) setRegistered(true);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {registered ? (
          <div className="text-center">
            <p className="text-green-600 font-medium mb-4">
              ✔ A confirmation email has been sent!
            </p>
            <p className="text-gray-600 mb-6">
              Please check your inbox and verify your email before logging in.
            </p>

            <Link to="/login" className="text-blue-600 underline font-medium">
              Go to Login
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <Input
              label="Full name"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

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

            <Button onClick={handleRegister}>Register</Button>

            <Button variant="secondary" onClick={signInWithGoogle}>
              <span className="flex items-center justify-center gap-2">
                <GoogleIcon />
                Continue with Google
              </span>
            </Button>

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link className="text-blue-600" to="/login">
                Login
              </Link>
            </p>

            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
        )}
      </Card>
    </div>
  );
}
