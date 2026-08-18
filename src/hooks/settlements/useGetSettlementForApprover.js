import { useEffect, useState } from "react";
import { getSettlementForApprover } from "../../services/settlements/getSettlementForApprover_Service";

const useGetSettlementForApprover = (empId) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getSettlementForApprover(empId);
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
      loadData();
  }, [empId]);

  return {
    rows,
    loading,
    error,
    loadData,
  };
};

export default useGetSettlementForApprover;
