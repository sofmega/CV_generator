// backend/src/middleware/requestId.js
import { v4 as uuidv4 } from "uuid";

/**
 * Attach a unique requestId to every incoming HTTP request.
 */
export function requestId(req, res, next) {
  // Allow clients to send their own requestId (optional)
  const incomingId = req.headers["x-request-id"];

  req.id = incomingId || uuidv4(); 
  res.setHeader("x-request-id", req.id);

  next();
}
