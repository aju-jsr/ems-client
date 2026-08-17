

import axios from "axios";
const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/settlement-amount";

export const getSettlementAmount = async (id) => {
  try {
    const API_URL= API_DOMAIN + API;
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event budget proposals:", error);
    throw error;
  }
};