// backend/src/controllers/feedback.controller.js
import { saveFeedback } from "../services/feedback/feedback.service.js";
import { logger } from "../config/logger.js";

export async function createFeedbackController(req, res, next) {
  try {
    const { message, page } = req.body;

    if (!message || !message.trim()) {
      const error = new Error("message is required");
      error.status = 400;
      throw error;
    }

    const userId = req.user.id;
    const userEmail = req.user.email ?? "unknown";

    await saveFeedback({
      userId,
      userEmail,
      message: message.trim(),
      page,
    });

    return res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Feedback creation failed");
    next(err);
  }
}
