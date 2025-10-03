"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { socketUrl } from "@/constants/env";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      
      if (socketRef.current) {
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
        socketRef.current.off("connect_error");
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
  
      if (user) {
        try {
          const token = await user.getIdToken();
          socketRef.current = io(socketUrl, {
            auth: {
              token,
              user_id: user.uid,
              email: user.email,
            },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
          });

          socketRef.current.on("connect", () => {
            console.log("Socket connected:", socketRef.current?.id);
            setIsConnected(true);
          });

          socketRef.current.on("disconnect", () => {
            console.log("Socket disconnected");
            setIsConnected(false);
          });

          socketRef.current.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
            setIsConnected(false);
          });
        } catch (error) {
          console.error("Failed to get Firebase token:", error);
        }
      }
    });

    return () => {
      unsubscribe();
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
