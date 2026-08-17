import { useEffect, useState } from "react";
import { getPaymentMode } from "../services/payment_mode_Service";

const usePaymentMode = () => {
  const [paymentmode, setPaymentMode] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentMode = async () => {
      try {
        const data = await getPaymentMode();
        setPaymentMode(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMode();
  }, []);

  return { paymentmode, loading, error };
};

export default usePaymentMode;