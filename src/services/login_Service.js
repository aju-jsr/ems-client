
import axios from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/login";
const API_URL= API_DOMAIN + API;

export const postLogin = async (loginData) => {
  try {
    
    const response = await axios.post(
    API_URL,
    {
      login_id: loginData.login_id,
      password: loginData.password
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