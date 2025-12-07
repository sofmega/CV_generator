# ========== 1. Base image ==========
FROM node:20-slim

# ========== 2. Set working directory ==========
WORKDIR /app

# ========== 3. Copy package files ==========
COPY package*.json ./

# === Install only production dependencies ===
RUN npm install --omit=dev

# ========== 4. Copy source files ==========
COPY . .

# ========== 5. Expose the port Cloud Run listens on ==========
ENV PORT=8080

# ========== 6. Start the app ==========
CMD ["node", "src/server.js"]
