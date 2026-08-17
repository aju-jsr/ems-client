
import axios from "axios";


const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/adv-amt-get";
const API_URL= API_DOMAIN + API;

export const getAdvAmount = async (event_proposal_id) => {
  try {
    if (event_proposal_id === '' || event_proposal_id === null) {
      return {
        success: true,
        data: []
      };
    }
    const response = await axios.get(`${API_URL}/${event_proposal_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event budget proposals Finance:", error);
    throw error;
  }
};