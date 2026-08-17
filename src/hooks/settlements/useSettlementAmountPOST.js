
import { useState } from "react";
import { postSettlementAmount } from "../../services/settlements/postSettlement_Amount_Service";

const useSettlementAmountPOST = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitSettlementAmount = async (submittedJson) => {
    try {
      setLoading(true);
      setError(null);

      const response = await postSettlementAmount({ submittedJson });
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
    submitSettlementAmount,
  };
};

export default useSettlementAmountPOST;
