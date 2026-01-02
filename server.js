import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { geminiPredict } from "./gemini.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory queue
let queue = [];
const avgServiceTime = 5; // minutes

// ✅ Health check (VERY IMPORTANT FOR RENDER)
app.get("/", (req, res) => {
  res.send("Smart Queue Backend is running ✅");
});

// ✅ Join Queue API (POST ONLY)
app.post("/join", async (req, res) => {
  try {
    // Add user to queue
    queue.push({ id: Date.now() });

    // Call Gemini AI
    const aiResult = await geminiPredict(queue.length, avgServiceTime);

    // Always return safe values (NO undefined)
    res.json({
      position: queue.length,
      ai_wait_time: aiResult?.estimated_wait_time ?? 5,
      suggestion: aiResult?.staff_suggestion ?? "System running normally"
    });

  } catch (error) {
    console.error("JOIN ERROR:", error.message);

    // 🔒 Fallback response (frontend NEVER breaks)
    res.json({
      position: queue.length,
      ai_wait_time: 5,
      suggestion: "AI temporarily unavailable"
    });
  }
});

// ✅ Render requires PORT from environment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});







