import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const API = "api/verify";
const API_URL= API_DOMAIN + API;

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        setAuthenticated(false);
        return;
      }

      try {
        await axios.get(
          API_URL,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAuthenticated(true);
      } catch (error) {
        localStorage.clear();
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}