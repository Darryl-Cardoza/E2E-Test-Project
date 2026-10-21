const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const requireAuth = require("../middleware/auth");

const router = express.Router();

function makeToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, { subject: userId.toString(), expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
}

function publicUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email, createdAt: user.createdAt };
}

router.post("/register", async (req, res, next) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    if (name.length < 2 || name.length > 60) return res.status(400).json({ message: "Name must be between 2 and 60 characters." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return res.status(400).json({ message: "Enter a valid email address." });
    if (password.length < 8 || password.length > 72) return res.status(400).json({ message: "Password must be between 8 and 72 characters." });
    if (await User.exists({ email })) return res.status(409).json({ message: "An account with this email already exists." });
    const user = await User.create({ name, email, password });
    return res.status(201).json({ token: makeToken(user._id), user: publicUser(user) });
  } catch (error) { next(error); }
});

router.post("/login", async (req, res, next) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: "Email or password is incorrect." });
    return res.json({ token: makeToken(user._id), user: publicUser(user) });
  } catch (error) { next(error); }
});

router.get("/me", requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

module.exports = router;
