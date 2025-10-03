"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const testToken =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6ImU4MWYwNTJhZWYwNDBhOTdjMzlkMjY1MzgxZGU2Y2I0MzRiYzM1ZjMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdGVzdGxvZ2luLTY4YjgwIiwiYXVkIjoidGVzdGxvZ2luLTY4YjgwIiwiYXV0aF90aW1lIjoxNzU5NDU3MzY3LCJ1c2VyX2lkIjoiSHFiSHBnN3JHZ1NwTTg1Y3c0ZU5yY2lESUVUMiIsInN1YiI6IkhxYkhwZzdyR2dTcE04NWN3NGVOcmNpRElFVDIiLCJpYXQiOjE3NTk0NjQxMjksImV4cCI6MTc1OTQ2NzcyOSwiZW1haWwiOiJsb3Vpc2x1b0BhcS5ncm91cCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV9udW1iZXIiOiIrODg2OTY3ODk2NjY5IiwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExNDY5MDczNTY3MTI1NDUyMzUwNSJdLCJlbWFpbCI6WyJsb3Vpc2x1b0BhcS5ncm91cCJdLCJwaG9uZSI6WyIrODg2OTY3ODk2NjY5Il19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.oKDwejxiUmtcmnQIwz40bmvuqbp_iWn80saaK2bE7H9eMvkOIE4FV9QNAcPn0OFog5cG9DhRgpOBbqD8IO7Zb_1s4vulS6UqoHLt-ISEjstQbgVjBBu3TjQYHRdECh5Mlo7CwZhBl7Pt4Dpyx_owxX79ukURAZaaQ7mKwMxDtIie_X20FN6yfMnMSwR0V6OoRMvOk_0xFXoLYsEYPyCTZgXkiRZI2l7mwfWlmztzgH5cq6lN_556FqUiIBtR1mmNsB7ns1ReIAoNRW2TPn20fcpa7sUsCPmOhjK2cjnpNDbj4oLhtue8QWzcId4LMJ_8GHLpRYA9UsGUvwBeekCpYg";
const testUserId = "114690735671254523505";
const testEmail = "louisluo@aq.group";
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io("http://16.163.136.105", {
      auth: {
        token: testToken,
        user_id: testUserId,
        email: testEmail,
        test_mode: true,
      },
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
