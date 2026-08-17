import { useEffect, useState } from "react";
import { getSettlementType } from "../../services/settlements/settlement_type_Service";

const useSettlementType = () => {
  const [settlementtype, setSettlementType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchsettlementtype = async () => {
      try {
        const data = await getSettlementType();
        setSettlementType(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchsettlementtype();
  }, []);

  return { settlementtype, loading, error };
};

export default useSettlementType;