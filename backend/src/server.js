
import express from "express";
import "dotenv/config";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectToDb } from "./lib/db.js";

import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : null,
].filter(Boolean);

// ---------- CORS ----------

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Origin not allowed by CORS")
      );
    },
    credentials: true,
  })
);

// ---------- Middleware ----------

app.use(express.json());
app.use(cookieParser());

// ---------- Health Check ----------

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Streamify backend is running",
  });
});

// ---------- Database Initialization ----------

app.use("/api", async (_req, res, next) => {
  try {
    await connectToDb();
    next();
  } catch (error) {
    console.error("Database initialization failed:", error);

    res.status(503).json({
      success: false,
      message: "Database temporarily unavailable",
    });
  }
});

// ---------- API Routes ----------

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// ---------- Export Express App ----------

export default app;

// ---------- Local Development ----------

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  connectToDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(
          `Streamify server running on port ${PORT}`
        );
      });
    })
    .catch((error) => {
      console.error("Server startup failed:", error);
      process.exitCode = 1;
    });
}
