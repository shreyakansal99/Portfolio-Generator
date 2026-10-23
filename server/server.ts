import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db";
import authRoutes from "./src/routes/authRoutes";
import portfolioRoutes from "./src/routes/portfolioRoutes";
import publicRoutes from "./src/routes/publicRoutes";
import resumeRoutes from "./src/routes/resumeRoutes";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing in .env");
  process.exit(1);
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  message: { message: "Too many uploads. Please try again later." },
});

app.use(helmet());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/resume", uploadLimiter, resumeRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});