import { Server, Socket } from "socket.io";
import { registerGameEvents } from "./game-events";
import randomName from "random-name";

const initializeSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);
    registerGameEvents(io, socket);
  });
};
export { initializeSocket };
