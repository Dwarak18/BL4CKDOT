/* eslint-disable no-console */
const express = require("express");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");
const { WebSocketServer } = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws/terminal" });

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "bl4ckdot-express" });
});

wss.on("connection", (socket, req) => {
  const token = req.headers["sec-websocket-protocol"];
  if (!token) {
    socket.send("Unauthorized: missing token");
    socket.close();
    return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || "dev_only_change_me");
  } catch {
    socket.send("Unauthorized: invalid token");
    socket.close();
    return;
  }

  socket.send("Secure terminal tunnel ready. Attach node-pty + Docker sandbox for production.");

  socket.on("message", (raw) => {
    const input = String(raw || "").trim();
    // Intentionally sandboxed placeholder: production should route to node-pty in isolated container.
    socket.send(`echo> ${input}`);
  });
});

const port = Number(process.env.EXPRESS_PORT || 4000);
server.listen(port, () => {
  console.log(`BL4CKDOT Express backend listening on :${port}`);
});
