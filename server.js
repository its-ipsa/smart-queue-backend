import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { geminiPredict } from "./gemini.js";

dotenv.config();




const app = express();
app.use(cors());
app.use(express.json());

app.post("/join", async (req, res) => {
  try {
    queue.push({ id: Date.now() });

    const aiResult = await geminiPredict(queue.length, avgServiceTime);

    res.json({
      position: queue.length,
      ai_wait_time: aiResult.estimated_wait_time ?? 5,
      suggestion: aiResult.staff_suggestion ?? "System running normally"
    });

  } catch (error) {
    console.error("JOIN ERROR:", error.message);
    res.json({
      position: queue.length,
      ai_wait_time: 5,
      suggestion: "AI temporarily unavailable"
    });
  }
});


app.post("/serve", (req, res) => {
  queue.shift();
  res.json({ message: "User served" });
});
app.get("/", (req, res) => {
  res.send("Smart Queue Backend is running ✅");
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});






