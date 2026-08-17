
import { useState } from "react";
import { patchEventProposal_Fin } from "../services/event_budget_proposals_fin_patch_Service";

const useEventBudgetProposalsFinPatch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const patchEventBudgetProposalFin = async (submittedJson) => {
    try {
      setLoading(true);
      setError(null);

      const response = await patchEventProposal_Fin({ submittedJson });
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
    patchEventBudgetProposalFin,
  };
};

export default useEventBudgetProposalsFinPatch;
