import { broadcastOtp } from "../socket"; // Import WebSocket broadcast function

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { mobile } = req.query;
    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required in the URL.",
      });
    }

    const { key, time } = req.body;
    if (!key || !time) {
      return res.status(400).json({
        success: false,
        message: "Missing 'key' or 'time' in request body.",
      });
    }

    // Extract OTP (4-6 digit number)
    const otpMatch = key.match(/\b\d{4,6}\b/);
    if (!otpMatch) {
      return res
        .status(400)
        .json({ success: false, message: "No OTP found in the message." });
    }

    const otp = otpMatch[0];

    console.log(`✅ OTP Received from ${mobile}: ${otp}`);

    // **Broadcast OTP to all WebSocket clients**
    broadcastOtp(mobile, otp);

    return res
      .status(200)
      .json({ success: true, mobile, otp, received_at: time });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error processing OTP.",
      error: error.message,
    });
  }
}
