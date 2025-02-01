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
      setError("❌ Please enter a valid mobile number.");
      return;
    }

    setError("");
    setOtp(null);
    setIsListening(true);
    setConnectionStatus("Connecting...");

    // Update the WebSocket URL if needed
    const socketUrl = `wss://bagiclub.com/ws/otp/${mobile}`;
    console.log("🔗 Connecting to WebSocket:", socketUrl);

    if (socketRef.current) {
      socketRef.current.close();
    }

    socketRef.current = new WebSocket(socketUrl);

    socketRef.current.onopen = () => {
      console.log("🟢 Connected to WebSocket Server");
      setConnectionStatus("Connected");
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("🔔 OTP Received:", data);

        if (data.phone_number === mobile) {
          setOtp(data.otp);
          setIsListening(false);
          setConnectionStatus("✅ OTP Received");
          socketRef.current.close(); // Close WebSocket after receiving OTP
        }
      } catch (err) {
        setError("❌ Failed to parse OTP data.");
        console.error("Parsing Error:", err);
        setConnectionStatus("Error");
      }
    };

    socketRef.current.onerror = (err) => {
      console.error("⚠ WebSocket Error:", err);
      setError("❌ WebSocket connection error.");
      setConnectionStatus("Error");
    };

    socketRef.current.onclose = (event) => {
      console.log("🔴 WebSocket Disconnected (Code:", event.code, ")");
      if (!otp) {
        setConnectionStatus("Disconnected - No OTP Received");
      }
    };
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
      {/* <label className="block text-sm font-medium text-gray-700 mb-1">
        Enter Mobile Number:
      </label> */}
      <input
        type="text"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        placeholder="Enter your mobile number"
      />

      <button
        onClick={handleTestOtp}
        className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors duration-300 ${
          isListening
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={isListening}
      >
        {isListening ? "Listening for OTP..." : "Test OTP"}
      </button>

      {connectionStatus && (
        <p className="mt-3 text-sm text-gray-600">
          <strong>Status:</strong> {connectionStatus}
        </p>
      )}

      {otp && (
        <div className="mt-4 p-4 border border-green-300 rounded-md bg-green-50">
          <p className="text-xl font-bold text-green-700">
            OTP Received: {otp}
          </p>
        </div>
      )}

      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
}
