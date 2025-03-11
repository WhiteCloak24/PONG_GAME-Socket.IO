import { Server, Socket } from "socket.io";
import randomName from "random-name";

const roomInfo: {
  [room_code: string]: {
    notifications: string[];
    messages: any[];
  };
} = {};

interface SocketResponse {
  success: boolean;
  message: string;
  data: any;
}

interface User {
  firstName: string;
  lastName: string;
  id: string;
}

const users: {
  [userId: string]: User;
} = {};
let usersTyping = [];

const registerGameEvents = (io: Server, socket: Socket) => {
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
    return user ? `${user?.firstName} ${user?.lastName}` : "";
  };

  const sendNotifications = () => {
    io.to(getMyRoomCode()).emit(
      "notifications",
      getRoomInfo(getMyRoomCode())?.notifications
    );
  };

  const sendTypingUsers = () => {
    socket.to(getMyRoomCode()).emit("typing-list", usersTyping);
  };

  const createUser = () => {
    return {
      firstName: randomName.first(),
      lastName: randomName.last(),
    };
  };

  socket.on(
    "set-user",
    (userId: string, cb: (user: SocketResponse) => void = () => null) => {
      console.log(userId, users);
      if (userId) {
        if (users[userId]) {
        } else {
          users[userId] = { ...createUser(), id: userId };
        }
        cb({
          success: true,
          message: "",
          data: {
            user: users[userId],
          },
        });
      } else {
        users[socket.id] = { ...createUser(), id: socket.id };
        cb({
          success: true,
          message: "",
          data: {
            user: users[socket.id],
          },
        });
      }
    }
  );

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
        myRoom?.notifications?.push(`${getUserName()} joined room`);
        cb({ success: false, message: `${getUserName()} joined room` });
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

  socket.on("typing", (data) => {
    const username = getUserName();
    if (data) usersTyping = [...usersTyping, username];
    else usersTyping = usersTyping.filter((u) => u != username);
    sendTypingUsers();
  });

  socket.on("get-room-info", (data, cb) => {
    if (cb) cb(getRooms());
  });

  socket.on("leave-room", async (room: string = getMyRoomCode(), cb) => {
    const username = getUserName();
    delete users[socket.id];

    const myRoom = getRoomInfo(room);
    myRoom?.notifications?.push(`${username} left room!`);

    sendNotifications();
    await socket.leave(room);
    cb(getRooms());
  });

  socket.on("disconnecting", () => {
    const username = getUserName();
    delete users[socket.id];

    const myRoom = getRoomInfo(getMyRoomCode());
    myRoom?.notifications?.push(`${username} disconnected!`);
    sendNotifications();

    usersTyping = usersTyping.filter((u) => u != username);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
};

export { registerGameEvents };
