import { useSyncExternalStore } from "react";

// Client-only, localStorage-backed wishlist — same no-accounts-yet
// approach as searchHistory.ts, but shared across every ProductCard on
// the page via a tiny pub-sub store (useSyncExternalStore) instead of
// prop drilling or a context provider, since hearts on unrelated cards
// need to reflect each other's toggles instantly.

const STORAGE_KEY = "korilo:wishlist";

type Listener = () => void;
const listeners = new Set<Listener>();
let cached: string[] | null = null;
const EMPTY: string[] = [];

function read(): string[] {
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

function getSnapshot(): string[] {
  if (cached === null) cached = read();
  return cached;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

function write(ids: string[]): void {
  cached = ids;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage full or unavailable (private browsing) — the toggle just
    // won't persist, not worth surfacing to the user.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      cached = null;
      for (const listener of listeners) listener();
    }
  });
}

export function toggleWishlist(productId: string): void {
  const current = getSnapshot();
  const next = current.includes(productId)
    ? current.filter((id) => id !== productId)
    : [productId, ...current];
  write(next);
}

export function useWishlist(): {
  ids: string[];
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => void;
} {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { ids, isWishlisted: (productId) => ids.includes(productId), toggle: toggleWishlist };
}
