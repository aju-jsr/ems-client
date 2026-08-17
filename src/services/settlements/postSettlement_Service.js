
import axios from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/settlement";

export const postSettlement = async (settlementData) => {
  try {
    const API_URL= API_DOMAIN + API;
    const response = await axios.post(
        API_URL,
        settlementData.submittedJson,
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