import { useState, useEffect, useCallback } from "react";

interface FetchError extends Error {
  message: string;
}

export const useLogin = () => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async () => {
    try {
      const apiLogin = import.meta.env.VITE_EXPRESS_API_LOGIN; // Use Express login endpoint
      const username = import.meta.env.VITE_API_USERNAME;
      const password = import.meta.env.VITE_API_PASSWORD;

      const response = await fetch(apiLogin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      // console.log("Token retrieved in useLogin:", data.accessToken); // Debug log
      setToken(data.accessToken); // Save the token
    } catch (error) {
      const fetchError = error as FetchError;
      setError(fetchError.message);
      // console.error("Login error:", fetchError.message); // Debug log
    }
  }, []);

  useEffect(() => {
    login();
  }, [login]);

  return { token, error };
};
