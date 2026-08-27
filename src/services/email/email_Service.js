
import axios from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/sendmail";
const API_URL= API_DOMAIN + API;

export const postEmail = async (emailData) => {
  try {
    // const {
    //     submittedJson,
    //     approverEmail,
    //     requestorEmail,
    //     subject,
    //     htmlBody,
    // } = emailData;

    const requestBody = {
        to: emailData.to,
        subject: emailData.subject,
        proposalTitle: emailData.proposalTitle,
        requestNo: emailData.requestNo,
        requestorName: emailData.requestorName,
        cc: emailData.cc,
    };
    const response = await axios.post(
      API_URL,
      requestBody,
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