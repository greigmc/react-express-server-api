import { useState, useEffect, useCallback } from "react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
}

interface FetchError extends Error {
  message: string;
}

export const useFetchData = (token: string | null) => {
  const apiUser = import.meta.env.VITE_EXPRESS_API_DUMMY_USER; // Use Express login endpoint


  const apiBearerToken = apiUser; // Express endpoint
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!token) {
      setError("Authorization token is missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true); // Set loading state
      console.log("Headers sent to /api/dummy-user:", {
        Authorization: `Bearer ${token}`,
      });

      const response = await fetch(apiBearerToken, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const userData: User = await response.json();
      setData(userData);
      setError(null); // Clear errors on success
      setLoading(false);
    } catch (error) {
      const fetchError = error as FetchError;
      setError(fetchError.message);
      setLoading(false);
    }
  }, [token, apiBearerToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error };
};
