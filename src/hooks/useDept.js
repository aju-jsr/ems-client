import { useEffect, useState } from "react";
import { getDept } from "../services/deptService";

const useDept = (id) => {
  const [departments, setDept] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setDept([]);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchDept = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDept(id);
        setDept(data);
      } catch (err) {
        setError(err);
        setDept([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDept();
  }, [id]);

  return { departments, loading, error };
};

export default useDept;
// import { useEffect, useState } from "react";
// import { getDept } from "../services/deptService";

// const useDept = () => {
//   const [departments, setDept] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchdept = async () => {
//       try {
//         const data = await getDept();
//         setDept(data);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchdept();
//   }, []);

//   return { departments, loading, error };
// };

// export default useDept;
