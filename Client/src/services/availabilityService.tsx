const apiUrl = import.meta.env.VITE_API_SERVER_IP;

export const fetchAvailability = async (roomId: string): Promise<{ start: Date; end: Date }[]> => {
  try {
    const res = await fetch(`${apiUrl}${roomId}`);
    const data = await res.json();
    console.log("Fetching from:", `${apiUrl}${roomId}`);


    return data.unavailable.map((range: [string, string]) => ({
      start: new Date(range[0]),
      end: new Date(range[1]),
    }));
  } catch (err) {
    console.error("Failed to fetch availability:", err);
    return []; // fallback to empty array on failure
  }
};
