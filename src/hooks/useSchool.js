import { useEffect, useState } from "react";
import { getSchools } from "../services/schoolsService";

const useSchools = () => {
  const [schools, setschools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchschools = async () => {
      try {
        const data = await getSchools();
        setschools(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchschools();
  }, []);

  return { schools, loading, error };
};

export default useSchools;