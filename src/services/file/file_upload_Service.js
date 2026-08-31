
import axios from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/file";
const API_URL= API_DOMAIN + API;

export const postFile = async (fileData) => {
  try {
    const fileJson = {
        fileName: fileData.fileName,
        contentType: fileData.contentType,
    };
    const response = await axios.post(
      API_URL,
      fileJson,
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