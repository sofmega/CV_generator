import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import { sendFeedback } from "../../api/feedbackApi";

export default function FeedbackPage() {
  const { user } = useAuthContext();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Please log in to send feedback.
      </div>
    );
  }

  const handleSend = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setSent(false);

    try {
      await sendFeedback(message, window.location.pathname);
      setMessage("");
      setSent(true);
    } catch{
      setError("Failed to send feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 py-10">
      <Card className="w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Send Feedback</h1>

        <Textarea
          label="Your message"
          placeholder="Write your feedback here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="h-40"
        />

        <Button className="mt-4" onClick={handleSend} loading={loading}>
          Send
        </Button>

        {sent && (
          <p className="text-green-600 text-sm mt-3">
            ✅ Feedback sent. Thank you!
          </p>
        )}

        {error && (
          <p className="text-red-600 text-sm mt-3">
            {error}
          </p>
        )}
      </Card>
    </div>
  );
}
