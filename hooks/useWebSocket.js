import { useEffect, useState, useRef } from "react";

export default function useWebSocket(phoneNumber) {
  const [otp, setOtp] = useState(null);
  const [error, setError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const socketRef = useRef(null);

  useEffect(() => {
    if (!phoneNumber) return;

    const socketUrl = `wss://bagiclub.com/ws/otp/${phoneNumber}`;
    socketRef.current = new WebSocket(socketUrl);

    socketRef.current.onopen = () => {
      console.log(`🟢 WebSocket Connected for ${phoneNumber}`);
      setConnectionStatus("Connected");
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.phone_number === phoneNumber) {
          setOtp(data.otp);
          console.log(`🔔 OTP Received for ${phoneNumber}: ${data.otp}`);
        }
      } catch (err) {
        console.error("Error parsing OTP:", err);
        setError("Failed to parse OTP data.");
      }
    };

    socketRef.current.onerror = (err) => {
      console.error("⚠ WebSocket Error:", err);
      setError("WebSocket connection error.");
    };

    socketRef.current.onclose = () => {
      console.log(`🔴 WebSocket Disconnected for ${phoneNumber}`);
      setConnectionStatus("Disconnected");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [phoneNumber]);

  return { otp, connectionStatus, error };
}
