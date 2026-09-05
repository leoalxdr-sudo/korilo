import type { ParsedCriteria, Recommendation } from "@/lib/types";

// Client-only, localStorage-backed search history — no accounts yet, so
// this is the simplest way to let a returning visitor see their past
// requests again. Each entry snapshots its recommendations at search
// time rather than re-fetching, so the history stays instant to render.

export interface HistoryEntry {
  id: string;
  query: string;
  timestamp: number;
  criteria: ParsedCriteria;
  recommendations: Recommendation[];
}

const STORAGE_KEY = "korilo:search-history";
const MAX_ENTRIES = 8;

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage full or unavailable (private browsing) — history just
    // won't persist this time, not worth surfacing to the user.
  }
}

export function addHistoryEntry(
  entries: HistoryEntry[],
  entry: Omit<HistoryEntry, "id" | "timestamp">
): HistoryEntry[] {
  // Re-running the exact same query (e.g. a page revisit or a dev
  // double-effect) updates the existing entry instead of duplicating it.
  if (entries[0]?.query === entry.query) {
    const next = [
      { ...entry, id: entries[0].id, timestamp: Date.now() },
      ...entries.slice(1),
    ];
    saveHistory(next);
    return next;
  }

  const next = [
    { ...entry, id: crypto.randomUUID(), timestamp: Date.now() },
    ...entries,
  ].slice(0, MAX_ENTRIES);
  saveHistory(next);
  return next;
}

export function removeHistoryEntry(
  entries: HistoryEntry[],
  id: string
): HistoryEntry[] {
  const next = entries.filter((e) => e.id !== id);
  saveHistory(next);
  return next;
}

export function clearHistory(): HistoryEntry[] {
  saveHistory([]);
  return [];
}
