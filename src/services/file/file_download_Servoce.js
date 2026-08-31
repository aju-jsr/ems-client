
import axios from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/file";
const API_URL= API_DOMAIN + API;


export const getfile = async (fileName) => {
  try {
    const response = await axios.get(`${API_URL}?key=/${fileName}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event budget proposals:", error);
    throw error;
  }
};