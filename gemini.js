import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function geminiPredict(queueLength, avgServiceTime) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
You are a smart queue system.

Queue length: ${queueLength}
Average service time: ${avgServiceTime} minutes.

Return ONLY this JSON format and nothing else:
{
  "estimated_wait_time": 0,
  "priority_adjustment": "",
  "staff_suggestion": ""
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // SAFETY: extract JSON only
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}") + 1;

  return JSON.parse(text.slice(jsonStart, jsonEnd));
}

