import { useEffect, useState } from "react";
import { getEventBudgetProposalsListForFinance } from "../services/event_budget_proposals_list_for_finance_Service";

const useEventBudgetProposalsListForFinance = (empId) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const response = await getEventBudgetProposalsListForFinance(empId);

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
    // if (proposalId) {
      loadData();
    // }
  }, [empId]);

  return {
    rows,
    loading,
    error,
    refresh: loadData,
  };
};

export default useEventBudgetProposalsListForFinance;
