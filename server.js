import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { geminiPredict } from "./gemini.js";

dotenv.config();




const app = express();
app.use(cors());
app.use(express.json());

let queue = [];
let avgServiceTime = 5;

app.post("/join", async (req, res) => {
  try {
    queue.push({ id: Date.now() });
    const aiResult = await geminiPredict(queue.length, avgServiceTime);

    res.json({
      position: queue.length,
      ai_wait_time: aiResult.estimated_wait_time,
      priority: aiResult.priority_adjustment,
      suggestion: aiResult.staff_suggestion
    });
  } catch (err) {
    res.status(500).json({ error: "Gemini error" });
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




