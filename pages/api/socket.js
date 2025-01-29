import { WebSocketServer } from "ws";

export default function handler(req, res) {
  if (!res.socket.server.wss) {
    console.log("🚀 Setting up WebSocket Server...");

    const wss = new WebSocketServer({ noServer: true });

    res.socket.server.on("upgrade", (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    });

    wss.on("connection", (ws) => {
      console.log("🟢 New WebSocket Client Connected");

      ws.on("message", (message) => {
        console.log("📩 Received:", message);
        ws.send(`Echo: ${message}`);
      });

      ws.on("close", () => console.log("🔴 WebSocket Client Disconnected"));

      // Keep WebSocket alive
      const keepAlive = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
          ws.ping();
        } else {
          clearInterval(keepAlive);
        }
      }, 5000);
    });

    res.socket.server.wss = wss;
  }

  res.end(); // Close response to prevent Next.js from handling it as an API request
}
