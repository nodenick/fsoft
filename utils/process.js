// Helper function to combine two AbortSignals into one.
// The returned signal aborts if either signal aborts.
function combineAbortSignals(signal1, signal2) {
  const controller = new AbortController();

  const abortHandler = () => controller.abort();

  // If either signal is already aborted, abort immediately.
  if (signal1.aborted || signal2.aborted) {
    controller.abort();
  } else {
    signal1.addEventListener("abort", abortHandler);
    signal2.addEventListener("abort", abortHandler);
  }

  return controller.signal;
}

export const sendOtp = async (
  sendOtpUrl,
  payload,
  externalAbortController, // the controller passed from handleActionSelect
  timeout = 5000
) => {
  let delay = 100; // Initial delay in milliseconds

  while (true) {
    try {
      // Check if the external abort signal is set.
      if (externalAbortController.signal.aborted) {
        console.warn("⚠️ sendOtp aborted as OTP was received via WebSocket.");
        return null; // Stop execution if aborted externally.
      }

      // Create an internal controller for enforcing the timeout.
      const internalController = new AbortController();
      // Combine the external abort signal with the internal timeout controller.
      const combinedSignal = combineAbortSignals(
        externalAbortController.signal,
        internalController.signal
      );

      // Set up the timeout.
      const timeoutId = setTimeout(() => {
        internalController.abort();
      }, timeout);

      const response = await fetch(sendOtpUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: combinedSignal,
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
        return result; // Exit loop on success.
      }

      console.warn(`⚠️ sendOtp failed, retrying in ${delay}ms...`, result);
    } catch (error) {
      if (error.name === "AbortError") {
        // If the external abort was triggered, stop further requests.
        if (externalAbortController.signal.aborted) {
          console.warn("⚠️ sendOtp aborted as OTP was received via WebSocket.");
          return null;
        }
        console.warn(
          `⚠️ sendOtp request timed out - Retrying in ${delay}ms...`
        );
      } else {
        console.error("🚨 sendOtp Error:", error);
      }
    }

    // Wait before retrying.
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay = Math.min(delay * 2, 1000);
  }
};

// export const sendOtp = async (
//   sendOtpUrl,
//   payload,
//   abortController,
//   timeout = 5000
// ) => {
//   let delay = 100; // Initial delay

//   while (true) {
//     try {
//       if (abortController.signal.aborted) {
//         console.warn("⚠️ sendOtp aborted as OTP was received via WebSocket.");
//         return null; // Stop execution if aborted
//       }

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), timeout);

//       const response = await fetch(sendOtpUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//         signal: controller.signal,
//       });

//       clearTimeout(timeoutId);

//       if (!response.ok) {
//         console.error(
//           `❌ HTTP Error: ${response.status} - Retrying in ${delay}ms...`
//         );
//         await new Promise((resolve) => setTimeout(resolve, delay));
//         delay = Math.min(delay * 2, 1000);
//         continue;
//       }

//       const result = await response.json();

//       if (result?.data?.status) {
//         console.log("✅ sendOtp successful:", result);
//         return result; // Exit loop on success
//       }

//       console.warn(`⚠️ sendOtp failed, retrying in ${delay}ms...`, result);
//     } catch (error) {
//       if (error.name === "AbortError") {
//         console.warn("⚠️ sendOtp request aborted.");
//         return null; // Stop execution if aborted
//       } else {
//         console.error("🚨 sendOtp Error:", error);
//       }
//     }

//     await new Promise((resolve) => setTimeout(resolve, delay));
//     delay = delay < 1000 ? delay * 2 : 100;
//   }
// };

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

export const verifyOtp = async (verifyOtpUrl, payload, timeout = 7000) => {
  let retryDelay = 100; // Start delay at 100ms

  while (true) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

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

      console.warn(
        `⚠️ Verification failed. Retrying in ${retryDelay}ms...`,
        result
      );
    } catch (error) {
      if (error.name === "AbortError") {
        console.error(`⏳ Request timed out. Retrying in ${retryDelay}ms...`);
      } else {
        console.error(
          `🚨 Error during OTP verification. Retrying in ${retryDelay}ms...`,
          error
        );
      }
    }

    // Wait for the retry delay before the next attempt
    await new Promise((resolve) => setTimeout(resolve, retryDelay));
    // Increase the delay, capping at 1000ms
    retryDelay = Math.min(retryDelay * 2, 1000);
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
