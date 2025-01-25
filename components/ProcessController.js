// components/ProcessController.js
import { useState } from "react";
import { callApi } from "../services/api";
import sendOtpBody from "../request-bodies/send-otp.json";
import verifyOtpBody from "../request-bodies/verify-otp.json";
import generateSlotTimeBody from "../request-bodies/appointment-time.json";
import payInvoiceBody from "../request-bodies/pay-now.json";

function ProcessController() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const startProcess = async () => {
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      // 1. Send OTP
      const sendOtpData = await callApi(
        `${baseUrl}/api/v1/send-otp`,
        sendOtpBody
      );

      // 2. Fetch OTP Code (new API call to get the OTP)
      const otpCodeData = await callApi(
        `${baseUrl}/api/v1/get-otp`,
        null,
        "GET"
      );
      const otpCode = otpCodeData.otp; // Assuming the response contains an 'otp' field

      // 3. Verify OTP
      verifyOtpBody.otp = otpCode; // Modify body as needed
      const verifyOtpData = await callApi(
        `${baseUrl}/api/v1/verify-otp`,
        verifyOtpBody
      );

      // 4. Generate Slot Time
      generateSlotTimeBody.otp = otpCode; // Modify body as needed
      const aptimeData = await callApi(
        `${baseUrl}/api/v1/generate-slot-time`,
        generateSlotTimeBody
      );

      // 5. Pay Invoice
      payInvoiceBody.otp = otpCode; // Modify body as needed
      const payData = await callApi(
        `${baseUrl}/api/v1/pay-invoice`,
        payInvoiceBody
      );

      setResponse({
        sendOtpData,
        otpCodeData,
        verifyOtpData,
        aptimeData,
        payData,
      });
    } catch (err) {
      setError(err.message);
      console.error("Process error:", err);
    }
  };

  return { response, error, startProcess };
}

export default ProcessController;
