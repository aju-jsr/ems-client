import { useEffect, useState } from "react";
import { getEventBudgetProposalsAttachment } from "../services/event_budget_proposals_attachment_Service";

const useEventBudgetProposalsAttachment = (proposalId) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const response = await getEventBudgetProposalsAttachment(proposalId);

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
  }, [proposalId]);

  return {
    rows,
    loading,
    error,
    refresh: loadData,
  };
};

export default useEventBudgetProposalsAttachment;

