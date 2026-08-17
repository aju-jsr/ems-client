
import { useState } from "react";
import { patchSettlement } from "../../services/settlements/patchSettlement_Service";

const useSettlementPATCH = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const settlementPATCH = async (submittedJson) => {
    try {
      setLoading(true);
      setError(null);

      const response = await patchSettlement({ submittedJson });
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
    settlementPATCH,
  };
};

export default useSettlementPATCH;
