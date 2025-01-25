// services/api.js
export const callApi = async (url, body = null, method = "POST") => {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };

    // Add the body only for non-GET requests
    if (method !== "GET" && body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};
