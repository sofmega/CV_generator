// backend/src/server.js
import app from "./app.js";
import { PORT } from "./config/env.js";

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
