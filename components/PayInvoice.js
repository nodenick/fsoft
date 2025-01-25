// components/PayInvoice.js
import { baseUrl } from "../utils/baseUrl";

async function payInvoice(otpCode, payInvoiceBody) {
  const payEndpoint = `${baseUrl}/api/v1/payInvoice`;
  payInvoiceBody.info[0].otp = otpCode;

  const response = await fetch(payEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payInvoiceBody),
  });

  if (!response.ok) {
    throw new Error(`Pay invoice failed! status: ${response.status}`);
  }

  return await response.json();
}

export default payInvoice;
