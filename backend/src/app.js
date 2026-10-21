const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth");

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "10kb" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: "draft-7", legacyHeaders: false }), authRoutes);
app.use((error, _req, res, _next) => {
  if (error.code === 11000) return res.status(409).json({ message: "An account with this email already exists." });
  if (error.type === "entity.parse.failed") return res.status(400).json({ message: "Request body must be valid JSON." });
  console.error(error);
  return res.status(500).json({ message: "Something went wrong. Please try again." });
});

module.exports = app;
