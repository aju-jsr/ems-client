import axios from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/dept/";

// const token = sessionStorage.getItem("token");
export const getDept = async (id) => {

  let  API_URL = "";
  
  if(id === -1){
     API_URL = API_DOMAIN + API;
  }else{
    API_URL= API_DOMAIN + API + id;
  }
  
  const response = await axios.get(API_URL);
  
  return response.data;
};
