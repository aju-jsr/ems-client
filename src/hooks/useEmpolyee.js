import { useEffect, useState } from "react";
import { getEmployee } from "../services/empolyeeService";

const useEmpolyees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpolyees = async () => {
      try {
        const data = await getEmployee();
        setEmployees(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpolyees();
  }, []);

  return { employees, loading, error };
};

export default useEmpolyees;