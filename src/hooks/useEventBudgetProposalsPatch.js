
import { useState } from "react";
import { patchEventProposal } from "../services/event_budget_proposals_patch_Service";

const useEventBudgetProposalsPatch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const patchEventBudgetProposal = async (submittedJson) => {
    try {
      setLoading(true);
      setError(null);

      const response = await patchEventProposal({ submittedJson });
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
    patchEventBudgetProposal,
  };
};

export default useEventBudgetProposalsPatch;
