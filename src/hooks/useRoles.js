import { useEffect, useState } from "react";
import { getRoles } from "../services/roles_Service";

const useRoles = () => {
  const [roles, setsRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchroles = async () => {
      try {
        const data = await getRoles();
        setsRoles(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchroles();
  }, []);

  return { roles, loading, error };
};

export default useRoles;