import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from './database/db.js';
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import verificationRoutes from "./routes/verification.route.js";
import privateChatRoutes from './routes/privateChat.routes.js';

const app = express();

app.use(helmet());
app.use(cookieParser());
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Backend Server" });
});

const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: This origin is not allowed'));
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    maxAge: 86400,
  })
);

app.use("/api/v1/user", userRoutes);
app.use("/api/v1", chatRoutes);
app.use("/api/v1/verification", verificationRoutes);
app.use('/api/v1', privateChatRoutes);

const PORT = process.env.PORT;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Backend Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Server startup aborted due to DB connection failure');
    process.exit(1);
  }
})();