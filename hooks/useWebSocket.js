import { useEffect, useState } from "react";

export default function useWebSocket(phoneNumber) {
  const [otp, setOtp] = useState(null);

  useEffect(() => {
    const wsUrl = `wss://bagiclub.com/ws/otp/${phoneNumber}`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.otp) {
        setOtp(data.otp);
      }
    };

    socket.onerror = (error) => console.error("WebSocket Error:", error);

    return () => {
      socket.close();
    };
  }, [phoneNumber]);

  return otp;
}
