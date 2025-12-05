// backend/src/services/openai/openaiClient.js
import OpenAI from "openai";
import { OPENAI_API_KEY } from "../../config/env.js";

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export default client;
