import axios from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/payment-mode";
const API_URL= API_DOMAIN + API;

export const getPaymentMode = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};