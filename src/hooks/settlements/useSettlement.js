import { useEffect, useState } from "react";
import { getSettlement } from "../../services/settlements/getSettlementById_Service";

const useSettlement = (id) => {
  const [SettlementRows, setRows] = useState([]);
  const [Settlementloading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getSettlement(id);
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
  }, [id]);

  return {
    SettlementRows,
    Settlementloading,
    error,
    refresh: loadData,
  };
};

export default useSettlement;
