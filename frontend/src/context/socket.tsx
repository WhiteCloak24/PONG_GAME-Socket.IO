/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";
import { getUserId, setUserId } from "../utils/functions";

interface SipContextType {
  state: any;
  socketConnected: boolean;
  updatePos: (data: any) => void;
  opponentsPos: any;
  rooms: string[];
  joinRoom: (roomCode: string) => void;
  _sendMessageToRoom?: (message: string) => void;
  notifications?: string[];
  messages?: Message[];
  sendTypingEvent?: (typing: boolean) => void;
  usersTyping?: string[];
  exitRoom: (roomCode: string) => void;
  joiningRoom: boolean;
  leavingRoom: boolean;
}
export const SocketContext = createContext<SipContextType>({
  state: null,
  socketConnected: false,
  updatePos: () => null,
  opponentsPos: null,
  rooms: [],
  joinRoom: () => null,
  exitRoom: () => null,
  joiningRoom: false,
  leavingRoom: false,
});

interface Message {
  message: string;
  user: string;
}

interface UserInfo {
  firstName: string;
  lastName: string;
}
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<any>({ socket: null });
  const [opponentsPos, setOpponentsPos] = useState(null);
  const [rooms, setRooms] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [usersTyping, setUsersTyping] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [leavingRoom, setLeavingRoom] = useState(false);
  useEffect(() => {
    makeConnection();
  }, []);

  const getUserName = () => {
    return `${userInfo?.firstName} ${userInfo?.lastName}`;
  };

  const getRoomInfo = (socket: Socket) => {
    socket.emit("get-room-info", null, (data: string[] | undefined) => {
      console.log("room-info", data);
      if (Array.isArray(data) && data?.length > 0) {
        setRooms(data);
      }
    });
  };

  const sendTypingEvent = (typing: boolean = true) => {
    state?.socket?.emit("typing", typing);
  };

  const _getUserInfo = (socket: Socket) => {
    socket.emit("get-user-info", null, (user: any) => {
      setUserInfo(user);
      console.log({ user });
    });
  };

  const getUserInfo = (socket: Socket) => {
    _getUserInfo(socket);
  };

  const _sendMessageToRoom = (message: string) => {
    if (state?.socket) {
      state?.socket?.emit("send-message", message);
      return;
    }
  };

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

  const _joinRoom = (roomCode: string, socket: Socket) => {
    setJoiningRoom(true);
    socket.emit("add-to-room", roomCode, (response: SocketResponse) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      console.log("abc");
      setJoiningRoom(false);
    });
  };

  const joinRoom = (roomCode: string) => {
    _joinRoom(roomCode, state.socket);
  };

  const _exitRoom = (roomCode?: string) => {
    setLeavingRoom(true);
    state?.socket?.emit("leave-room", roomCode, (data: string[]) => {
      if (Array.isArray(data)) {
        setRooms(data);
      }
      setLeavingRoom(false);
    });
  };

  const exitRoom = (roomCode: string) => {
    if (roomCode && typeof roomCode === "string") {
      _exitRoom(roomCode);
    }
  };

  const initializeListeners = useCallback(
    (socket: Socket) => {
      if (socket) {
        socket.on("connect", () => {
          console.log("socket connected");
          setState({ socket });
          setSocketConnected(true);

          setTimeout(() => {
            
            socket.emit("set-user", getUserId(), (response: SocketResponse) => {
              if (response?.success) {
                const user = response?.data?.user as User;
                setUserId(user?.id);
                getRoomInfo(socket);
                getUserInfo(socket);
              }
            });
          }, 1000);

          socket.on("get-pos", (data) => {
            setOpponentsPos(data);
          });
          socket.on("joined-room", (data) => {
            console.log("joined-room", data);
            getRoomInfo(socket);
          });
          socket.on("new-message", (newMessage) => {
            console.log({ newMessage });
          });
          socket.on("messages", (messages) => {
            console.log({ messages });
            setMessages(messages);
          });
          socket.on("notifications", (notifications: string[]) => {
            console.log({ notifications });
            setNotifications([...notifications]);
          });
          socket.on("typing-list", (usersTyping: string[] = []) => {
            const username = getUserName();
            setUsersTyping(usersTyping?.filter((u) => u !== username));
          });

          socket.on("disconnect", () => {});
        });

        socket.on("disconnect", (reason) => {
          console.log("Disconnected from client", reason);
          setSocketConnected(false);
        });
      }
    },
    [setState]
  );

  const makeConnection = useCallback(() => {
    const socket = io("http://localhost:3001", {
      transports: ["websocket"],
    });
    initializeListeners(socket);
    setState((prev: any) => ({ ...prev, socket }));
  }, [setState, initializeListeners]);

  function updatePos(data: any) {
    if (state.socket) {
      state.socket.emit("update-pos", data);
    }
  }
  return (
    <SocketContext.Provider
      value={{
        state,
        socketConnected,
        updatePos,
        opponentsPos,
        rooms,
        joinRoom,
        _sendMessageToRoom,
        notifications,
        messages,
        sendTypingEvent,
        usersTyping,
        exitRoom,
        joiningRoom,
        leavingRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
