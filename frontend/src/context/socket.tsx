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
import { io, Socket } from "socket.io-client";

interface SipContextType {
  state: any;
  updatePos: (data: any) => void;
  opponentsPos: any;
}
export const SocketContext = createContext<SipContextType>({
  state: null,
  updatePos: () => null,
  opponentsPos: null,
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<any>({ socket: null });
  const [opponentsPos, setOpponentsPos] = useState(null);
  useEffect(() => {
    makeConnection();
  }, []);

  const initializeListeners = useCallback(
    (socket: Socket) => {
      if (socket) {
        socket.on("connect", () => {
          console.log("socket connected");
          setState({ socket });
          socket.emit("update-pos", JSON.stringify({ message: "test" }));
          socket.on("get-pos", (data) => {
            setOpponentsPos(data);
          });
          socket.on("disconnect", () => {});
        });
      }
    },
    [setState]
  );

  const makeConnection = useCallback(() => {
    const socket = io("http://localhost:3000", {
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
    <SocketContext.Provider value={{ state, updatePos, opponentsPos }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
