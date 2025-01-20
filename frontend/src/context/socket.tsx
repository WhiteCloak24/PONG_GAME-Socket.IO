/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from 'socket.io-client';

interface SipContextType {
  state: any;
  updatePos: (data: any) => void;
}
export const SocketContext = createContext<SipContextType>({
  state: null,
  updatePos: () => null,
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<any>({ socket: null })
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
    setState((prev: any) => ({ ...prev, socket }))
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

  function updatePos(data: any) {
    if (state.socket) {
      state.socket.emit('update-pos', {
        data
      })
    }
  }
  return <SocketContext.Provider value={{ state, updatePos }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
export const useSocketContext = () => useContext(SocketContext);
