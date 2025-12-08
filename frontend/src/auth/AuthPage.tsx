import { useState } from "react";
import { useAuth } from "./useAuth";

export default function AuthPage() {
  const { signIn, signUp, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{ padding: 40 }}>
      <h1>Login / Signup</h1>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={() => signIn(email, password)}>Login</button>
      <button onClick={() => signUp(email, password)}>Create Account</button>

      {error && <p>{error}</p>}
    </div>
  );
}
