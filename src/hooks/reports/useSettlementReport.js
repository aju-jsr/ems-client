import { useState } from "react";
import { postSettlementReport } from "../../services/reports/settlementReport_Service";

const useSettlementReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitSettlementReport = async (submittedJson) => {
    try {
      setLoading(true);
      setError(null);

      const response = await postSettlementReport({ submittedJson });
      setData(response);
      
      return response[0];
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
    submitSettlementReport,
  };
};

export default useSettlementReport;
