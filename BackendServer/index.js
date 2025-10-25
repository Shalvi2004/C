import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

//Initiasing App
const app = express();

app.use(helmet());
dotenv.config();


// Parse JSON bodies
app.use(express.json());

// Simple request logger to help debug incoming API calls
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Backend Server",
  });
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  })
);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`✅ Backend Server is running on port ${PORT}`);
});