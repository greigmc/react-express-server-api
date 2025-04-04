import { useState, useEffect } from "react";
import { fetchWithFetch } from "../api/apiCalls";

export interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

export const useFetchData = (apiUrl: string) => {
  const [data, setData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchWithFetch(apiUrl);
        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(
            new Error("Failed to fetch data: An unknown error occurred")
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  return { data, loading, error };
};
