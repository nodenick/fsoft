// This utility file exports the base URL of your API.
// You might want to adjust this depending on the environment (development, production, etc.)

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export { baseUrl };
