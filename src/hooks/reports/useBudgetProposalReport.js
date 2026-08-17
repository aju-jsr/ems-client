import { useState } from "react";
import { postBudgetProposalReport } from "../../services/reports/budgetProposalReport_Service";

const useBudgetProposalReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitBudgetProposalReport = async (submittedJson) => {
    try {
      setLoading(true);
      setError(null);

      const response = await postBudgetProposalReport({ submittedJson });
      setData(response);
      
      return response[0];
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
    submitBudgetProposalReport,
  };
};

export default useBudgetProposalReport;
