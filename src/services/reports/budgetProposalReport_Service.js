
import axios from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/proposal-report";

export const postBudgetProposalReport = async (reportData) => {
  try {
    const API_URL= API_DOMAIN + API;
    const response = await axios.post(
        API_URL,
        reportData.submittedJson,
        {
            headers: {
            "Content-Type": "application/json",
            },
        }
    );

    return response.data;
  } catch (error) {
    console.error("Error Getting budget proposal repotr:", error);

    throw error.response?.data || error;
  }
};