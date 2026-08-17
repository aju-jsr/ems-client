
import axios from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/event-budget-proposals-fin-patch";
const API_URL= API_DOMAIN + API;

export const patchEventProposal_Fin = async (proposalData) => {
  try {
    const response = await axios.patch(
      API_URL,
      proposalData.submittedJson,
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