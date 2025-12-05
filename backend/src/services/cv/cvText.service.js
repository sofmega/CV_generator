// backend/src/services/cv/cvText.service.js
import { createCVPrompt } from "./cvPrompt.service.js";
import client from "../openai/openaiClient.js";

export async function generateCVText(jobDescription, cvText) {
  const prompt = createCVPrompt(jobDescription, cvText);

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
  });

  return response.output[0].content[0].text.trim();
}

