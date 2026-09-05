import { useSyncExternalStore } from "react";

// Client-only, localStorage-backed price alerts. Same pub-sub pattern
// as wishlist.ts. The catalog here is static — nothing will ever
// actually drop in price on its own — so this only ever gets evaluated
// at the moment an alert is created (against the current price and the
// other-retailer offers already shown on the page), never re-checked
// later. A real backend would be needed to watch prices over time.

const STORAGE_KEY = "korilo:price-alerts";

export interface PriceAlert {
  productId: string;
  /** The price at the moment the alert was set — any offer found below
   * this counts as a drop. Not a wishful target the shopper picks, so
   * the alert can never be "wrong" about what counts as a deal. */
  referencePrice: number;
  createdAt: number;
}

type Listener = () => void;
const listeners = new Set<Listener>();
let cached: PriceAlert[] | null = null;
const EMPTY: PriceAlert[] = [];

function isPriceAlert(value: unknown): value is PriceAlert {
  if (!value || typeof value !== "object") return false;
  const alert = value as Record<string, unknown>;
  return (
    typeof alert.productId === "string" &&
    typeof alert.referencePrice === "number" &&
    typeof alert.createdAt === "number"
  );
}

function read(): PriceAlert[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isPriceAlert) : [];
  } catch {
    return [];
  }
}

function getSnapshot(): PriceAlert[] {
  if (cached === null) cached = read();
  return cached;
}

function getServerSnapshot(): PriceAlert[] {
  return EMPTY;
}

function write(alerts: PriceAlert[]): void {
  cached = alerts;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  } catch {
    // Storage full or unavailable (private browsing) — just won't persist.
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

export function setPriceAlert(productId: string, referencePrice: number): void {
  const next = [
    { productId, referencePrice, createdAt: Date.now() },
    ...getSnapshot().filter((a) => a.productId !== productId),
  ];
  write(next);
}

export function removePriceAlert(productId: string): void {
  write(getSnapshot().filter((a) => a.productId !== productId));
}

export function usePriceAlerts(): PriceAlert[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useAlertForProduct(productId: string): PriceAlert | undefined {
  const alerts = usePriceAlerts();
  return alerts.find((a) => a.productId === productId);
}
