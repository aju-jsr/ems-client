import { useState } from "react";
import { postCloserForm } from "../../services/closer_form/closer_form_post_service";

const useCloserFormPOST = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitCloserForm = async (submittedJson) => {
    try {
      setLoading(true);
      setError(null);

      const response = await postCloserForm({ submittedJson });
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
    submitCloserForm,
  };
};

export default useCloserFormPOST;
