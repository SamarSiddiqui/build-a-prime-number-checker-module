const express = require("express")
const app = express();
const port = 3000;

app.get("/", (_req, res) => {
  res.send("Welcome to Camper Bot's homepage!");
});

app.get("/hobbies", (_req, res) => {
  res.send("I cycle, go boating, and play guitar.");
});

app.get("/skills", (_req, res) => {
  res.send("JavaScript, Node.js, and Express.js!");
});

app.get("/api/profile", (_req, res) => {
  res.json({
    name: "Camper Bot",
    hobbies: ["cycling", "boating", "guitar"],
    skills: ["JavaScript", "Node.js", "Express.js"]
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
