
import axios from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/adv-amt";
const API_URL= API_DOMAIN + API;

export const postAdvAmount = async (submitData) => {
    try {
        const response = await axios.post(
            
            API_URL,
            {
                event_proposal_id: submitData.submittedJson.event_proposal_id,
                event_request_no: submitData.submittedJson.event_request_no,
                amount: submitData.submittedJson.amount,
                paid_on: submitData.submittedJson.paid_on,
                mode: submitData.submittedJson.mode,
                transaction_id: submitData.submittedJson.transaction_id
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error creating event budget proposal:", error);

        throw error.response?.data || error;
    }
};