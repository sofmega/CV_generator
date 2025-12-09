// frontend/src/lib/api.ts
import { supabase } from "./supabase";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

// -----------------------------------------------------------------------------
// Get ONLY the raw JWT token
// -----------------------------------------------------------------------------
export async function getJWT(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw new Error("Authentication error. Please log in again.");

  const token = data.session?.access_token;
  if (!token) throw new Error("Not authenticated.");

  return token;
}

// -----------------------------------------------------------------------------
// JSON API auth headers
// -----------------------------------------------------------------------------
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getJWT();

  return {
    Authorization: `Bearer ${token}`,
  };
}

// -----------------------------------------------------------------------------
// Strongly typed API error
// -----------------------------------------------------------------------------
export interface ApiError extends Error {
  status: number;
}

// -----------------------------------------------------------------------------
// Centralized request() wrapper
// -----------------------------------------------------------------------------
export async function request<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, options);

  // OK → return JSON or raw response
  if (res.ok) {
    const type = res.headers.get("Content-Type") || "";
    if (type.includes("application/json")) {
      return (await res.json()) as T;
    }
    return res as unknown as T;
  }

  // Default message
  let message = "An unexpected error occurred.";
  const status = res.status;

  switch (status) {
    case 400:
      message = "Invalid request. Check your inputs.";
      break;
    case 401:
      message = "Session expired. Please log in.";
      break;
    case 403:
      message = "You are not allowed to perform this action.";
      break;
    case 404:
      message = "Resource not found.";
      break;
    case 422:
      message = "Validation error. Please fix your inputs.";
      break;
    case 500:
      message = "Server error. Try again later.";
      break;
    default:
      break;
  }

  // Try reading backend error JSON safely
  try {
    const data = (await res.json()) as { error?: string };
    if (data?.error) message = data.error;
  } catch {
    // no backend JSON provided — ignore
  }

  const error: ApiError = Object.assign(new Error(message), { status });
  throw error;
}
