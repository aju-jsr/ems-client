import { useState } from "react";
import { postAdvAmount } from "../services/adv_amount_Service.js";

const useAdvAmount = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitAdvAmount = async (submittedJson) => {
    try {
      setLoading(true);
      setError(null);

      const response = await postAdvAmount({ submittedJson });
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
    submitAdvAmount,
  };
};

export default useAdvAmount;
