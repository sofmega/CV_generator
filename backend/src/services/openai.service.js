// backend/src/services/openai.service.js
import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config/env.js";

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function generateText({ jobDescription, cvText, type }) {
  try {
    const prompt = `
You are an expert HR assistant.
Type requested: ${type}.

Job offer:
${jobDescription}

Candidate CV:
${cvText || "No CV provided"}

Generate the best tailored ${type}.
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    return response.output[0].content[0].text; // extract text
  } catch (err) {
    console.error("OpenAI generation error:", err);
    throw new Error("Failed to generate text");
  }
}
