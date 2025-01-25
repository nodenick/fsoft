// components/SendOTP.js
import { baseUrl } from "../utils/baseUrl";

async function sendOTP(sendOtpBody) {
  const sendOtpEndpoint = `${baseUrl}/api/v1/send-otp`;
  const response = await fetch(sendOtpEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sendOtpBody),
  });

  if (!response.ok) {
    throw new Error(`Send OTP failed! status: ${response.status}`);
  }

  return await response.json();
}

export default sendOTP;
