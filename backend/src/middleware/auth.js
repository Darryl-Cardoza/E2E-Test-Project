const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function requireAuth(req, res, next) {
  const header = req.get("authorization") || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return res.status(401).json({ message: "Authentication required." });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: "Account no longer exists." });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Session is invalid or expired. Please sign in again." });
  }
}

module.exports = requireAuth;
