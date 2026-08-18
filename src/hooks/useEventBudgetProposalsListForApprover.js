import { useEffect, useState } from "react";
import { getEventBudgetProposalsListForApprover } from "../services/event_budget_proposals_list_for_approver_Service";

const useEventBudgetProposalsListForApprover = (empId) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const response = await getEventBudgetProposalsListForApprover(empId);

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
    loadData,
  };
};

export default useEventBudgetProposalsListForApprover;
