
import axios from "axios";
const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/user";

export const patchUser = async (userData) => {
  try {
        const API_URL= API_DOMAIN + API;
        const response = await axios.patch(
            API_URL,
            userData.submittedJson,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

    return response.data;
  } catch (error) {
    console.error("Error creating event budget proposal:", error);

    throw error.response?.data || error;
  }
};;