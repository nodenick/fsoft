// services/userService.js
export const getUsers = async () => {
  const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/list-forms`;
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.error("Invalid data format received from the API:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    return [];
  }
};

export const deleteUserBySL = async (sl) => {
  const deleteUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/delete-form/${sl}`;
  try {
    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user.");
    }

    // Return a success indicator or result if needed
    return true;
  } catch (error) {
    console.error("Error during delete request:", error);
    throw error;
  }
};
