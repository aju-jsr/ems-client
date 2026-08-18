import { useEffect, useState } from "react";
import { getSettlementForFin } from "../../services/settlements/getSettlementForFin_Service";

const useGetSettlementForFin = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getSettlementForFin();
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
  }, []);

  return {
    rows,
    loading,
    error,
    loadData,
  };
};

export default useGetSettlementForFin;
