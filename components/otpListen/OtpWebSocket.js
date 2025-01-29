import { useEffect, useState } from "react";

export default function OtpWebSocket({ mobile }) {
  const [otpData, setOtpData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Automatically use WebSocket URL from Vercel or .env
    const socketUrl =
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3000/api/socket";

    console.log("🔗 Connecting to WebSocket:", socketUrl);
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => console.log("🟢 Connected to WebSocket Server");

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.mobile === mobile) {
          setOtpData(data);
        }
      } catch (err) {
        setError("Failed to parse OTP data.");
      }
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket Error:", err);
      setError("WebSocket connection error.");
    };

    socket.onclose = () => console.log("🔴 WebSocket Disconnected");

    return () => {
      socket.close();
    };
  }, [mobile]);

  return (
    <div className="p-4 border rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-2">
        Listening for OTP for {mobile}...
      </h2>
      {otpData ? (
        <div className="p-2 border rounded bg-gray-100">
          <p>
            <strong>OTP:</strong> {otpData.otp}
          </p>
          <p>
            <strong>Received At:</strong> {otpData.received_at}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">Waiting for OTP...</p>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
