import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function geminiPredict(queueLength, avgServiceTime) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
You are an AI-powered smart queue system.

Queue length: ${queueLength}
Average service time: ${avgServiceTime} minutes.

Respond ONLY in valid JSON:
{
  "estimated_wait_time": number,
  "priority_adjustment": string,
  "staff_suggestion": string
}
`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
