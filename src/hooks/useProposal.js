import { useEffect, useState } from "react";
import { getProposal } from "../services/proposalService";

const useProposal = () => {
  const [proposal, setProposal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const data = await getProposal();
        setProposal(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, []);

  return { proposal, loading, error };
};

export default useProposal;