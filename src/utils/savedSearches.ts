import type { SavedSearch } from "../types/types";

const savedSearches = "savedSearches";

export const getSavedSearches = (): SavedSearch[] => {
  const searches = localStorage.getItem(savedSearches);

  if (!searches) return [];

  return JSON.parse(searches);
};

export const saveSearches = (searches: SavedSearch[]) => {
  localStorage.setItem(savedSearches, JSON.stringify(searches));
}