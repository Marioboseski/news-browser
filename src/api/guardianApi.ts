const url = `api/search`;
 const API_KEY = import.meta.env.VITE_API_KEY;

export const guardianApi = async (section: string) => {
  const res = await fetch(`${url}?section=${section}&show-fields=thumbnail,trailText,byline&api-key=${API_KEY}`);
  if(!res.ok) {
    throw new Error("Failed to fetch news");
  }
  const data = await res.json();
  return data;
}