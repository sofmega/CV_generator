// frontend/src/api/feedbackApi.ts
import { API_BASE_URL, getAuthHeaders, request } from "../lib/api";

export async function sendFeedback(message: string, page?: string) {
  const headers = await getAuthHeaders();

  return request(`${API_BASE_URL}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ message, page }),
  });
}
