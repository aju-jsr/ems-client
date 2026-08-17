import { useState } from "react";
import { postEventProposal } from "../services/event_budget_proposals_Service";

const useEventBudgetProposals = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitEventBudgetProposal = async (submittedJson) => {
    try {
      setLoading(true);
      setError(null);

      const response = await postEventProposal({ submittedJson });
      setData(response);
      // Old
      // return response;
      //New
      return response.data;
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
    submitEventBudgetProposal,
  };
};

export default useEventBudgetProposals;
