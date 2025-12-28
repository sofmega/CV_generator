//  frontend/src/components/layout/FeedbackFloatingButton.tsx
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function FeedbackFloatingButton() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  if (!user) return null;

  return (
    <button
      onClick={() => navigate("/feedback")}
      className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition"
    >
      Feedback
    </button>
  );
}
