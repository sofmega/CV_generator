// src/context/AuthContext.ts
import { createContext } from "react";
import type { User } from "@supabase/supabase-js";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Only export the context (no components here)
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});
