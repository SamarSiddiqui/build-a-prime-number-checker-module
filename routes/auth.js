import express from "express";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersPath = path.resolve(__dirname, "../data/users.json");

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
  const user = users.find((u) => u.username === username);

  // Check _password property from users.json
  const userPassword = user ? (user._password || user.password) : null;

  if (!user || userPassword !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const secret = process.env.JWT_SECRET || "secret";

  const token = jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role 
    },
    secret
  );

  return res.status(200).json({ token });
});

export default router;