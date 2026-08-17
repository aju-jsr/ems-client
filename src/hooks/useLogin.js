import { useState } from "react";
import { postLogin } from "../services/login_Service";

const useLogin = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitLogin = async (submittedJson) => {
    try {
      setLoading(true);
      setError(null);

      const response = await postLogin({ submittedJson });
      setData(response);
      
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    postLogin,
  };
};

export default useLogin;
