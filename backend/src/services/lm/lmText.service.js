// backend/src/services/lm/lmText.service.js
import { createLMPrompt } from "./lmPrompt.service.js";
import { client } from "../openai/openaiClient.js";

export async function generateLMText(jobDescription, cvText) {
  const prompt = createLMPrompt(jobDescription, cvText);

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
  });

  return response.output[0].content[0].text.trim();
}
