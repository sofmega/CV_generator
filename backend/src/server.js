// backend/src/server.js
import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`Backend running on port ${PORT}`);
});
