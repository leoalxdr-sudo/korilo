import type { Locale } from "@/lib/i18n/locale";
import type { ParsedCriteria, Product } from "@/lib/types";
import { getProductsByCategory } from "@/lib/data";
import { recommendForProducts } from "@/lib/ai";

export interface ValueAlternative {
  product: Product;
  /** Match score against the search criteria, or null when there's no
   * search context (arrived at the page directly). */
  matchScore: number | null;
  priceDiff: number;
  /** Concrete spec upgrades this alternative has over the current
   * product, e.g. "+8 Go de RAM" — only ever real, shared numeric
   * specs, never an invented "performance" percentage. */
  specDeltas: string[];
  ratingDelta: number;
  /** Why this cheaper option still holds up — reused pros from its own
   * recommendation when criteria are known, else a rating/spec-parity
   * fallback. Empty for the pricier ("worth more") alternative, whose
   * specDeltas already carry the explanation. */
  reasons: string[];
}

// Only specs whose values are a plain "{number}{unit}" string are safe
// to diff generically — battery life ("Up to 18 hours") needs its own
// parser below since it's a sentence, not a bare measurement.
const SIMPLE_NUMERIC_SPECS: Record<string, Record<Locale, string>> = {
  ram: { en: "GB more RAM", fr: "Go de RAM en plus" },
  storage: { en: "GB more storage", fr: "Go de stockage en plus" },
};

function numericSpecValue(product: Product, labelKey: string): number | null {
  const spec = product.specifications.find((s) => s.labelKey === labelKey);
  if (!spec) return null;
  const match = spec.value.en.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function batteryHours(product: Product): number | null {
  const spec = product.specifications.find(
    (s) => s.labelKey === "batteryLife" || s.labelKey === "battery"
  );
  if (!spec) return null;
  const match = spec.value.en.match(/(\d+)\s*hours?/i);
  return match ? parseInt(match[1], 10) : null;
}

function computeSpecDeltas(current: Product, alt: Product, locale: Locale): string[] {
  const deltas: string[] = [];

  for (const [key, unit] of Object.entries(SIMPLE_NUMERIC_SPECS)) {
    const a = numericSpecValue(current, key);
    const b = numericSpecValue(alt, key);
    if (a === null || b === null || b <= a) continue;
    deltas.push(`+${b - a} ${unit[locale]}`);
  }

  const aBattery = batteryHours(current);
  const bBattery = batteryHours(alt);
  if (aBattery !== null && bBattery !== null && bBattery > aBattery) {
    deltas.push(
      locale === "fr"
        ? `+${bBattery - aBattery}h d'autonomie`
        : `+${bBattery - aBattery}h battery life`
    );
  }

  return deltas.slice(0, 3);
}

function recommendationFor(product: Product, criteria: ParsedCriteria | null, locale: Locale) {
  if (!criteria) return null;
  return recommendForProducts(criteria, [product], locale)[0] ?? null;
}

// Explains why the cheaper alternative still holds up, not just that
// it's cheaper. With search criteria we reuse its own recommendation's
// top pro (already grounded in the user's actual priorities); without
// criteria we fall back to a plain rating/spec comparison.
function buildBestValueReasons(
  current: Product,
  alt: Product,
  altRecommendation: ReturnType<typeof recommendationFor>,
  locale: Locale
): string[] {
  if (altRecommendation && altRecommendation.pros.length > 0) {
    return altRecommendation.pros.slice(0, 2);
  }

  const reasons: string[] = [];
  if (alt.rating - current.rating >= -0.15) {
    reasons.push(
      locale === "fr"
        ? `Aussi bien noté (${alt.rating.toFixed(1)}/5)`
        : `Rated just as well (${alt.rating.toFixed(1)}/5)`
    );
  }
  for (const key of Object.keys(SIMPLE_NUMERIC_SPECS)) {
    const a = numericSpecValue(current, key);
    const b = numericSpecValue(alt, key);
    if (a !== null && b !== null && b >= a) {
      reasons.push(
        locale === "fr" ? "Mêmes caractéristiques clés" : "Same key specs"
      );
      break;
    }
  }
  return reasons.slice(0, 2);
}

function buildAlternative(
  current: Product,
  alt: Product,
  criteria: ParsedCriteria | null,
  locale: Locale,
  withReasons: boolean
): ValueAlternative {
  const altRecommendation = recommendationFor(alt, criteria, locale);
  return {
    product: alt,
    matchScore: altRecommendation?.matchScore ?? null,
    priceDiff: alt.price - current.price,
    specDeltas: computeSpecDeltas(current, alt, locale),
    ratingDelta: Math.round((alt.rating - current.rating) * 10) / 10,
    reasons: withReasons
      ? buildBestValueReasons(current, alt, altRecommendation, locale)
      : [],
  };
}

// The best-scoring (or best-rated, without search context) product in
// the same category that's cheaper than the one being viewed.
export function getBestValueAlternative(
  current: Product,
  criteria: ParsedCriteria | null,
  locale: Locale
): ValueAlternative | null {
  const candidates = getProductsByCategory(current.category).filter(
    (p) => p.id !== current.id && p.price < current.price
  );
  if (candidates.length === 0) return null;

  const best = criteria
    ? recommendForProducts(criteria, candidates, locale).sort(
        (a, b) => b.matchScore - a.matchScore
      )[0].product
    : [...candidates].sort((a, b) => b.rating - a.rating)[0];

  return buildAlternative(current, best, criteria, locale, true);
}

// The cheapest pricier option that offers a genuine, provable upside
// (a real spec advantage or a meaningfully better rating) — never just
// the most expensive product in the category, and never shown at all
// if nothing pricier is actually better.
export function getWorthMoreAlternative(
  current: Product,
  criteria: ParsedCriteria | null,
  locale: Locale
): ValueAlternative | null {
  const candidates = getProductsByCategory(current.category)
    .filter((p) => p.id !== current.id && p.price > current.price)
    .sort((a, b) => a.price - b.price);

  for (const candidate of candidates) {
    const alt = buildAlternative(current, candidate, criteria, locale, false);
    const hasUpside = alt.specDeltas.length > 0 || alt.ratingDelta >= 0.2;
    if (hasUpside) return alt;
  }
  return null;
}
