// frontend/src/lib/api.ts
import { supabase } from "./supabase";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

// Get ONLY the raw JWT token
export async function getJWT(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw new Error("Authentication error. Please log in again.");

  const token = data.session?.access_token;
  if (!token) throw new Error("Not authenticated.");

  return token;
}

// JSON API auth headers
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getJWT();

  return {
    Authorization: `Bearer ${token}`,
  };
}
