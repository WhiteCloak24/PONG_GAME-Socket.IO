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

interface SipContextType {
  state: any;
  updatePos: (data: any) => void;
  opponentsPos: any;
  rooms: string[];
  joinRoom: (roomCode: string) => void;
}
export const SocketContext = createContext<SipContextType>({
  state: null,
  updatePos: () => null,
  opponentsPos: null,
  rooms: [],
  joinRoom: (roomCode: string) => null,
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<any>({ socket: null });
  const [opponentsPos, setOpponentsPos] = useState(null);
  const [rooms, setRooms] = useState<string[]>([]);
  useEffect(() => {
    makeConnection();
  }, []);
  console.log({ rooms });

  const getRoomInfo = (socket: Socket) => {
    socket.emit("get-room-info", null, (data: string[] | undefined) => {
      console.log("room-info", data);
      if (Array.isArray(data) && data?.length > 0) {
        setRooms(data);
      }
    });
  };

  interface SocketResponse {
    success: boolean;
    message: string;
    data: any;
  }

  const _joinRoom = (roomCode: string, socket: Socket) => {
    socket.emit("add-to-room", roomCode, (response: SocketResponse) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    });
  };

  const joinRoom = (roomCode: string) => {
    _joinRoom(roomCode, state.socket);
  };

  const initializeListeners = useCallback(
    (socket: Socket) => {
      if (socket) {
        socket.on("connect", () => {
          console.log("socket connected");
          setState({ socket });
          socket.on("get-pos", (data) => {
            setOpponentsPos(data);
          });
          socket.on("joined-room", (data) => {
            console.log("joined-room", data);
            getRoomInfo(socket);
          });
          getRoomInfo(socket);
          socket.on("disconnect", () => {});
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
      value={{ state, updatePos, opponentsPos, rooms, joinRoom }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
