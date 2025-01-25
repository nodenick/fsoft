// components/VerifyOTP.js
import { baseUrl } from "../utils/baseUrl";

async function verifyOTP(otpCode, verifyOtpBody) {
  const verifyOtpEndpoint = `${baseUrl}/api/v1/verify-otp`;
  verifyOtpBody.otp = otpCode; // Assuming your verifyOtpBody needs the OTP code inserted
  verifyOtpBody.info[0].otp = otpCode;

  const response = await fetch(verifyOtpEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(verifyOtpBody),
  });

  if (!response.ok) {
    throw new Error(`Verify OTP failed! status: ${response.status}`);
  }

  return await response.json();
}

export default verifyOTP;
