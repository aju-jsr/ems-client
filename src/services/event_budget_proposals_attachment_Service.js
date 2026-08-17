import axios from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/event-budget-proposals-attachment";
const API_URL= API_DOMAIN + API;

export const getEventBudgetProposalsAttachment = async (proposalId) => {
  try {
    const response = await axios.get(`${API_URL}/${proposalId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event budget proposals:", error);
    throw error;
  }
};