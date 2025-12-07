// backend/src/server.js
import app from "./app.js";

// Cloud Run always provides PORT env variable.
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
