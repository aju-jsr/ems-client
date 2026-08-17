
import axios from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/settlement-amount";

export const postSettlementAmount = async (settlementAmtData) => {
  try {
    const API_URL= API_DOMAIN + API;
    const response = await axios.post(
        API_URL,
        settlementAmtData.submittedJson,
        {
            headers: {
            "Content-Type": "application/json",
            },
        }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating Settlement Amount:", error);

    throw error.response?.data || error;
  }
};