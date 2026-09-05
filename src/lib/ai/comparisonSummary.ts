import type { Locale } from "@/lib/i18n/locale";
import type { Product } from "@/lib/types";
import { labelForTag } from "@/lib/ai/keywords";
import { formatPrice } from "@/lib/i18n/format";

// A tag counts as a product's "standout" if it's the only one among the
// compared products that has it — otherwise it isn't a differentiator.
function standoutTag(product: Product, others: Product[]): string | null {
  return product.tags.find((tag) => !others.some((o) => o.tags.includes(tag))) ?? null;
}

// Synthesized, deterministic summary across a set of compared products
// — the comparison-page equivalent of buildQuickVerdict. Works whether
// or not there's any search criteria behind the comparison, since price
// and rating are always available regardless.
export function buildComparisonSummary(products: Product[], locale: Locale): string {
  if (products.length < 2) return "";

  const byPrice = [...products].sort((a, b) => a.price - b.price);
  const cheapest = byPrice[0];
  const priciest = byPrice[byPrice.length - 1];
  const topRated = [...products].sort((a, b) => b.rating - a.rating)[0];

  const sentences: string[] = [];

  if (locale === "fr") {
    if (cheapest.id !== priciest.id) {
      sentences.push(
        `${cheapest.name} est le plus abordable à ${formatPrice(cheapest.price, locale)}, tandis que ${priciest.name} se positionne plus haut à ${formatPrice(priciest.price, locale)}.`
      );
    }
    sentences.push(`${topRated.name} est le mieux noté (${topRated.rating.toFixed(1)}/5).`);
  } else {
    if (cheapest.id !== priciest.id) {
      sentences.push(
        `${cheapest.name} is the most affordable at ${formatPrice(cheapest.price, locale)}, while ${priciest.name} sits higher at ${formatPrice(priciest.price, locale)}.`
      );
    }
    sentences.push(`${topRated.name} is the top-rated pick (${topRated.rating.toFixed(1)}/5).`);
  }

  // Standout call-outs prioritize products not already named above, so
  // the summary spreads across the set instead of repeating whichever
  // product happened to also be cheapest or top-rated.
  const alreadyMentioned = new Set([cheapest.id, priciest.id, topRated.id]);
  const byPriority = [...products].sort(
    (a, b) => Number(alreadyMentioned.has(a.id)) - Number(alreadyMentioned.has(b.id))
  );

  for (const product of byPriority) {
    if (sentences.length >= 5) break;
    const others = products.filter((p) => p.id !== product.id);
    const tag = standoutTag(product, others);
    if (!tag) continue;
    const label = labelForTag(tag, locale);
    sentences.push(
      locale === "fr"
        ? `${product.name} se distingue par : ${label}.`
        : `${product.name} stands out for: ${label}.`
    );
  }

  return sentences.join(" ");
}
