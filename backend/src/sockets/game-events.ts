import { Server, Socket } from "socket.io";

const registerGameEvents = (io: Server, socket: Socket) => {
  socket.on("update-pos", (data) => {
    const rooms = socket.rooms;
    for (let room of rooms) {
      socket.to(room).emit("get-pos", data);
    }
  });

  const getRooms = () => {
    return Array.from(socket.rooms).slice(1);
  };

  socket.on("add-to-room", (roomCode: string, cb: CallableFunction) => {
    if (typeof roomCode === "string") {
      socket.join(roomCode);
      setTimeout(() => {
        socket.emit("joined-room", roomCode);
      }, 1000);
    } else {
      cb({ success: false, message: "Room Code is not string!" });
    }
  });

  socket.on("get-room-info", (data, cb) => {
    if (cb) cb(getRooms());
  });
};

export { registerGameEvents };
