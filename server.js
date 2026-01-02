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

app.post("/join", (req, res) => {
  queue.push({ id: Date.now() });

  res.json({
    position: queue.length,
    ai_wait_time: 5,
    suggestion: "Backend response verified"
  });
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





