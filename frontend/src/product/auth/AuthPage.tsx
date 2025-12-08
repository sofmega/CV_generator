// frontend/src/product/auth/AuthPage.tsx
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function AuthPage() {
  const { signIn, signUp, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <Card className="w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6">Login / Signup</h2>

        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            value={email}
            placeholder="your@email.com"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button onClick={() => signIn(email, password)}>
            Login
          </Button>

          <Button variant="secondary" onClick={() => signUp(email, password)}>
            Create Account
          </Button>
        </div>

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </Card>
    </div>
  );
}
