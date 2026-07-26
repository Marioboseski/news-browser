const url = `api/search`;
const API_KEY = import.meta.env.VITE_API_KEY;
import type { GuardianApi } from "../types/types";

export const guardianApi = async ({ section, search, fromDate, toDate, orderBy, page }: GuardianApi) => {
  const params = new URLSearchParams();

  params.set("section", section);
  params.set("page", page.toString());
  params.set("api-key", API_KEY);
  params.set("show-fields","thumbnail,trailText,byline");
  params.set("page-size", "20");
  params.set("order-by", orderBy);

  if (search) {
    params.set("q", search);
  }

  if (fromDate) {
    params.set("from-date", fromDate);
  }

  if (toDate) {
    params.set("to-date", toDate);
  }

  console.log(params.toString());

  const res = await fetch(`${url}?${params.toString()}`);
  const data = await res.json();

  console.log(res.status);
  console.log(data);

  if (!res.ok) {
    throw new Error("Failed to fetch news");
  }
  return data;
}