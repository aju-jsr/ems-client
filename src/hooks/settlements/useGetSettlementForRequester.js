import { useEffect, useState } from "react";
import { getSettlementForRequester } from "../../services/settlements/getSettlementForRequester_Service";

const useGetSettlementForRequester = (empId) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getSettlementForRequester(empId);
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

export default useGetSettlementForRequester;
