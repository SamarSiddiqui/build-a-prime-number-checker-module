import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3001;

// 1. Create HTTP server serving index.html
const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, "public", "index.html");
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading index.html");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

// 2. Create WebSocketServer attached to the HTTP server
const wss = new WebSocketServer({ server });

// Helper to broadcast JSON messages to all connected clients
const broadcast = (data) => {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
};

// 3. Handle WebSocket connections
wss.on("connection", (socket, req) => {
  // 4. Parse username from query params and broadcast join message
  const urlParams = new URL(req.url, "http://localhost").searchParams;
  const username = urlParams.get("username") || "Anonymous";

  broadcast({ type: "system", text: `${username} joined` });

  // 5. Broadcast incoming chat messages
  socket.on("message", (data) => {
    try {
      const { username: msgUser, text } = JSON.parse(data);
      broadcast({ type: "chat", username: msgUser, text });
    } catch (e) {
      console.error("Invalid message format:", e);
    }
  });

  // 6. Broadcast leave message when client disconnects
  socket.on("close", () => {
    broadcast({ type: "system", text: `${username} left` });
  });
});

// 7. Start listening on PORT 3001
server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:3001`);
});
