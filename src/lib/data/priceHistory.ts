import type { Product } from "@/lib/types";
import { seedFromString } from "@/lib/data/seededRandom";

export interface PriceHistory {
  lowest90Days: number;
  average90Days: number;
  highest90Days: number;
}

export type BuyTiming = "good" | "wait" | "typical";

// Deterministic, illustrative 90-day price history — the catalog is
// static so nothing has actually moved on its own. Stands in for a
// real price-tracking feed later, same mock philosophy as
// otherOffers.ts: never invents something that contradicts the
// product's real price, just plausible variation around it.
export function getPriceHistory(product: Product): PriceHistory {
  // Salted so this doesn't move in lockstep with otherOffers, which
  // seeds from the bare product id.
  const seed = seedFromString(`${product.id}:history`);

  // The average drifts ±15% from today's price.
  const avgVariance = ((seed >>> 4) % 31) - 15;
  const average = Math.max(1, Math.round((product.price * (100 + avgVariance)) / 100));

  // The 90-day low sits 5-24% below whichever of price/average is lower.
  const lowVariance = (seed % 20) + 5;
  const lowest = Math.max(
    1,
    Math.round((Math.min(product.price, average) * (100 - lowVariance)) / 100)
  );

  // The 90-day high sits 5-24% above whichever of price/average is higher.
  const highVariance = ((seed >>> 8) % 20) + 5;
  const highest = Math.round(
    (Math.max(product.price, average) * (100 + highVariance)) / 100
  );

  return { lowest90Days: lowest, average90Days: average, highest90Days: highest };
}

const GOOD_DEAL_THRESHOLD = -0.05;
const HIGH_PRICE_THRESHOLD = 0.08;

export function getBuyTiming(product: Product, history: PriceHistory): BuyTiming {
  const diff = (product.price - history.average90Days) / history.average90Days;
  if (diff <= GOOD_DEAL_THRESHOLD) return "good";
  if (diff >= HIGH_PRICE_THRESHOLD) return "wait";
  return "typical";
}
