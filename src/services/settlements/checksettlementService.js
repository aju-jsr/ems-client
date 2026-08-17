import axios from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/check-settlement";

export const getCheckSettlement = async (settlementData) => {
    try {

        const API_URL = API_DOMAIN + API;

        const response = await axios.get(API_URL, {
            params: {
                settlement_no: settlementData.settlement_no,
                sub_settlement_no: settlementData.sub_settlement_no,
                emp_id: settlementData.req_emp_id
            },
            headers: {
                "Content-Type": "application/json"
            }
        });

        return response.data;

    } catch (error) {
        console.error("Error checking settlement:", error);
        throw error;
    }
};