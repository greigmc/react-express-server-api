// Fetch with Fetch API
export const fetchWithFetch = async (apiUrl: string) => {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const jsonData = await response.json();
    return jsonData.data || []; // Ensure jsonData.data is an array
  };