
import axios from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/proposal-req";


export const getProposaReqNo = async (Reqd) => {
  try {
    const API_URL = API_DOMAIN + API;
    const response = await axios.get(`${API_URL}/${Reqd}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching proposals details:", error);
    throw error;
  }
};