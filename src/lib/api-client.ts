import type { ParsedCriteria, SearchResult } from "@/lib/types";

async function postSearch(body: object): Promise<SearchResult> {
  const res = await fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error("Korilo couldn't process that request. Please try again.");
  }
  return res.json();
}

export function fetchSearchByQuery(
  query: string,
  previousCriteria?: ParsedCriteria | null
): Promise<SearchResult> {
  return postSearch({ query, previousCriteria });
}

export function fetchSearchByCriteria(
  criteria: ParsedCriteria
): Promise<SearchResult> {
  return postSearch({ criteria });
}
