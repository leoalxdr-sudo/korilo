// Client-only, localStorage-backed record of product pages someone has
// actually opened — distinct from search history (which snapshots a
// query's results), this just tracks product ids in visit order.

const STORAGE_KEY = "korilo:recently-viewed";
const MAX_ENTRIES = 8;

export function loadRecentlyViewed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function saveRecentlyViewed(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage full or unavailable — just won't persist this time.
  }
}

export function addRecentlyViewed(ids: string[], productId: string): string[] {
  const next = [productId, ...ids.filter((id) => id !== productId)].slice(0, MAX_ENTRIES);
  saveRecentlyViewed(next);
  return next;
}
