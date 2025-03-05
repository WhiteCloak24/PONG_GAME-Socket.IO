import { Server, Socket } from "socket.io";
import randomName from "random-name";

const roomInfo: {
  [room_code: string]: {
    notifications: string[];
    messages: any[];
  };
} = {};

const users: { [socket_id: string]: { firstName: string; lastName: string } } =
  {};

const registerGameEvents = (io: Server, socket: Socket) => {
  users[socket.id] = {
    firstName: randomName.first(),
    lastName: randomName.last(),
  };

  const getRooms = () => {
    return Array.from(socket.rooms).slice(1);
  };

  const getMyRoomCode = () => {
    const rooms = getRooms();
    return rooms?.length > 0 ? rooms[0] : null;
  };

  const getRoomInfo = (roomCode: string) => {
    return roomInfo[roomCode];
  };

  const getUserName = () => {
    const user = users[socket.id];
    return `${user.firstName} ${user.lastName}`;
  };

  const sendNotifications = () => {
    io.to(getMyRoomCode()).emit(
      "notifications",
      getRoomInfo(getMyRoomCode())?.notifications
    );
  };

  socket.on("get-user-info", (_, cb) => {
    cb(users[socket.id]);
  });

  socket.on("update-pos", (data) => {
    const rooms = socket.rooms;
    for (let room of rooms) {
      socket.to(room).emit("get-pos", data);
    }
  });

  socket.on("add-to-room", (roomCode: string, cb: CallableFunction) => {
    if (typeof roomCode === "string") {
      socket.join(roomCode);
      setTimeout(() => {
        socket.emit("joined-room", roomCode);
        if (!roomInfo[roomCode]) {
          roomInfo[roomCode] = {
            messages: [],
            notifications: [],
          };
        }
        const myRoom = getRoomInfo(getMyRoomCode());
        myRoom?.notifications?.push(`${getUserName()} joined room ${roomCode}`);
        sendNotifications();
      }, 1000);
    } else {
      cb({ success: false, message: "Room Code is not string!" });
    }
  });

  socket.on("send-message", (message: string) => {
    const roomCode = getMyRoomCode();
    if (roomCode) {
      const newMessage = {
        message,
        user: getUserName(),
      };
      const room = roomInfo[getMyRoomCode()];
      room?.messages?.push(newMessage);
      io.to(roomCode).emit("messages", room.messages);
    }
  });

  socket.on("get-room-info", (data, cb) => {
    if (cb) cb(getRooms());
  });
};

export { registerGameEvents };
