require("dotenv").config();
const app = require("./app");
const connectDatabase = require("./config/database");

const port = Number(process.env.PORT) || 5000;
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required. Set it in backend/.env.");
connectDatabase().then(() => app.listen(port, () => console.log(`API listening on http://localhost:${port}`))).catch(error => { console.error("Failed to start API:", error.message); process.exit(1); });
