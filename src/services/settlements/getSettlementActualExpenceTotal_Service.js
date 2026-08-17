
import axios from "axios";
const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/settlement-act-exp-totl";

export const getSettlement = async (id) => {
  try {
    const API_URL= API_DOMAIN + API;
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Actual Expence Total:", error);
    throw error;
  }
};