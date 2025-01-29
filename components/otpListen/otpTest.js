import { useState, useEffect, useRef } from "react";

export default function OtpTest() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(null);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const socketRef = useRef(null);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        console.log("🔴 WebSocket Disconnected");
      }
    };
  }, []);

  const handleTestOtp = () => {
    if (!mobile.trim()) {
      setError("Please enter a valid mobile number.");
      return;
    }

    setError("");
    setOtp(null);
    setIsListening(true);
    setConnectionStatus("Connecting...");

    // Get WebSocket URL from .env or fallback to localhost
    const socketUrl =
      process.env.NEXT_PUBLIC_WS_URL || `wss://bagiclub.com/ws/otp/${mobile}`;

    console.log("🔗 Connecting to WebSocket:", socketUrl);

    // Ensure previous connection is closed
    if (socketRef.current) {
      socketRef.current.close();
    }

    // Create new WebSocket connection
    socketRef.current = new WebSocket(socketUrl);

    socketRef.current.onopen = () => {
      console.log("🟢 Connected to WebSocket Server");
      setConnectionStatus("Connected");
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.phone_number === mobile) {
          setOtp(data.otp);
          setIsListening(false);
          setConnectionStatus("Received OTP");
          socketRef.current.close();
        }
      } catch (err) {
        setError("Failed to parse OTP data.");
        setConnectionStatus("Error");
      }
    };

    socketRef.current.onerror = (err) => {
      console.error("⚠ WebSocket Error:", err);
      setError("WebSocket connection error.");
      setConnectionStatus("Error");
    };

    socketRef.current.onclose = () => {
      console.log("🔴 WebSocket Disconnected");
      setConnectionStatus("Disconnected");
    };
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-2">Test OTP via WebSocket</h2>

      <label className="block mb-2 font-medium">Enter Mobile Number:</label>
      <input
        type="text"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        className="border p-2 w-full rounded mb-4"
        placeholder="Enter your mobile number"
      />

      <button
        onClick={handleTestOtp}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        disabled={isListening}
      >
        {isListening ? "Listening for OTP..." : "Test OTP"}
      </button>

      {connectionStatus && (
        <p className="mt-2 text-sm">
          <strong>🔗 Status:</strong> {connectionStatus}
        </p>
      )}

      {otp && (
        <div className="mt-4 p-2 border rounded bg-green-100">
          <p className="text-lg font-bold">✅ OTP Received: {otp}</p>
        </div>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
