import axios from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/roles";
const API_URL= API_DOMAIN + API;

export const getRoles = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};