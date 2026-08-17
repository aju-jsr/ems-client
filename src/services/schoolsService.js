import axios from "axios";
const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/school";
const API_URL= API_DOMAIN + API;

export const getSchools = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};