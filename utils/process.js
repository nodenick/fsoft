// utils/apinfo.js

const retry = async (asyncFunc, delay = 500) => {
  while (true) {
    try {
      return await asyncFunc();
    } catch (error) {
      console.error("Error encountered. Retrying in", delay, "ms...", error);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export const sendApInfo = async (url, payload) => {
  return retry(async () => {
    console.log("Sending AP Info payload:", payload);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("AP Info API response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Error sending AP Info");
    }
    return data;
  });
};

export const sendPerInfo = async (url, payload) => {
  return retry(async () => {
    console.log("Sending Personal Info payload:", payload);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Personal Info API response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Error sending personal info");
    }
    return data;
  });
};

export const sendOverview = async (url, payload) => {
  return retry(async () => {
    console.log("Sending Overview payload:", payload);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Overview API response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Error sending overview");
    }
    return data;
  });
};

export const sendOtp = async (url, payload) => {
  return retry(async () => {
    console.log("Sending OTP payload:", payload);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("OTP API response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Error sending OTP");
    }
    return data;
  });
};

export const verifyOtp = async (url, payload) => {
  return retry(async () => {
    console.log("Sending OTP verify payload:", payload);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("OTP Verify API response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Error verifying OTP");
    }
    return data;
  });
};

export const sendSlotTime = async (url, payload) => {
  return retry(async () => {
    console.log("Sending Slot Time payload:", payload);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Slot Time API response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Error retrieving slot time");
    }
    return data;
  });
};

export const sendPayNow = async (url, payload) => {
  return retry(async () => {
    console.log("Sending Pay Now payload:", payload);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Pay Now API response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Error during Pay Now step");
    }
    return data;
  });
};
