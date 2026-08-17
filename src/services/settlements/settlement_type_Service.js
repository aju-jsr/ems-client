import axios from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/settlement-type";

export const getSettlementType = async () => {
    const API_URL= API_DOMAIN + API;
    const response = await axios.get(API_URL);
    return response.data;
};