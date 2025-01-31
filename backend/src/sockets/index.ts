import { Server, Socket } from "socket.io";
import { registerGameEvents } from "./game-events";

const initializeSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);
    registerGameEvents(io, socket);
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};
export { initializeSocket };
