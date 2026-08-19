import { useEffect, useState } from "react";
import { getSettlementAmount } from "../../services/settlements/getSettlementAmount_Service";

const useGetSettlementAmount = (reqId) => {
  const [rowsSettlementAmt, setRows] = useState([]);
  const [loadingSettlementAmt, setLoading] = useState(true);
  const [errorSettlementAmt, setError] = useState("");

  const SettlementAmt_loadData = async () => {
    try {
      setLoading(true);
      const response = await getSettlementAmount(reqId);
      // API returns { success: true, data: [...] }
      const data = response.data || [];
      setRows(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load proposals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      SettlementAmt_loadData();
  }, [reqId]);

  return {
    rowsSettlementAmt,
    loadingSettlementAmt,
    errorSettlementAmt,
    SettlementAmt_loadData,
  };
};

export default useGetSettlementAmount;
