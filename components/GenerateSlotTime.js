// components/GenerateSlotTime.js
import { baseUrl } from "../utils/baseUrl";

async function generateSlotTime(otpCode, generateSlotTimeBody) {
  const aptimeEndpoint = `${baseUrl}/api/v1/aptime`;
  generateSlotTimeBody.info[0].otp = otpCode;

  const response = await fetch(aptimeEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(generateSlotTimeBody),
  });

  if (!response.ok) {
    throw new Error(`Generate slot time failed! status: ${response.status}`);
  }

  return await response.json();
}

export default generateSlotTime;
