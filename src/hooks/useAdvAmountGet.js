import { useEffect, useState } from "react";
import { getAdvAmount } from "../services/adv_amount_get_Service";

const useAdvamountGet = (event_proposal_id) => {
  const [rowsAdvAmt, setRows] = useState([]);
  const [loadingAdvAmt, setLoading] = useState(true);
  const [errorAdvAmt, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getAdvAmount(event_proposal_id);
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
  }, [event_proposal_id]);

  return {
    rowsAdvAmt,
    loadingAdvAmt,
    errorAdvAmt,
    refresh: loadData,
  };
};

export default useAdvamountGet;
