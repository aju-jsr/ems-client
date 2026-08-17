import { useState } from "react";
import { postSettlement } from "../../services/settlements/postSettlement_Service";

const useSettlementPOST = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitSettlement = async (submittedJson) => {
    try {
      setLoading(true);
      setError(null);

      const response = await postSettlement({ submittedJson });
      setData(response);
      // Old
      // return response;
      //New
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
    submitSettlement,
  };
};

export default useSettlementPOST;
