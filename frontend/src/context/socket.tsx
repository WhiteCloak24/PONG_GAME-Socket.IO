/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from 'socket.io-client';

interface SipContextType {
  state: any;
}
export const SocketContext = createContext<SipContextType>({
  state: null,
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState({})
  useEffect(() => {
    makeConnection();
  }, []);



  const makeConnection = useCallback(() => {
    const socket = io('http://localhost:4000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 99999,
      transports: ["websocket"],
    });
    initializeListeners(socket);
  }, []);

  const initializeListeners = useCallback((socket: Socket) => {
    if (socket) {
      socket.on("connect", () => {
        console.log('socket connected');
        setState({})
        socket.on("disconnect", () => { });
      });
    }
  }, []);

  return <SocketContext.Provider value={{ state }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
export const useSocketContext = () => useContext(SocketContext);
