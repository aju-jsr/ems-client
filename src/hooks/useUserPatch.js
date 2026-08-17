
import { useState } from "react";
import { patchUser } from "../services/user_patch_Service";

const useUserPatch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userPATCH = async (submittedJson) => {
    try {
      setLoading(true);
      setError(null);

      const response = await patchUser({ submittedJson });
      setData(response);
     
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
    userPATCH,
  };
};

export default useUserPatch;
