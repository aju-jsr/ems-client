import { useEffect, useState } from "react";
import { getEventBudgetProposals } from "../services/event_budget_proposals_list_Service";

const useEventBudgetProposalsList = (proposalId) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const response = await getEventBudgetProposals(proposalId);

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

export default useEventBudgetProposalsList;


// import { useState } from "react";
// import { getEventBudgetProposals, postEventProposal } from "../services/event_budget_proposals_list_Service";

// const useEventBudgetProposalsList = (id) => {
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (!id) {
//           setData([]);
//           setLoading(false);
//           setError(null);
//           return;
//         }
    
//         const fetchList = async () => {
//           try {
//             setLoading(true);
//             setError(null);
//             const data = await getEventBudgetProposals(id);
//             setData(data);
//           } catch (err) {
//             setError(err);
//             setData([]);
//           } finally {
//             setLoading(false);
//           }
//         };
    
//         fetchList();
//       }, [id]);
    
//       return { departments, loading, error };
// };

// export default useEventBudgetProposalsList;