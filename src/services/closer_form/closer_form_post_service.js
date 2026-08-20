
import axios from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/closer-form";
const API_URL= API_DOMAIN + API;

export const postCloserForm = async (closerData) => {
  try {
    const response = await axios.post(
      API_URL,
      closerData.submittedJson,
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
};