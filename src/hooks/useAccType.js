import { useEffect, useState } from "react";
import { getAccTypes } from "../services/acc_type";

const useAccTypes = () => {
  const [acctypes, setAccTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccTypes = async () => {
      try {
        const data = await getAccTypes();
        setAccTypes(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccTypes();
  }, []);

  return { acctypes, loading, error };
};

export default useAccTypes;