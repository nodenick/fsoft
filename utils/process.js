// // Send OTP
// export const sendOtp = async (sendOtpUrl, payload) => {
//   let sendOtpSuccess = false;

//   while (!sendOtpSuccess) {
//     try {
//       const response = await fetch(sendOtpUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         console.error(`HTTP Error: ${response.status} ${response.statusText}`);
//         continue; // Retry on non-OK HTTP status
//       }

//       const result = await response.json();

//       if (result && result.data?.status === true) {
//         sendOtpSuccess = true; // Exit loop on success
//         console.log("sendOtp successful:", result);
//         return result; // Return response for further processing
//       } else if (result && result.data?.error_reason) {
//         console.error(`API Error: ${result.data.error_reason}`);
//       } else {
//         console.error("Unexpected API Response:", result);
//       }
//     } catch (error) {
//       console.error("Error during sendOtp, retrying:", error);
//     }
//   }
// };

// export const sendOtp = async (sendOtpUrl, payload) => {
//   let sendOtpSuccess = false;
//   const delay = 2000; // 5 seconds delay between retries

//   while (!sendOtpSuccess) {
//     try {
//       const response = await fetch(sendOtpUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         console.error(`HTTP Error: ${response.status} ${response.statusText}`);
//         await new Promise((resolve) => setTimeout(resolve, delay));
//         continue; // Retry on non-OK HTTP status
//       }

//       const result = await response.json();

//       if (result && result.data?.status === true) {
//         sendOtpSuccess = true; // Success, exit loop
//         console.log("sendOtp successful:", result);
//         return result; // Return result for further processing
//       } else {
//         console.error("sendOtp failed, retrying:", result);
//         await new Promise((resolve) => setTimeout(resolve, delay)); // Delay before retry
//       }
//     } catch (error) {
//       console.error("Error during sendOtp, retrying:", error);
//       await new Promise((resolve) => setTimeout(resolve, delay)); // Delay before retry on error
//     }
//   }
// };

export const sendOtp = async (
  sendOtpUrl,
  payload,
  abortController,
  timeout = 9000
) => {
  let delay = 100; // Initial delay

  while (true) {
    try {
      if (abortController.signal.aborted) {
        console.warn("⚠️ sendOtp aborted as OTP was received via WebSocket.");
        return null; // Stop execution if aborted
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(sendOtpUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(
          `❌ HTTP Error: ${response.status} - Retrying in ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * 2, 1000);
        continue;
      }

      const result = await response.json();

      if (result?.data?.status) {
        console.log("✅ sendOtp successful:", result);
        return result; // Exit loop on success
      }

      console.warn(`⚠️ sendOtp failed, retrying in ${delay}ms...`, result);
    } catch (error) {
      if (error.name === "AbortError") {
        console.warn("⚠️ sendOtp request aborted.");
        return null; // Stop execution if aborted
      } else {
        console.error("🚨 sendOtp Error:", error);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
    delay = delay < 1000 ? delay * 2 : 100;
  }
};

// Get OTP
export const getOtp = async (getOtpUrl) => {
  let otp = null;

  while (!otp) {
    try {
      const response = await fetch(getOtpUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.otp) {
        otp = result.otp; // Store OTP on success
        console.log("getOtp successful:", result);
        return otp;
      } else {
        console.log("getOtp failed, retrying:", result);
      }
    } catch (error) {
      console.error("Error during getOtp, retrying:", error);
    }

    // Add a 2-second delay before retrying
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

// Verify OTP
// export const verifyOtp = async (verifyOtpUrl, payload) => {
//   let verifySuccess = false;
//   let slotDates = null;

//   while (!verifySuccess) {
//     try {
//       const response = await fetch(verifyOtpUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();

//       if (response.ok && result.data?.status === true) {
//         verifySuccess = true; // Exit loop on success
//         slotDates = result.data?.slot_dates; // Extract slot dates
//         console.log("verifyOtp successful:", result);
//         return { slotDates, result }; // Return slot dates and full result
//       } else {
//         console.log("verifyOtp failed, retrying:", result);
//       }
//     } catch (error) {
//       console.error("Error during verifyOtp, retrying:", error);
//     }
//   }
// };

export const verifyOtp = async (verifyOtpUrl, payload, timeout = 3000) => {
  while (true) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout); // Cancel request if too slow

      const response = await fetch(verifyOtpUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      if (response.ok && result.data?.status === true) {
        console.log("✅ OTP Verified Successfully:", result);
        return { slotDates: result.data?.slot_dates, result }; // Exit loop on success
      }

      // Stop retrying if OTP is permanently invalid
      if (
        result?.error?.includes("Invalid OTP") ||
        result?.error?.includes("Expired OTP")
      ) {
        console.error("❌ OTP is invalid or expired. Stopping retries.");
        return null;
      }

      console.warn(`⚠️ Verification failed. Retrying immediately...`, result);
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("⏳ Request timed out. Retrying...");
      } else {
        console.error("🚨 Error during OTP verification, retrying...", error);
      }
    }
  }
};

// export const verifyOtp = async (verifyOtpUrl, payload) => {
//   let verifySuccess = false;
//   let slotDates = null;

//   while (!verifySuccess) {
//     try {
//       const response = await fetch(verifyOtpUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();

//       if (response.ok && result.data?.status === true) {
//         verifySuccess = true; // Exit loop on success
//         slotDates = result.data?.slot_dates; // Extract slot dates
//         console.log("verifyOtp successful:", result);
//         return { slotDates, result }; // Return slot dates and full result
//       } else {
//         console.log("verifyOtp failed, retrying:", result);
//       }
//     } catch (error) {
//       console.error("Error during verifyOtp, retrying:", error);
//     }

//     // Add a 2-second delay before retrying
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//   }
// };

// Generate Slot Time
// export const getAppointmentTime = async (aptimeUrl, payload) => {
//   let appointmentSuccess = false;
//   let slotDetails = null;

//   while (!appointmentSuccess) {
//     try {
//       const response = await fetch(aptimeUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();

//       if (
//         response.ok &&
//         result.status === "OK" &&
//         result.slot_times?.length > 0
//       ) {
//         appointmentSuccess = true; // Exit the loop when successful
//         slotDetails = {
//           slotDates: result.slot_dates,
//           slotTimes: result.slot_times,
//         };
//         console.log("getAppointmentTime successful:", result);
//         return slotDetails; // Return slot details for further processing
//       } else {
//         console.log("getAppointmentTime failed, retrying:", result);
//       }
//     } catch (error) {
//       console.error("Error during getAppointmentTime, retrying:", error);
//     }
//   }
// };

export const getAppointmentTime = async (aptimeUrl, payload) => {
  let appointmentSuccess = false;
  let slotDetails = null;
  let delay = 100; // Start with 100ms
  const maxWaitTime = 7000; // ⏳ 7 seconds timeout

  while (!appointmentSuccess) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), maxWaitTime); // ⏳ Cancel request if it takes more than 7 seconds

      const response = await fetch(aptimeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      if (
        response.ok &&
        result.status === "OK" &&
        result.slot_times?.length > 0
      ) {
        appointmentSuccess = true; // ✅ Exit loop when successful
        slotDetails = {
          slotDates: result.slot_dates,
          slotTimes: result.slot_times,
        };
        console.log("✅ getAppointmentTime successful:", result);
        return slotDetails; // ✅ Return slot details for further processing
      } else {
        console.warn(`⚠️ No slots found. Retrying after delay...`);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("⏳ Request timed out (7s). Retrying...");
      } else {
        console.error("🚨 Error during getAppointmentTime, retrying:", error);
      }
    }

    // Progressive delay from 100ms → 200ms → 400ms → ... → max 1000ms
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay = Math.min(delay * 2, 1000); // ⏳ Double the delay, max at 1000ms
  }
};

export const getHashParamFromUser = () => {
  return new Promise((resolve) => {
    const hashParam = prompt("Enter the hash_param for payment:"); // Prompt user to input the hash_param
    if (hashParam) {
      resolve(hashParam); // Return the entered hash_param
    } else {
      alert("Hash_param is required for the next step.");
    }
  });
};

export const payInvoice = async (payUrl, payload) => {
  while (true) {
    try {
      const response = await fetch(payUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.status === "OK") {
        console.log("payInvoice successful:", result);
        return result; // Return the full response
      } else {
        console.log("payInvoice failed, retrying...", result);
      }
    } catch (error) {
      console.error("Error during payInvoice, retrying...", error);
    }

    // Add a 1-second delay before retrying
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};
