import { Server, Socket } from "socket.io";

const registerGameEvents = (io: Server, socket: Socket) => {
  socket.on("update-pos", (data) => {
    console.log({ data });

    socket.broadcast.emit("get-pos", data);
  });
};

export { registerGameEvents };
