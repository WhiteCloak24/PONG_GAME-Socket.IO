import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { config } from "dotenv";
import { initializeSocket } from "./sockets";

config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);

initializeSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("HTTP server closed.");
  });
  io.close(() => {
    console.log("Socket.io server closed.");
  });
  process.exit(0);
});
