import type { Locale } from "@/lib/i18n/locale";
import type { Product, Recommendation } from "@/lib/types";
import { labelForTag } from "@/lib/ai/keywords";
import { formatPrice } from "@/lib/i18n/format";

export interface ConvinceMeResult {
  winner: Product;
  runnerUp: Product;
  reasonsFor: string[];
  reasonsAgainst: string[];
  verdict: string;
}

// The only tag the winner has that the other product doesn't (or vice
// versa) — a genuine differentiator, not just a shared trait.
function standoutTag(product: Product, other: Product): string | null {
  return product.tags.find((tag) => !other.tags.includes(tag)) ?? null;
}

// Deterministic "debate" framing between the two strongest candidates
// in a comparison — arguing for the top pick, then honestly against
// it, before landing on a verdict. Works with or without search
// criteria: ranks by match score when available, otherwise by rating.
export function buildConvinceMe(
  products: Product[],
  recommendations: Recommendation[] | undefined,
  locale: Locale
): ConvinceMeResult | null {
  if (products.length < 2) return null;

  const byRecommendation =
    recommendations && recommendations.length === products.length
      ? [...recommendations].sort((a, b) => b.matchScore - a.matchScore).map((r) => r.product)
      : null;
  const ranked =
    byRecommendation ?? [...products].sort((a, b) => b.rating - a.rating || a.price - b.price);

  const winner = ranked[0];
  const runnerUp = ranked[1];
  const winnerRec = recommendations?.find((r) => r.product.id === winner.id);

  const reasonsFor: string[] = [];
  const reasonsAgainst: string[] = [];

  if (winner.price < runnerUp.price) {
    const savings = formatPrice(runnerUp.price - winner.price, locale);
    reasonsFor.push(
      locale === "fr" ? `${savings} moins cher que ${runnerUp.name}` : `${savings} cheaper than ${runnerUp.name}`
    );
  }
  if (winner.rating > runnerUp.rating) {
    reasonsFor.push(
      locale === "fr"
        ? `Mieux noté (${winner.rating.toFixed(1)}/5 contre ${runnerUp.rating.toFixed(1)}/5)`
        : `Better rated (${winner.rating.toFixed(1)}/5 vs ${runnerUp.rating.toFixed(1)}/5)`
    );
  }
  const winnerTag = standoutTag(winner, runnerUp);
  if (winnerTag) reasonsFor.push(labelForTag(winnerTag, locale));
  if (winnerRec) reasonsFor.push(...winnerRec.pros.slice(0, 2));

  if (winner.price > runnerUp.price) {
    const diff = formatPrice(winner.price - runnerUp.price, locale);
    reasonsAgainst.push(
      locale === "fr"
        ? `Coûte ${diff} de plus que ${runnerUp.name}`
        : `Costs ${diff} more than ${runnerUp.name}`
    );
  }
  if (winner.rating < runnerUp.rating) {
    reasonsAgainst.push(
      locale === "fr"
        ? `Un peu moins bien noté (${winner.rating.toFixed(1)}/5 contre ${runnerUp.rating.toFixed(1)}/5)`
        : `Rated a little lower (${winner.rating.toFixed(1)}/5 vs ${runnerUp.rating.toFixed(1)}/5)`
    );
  }
  const runnerUpTag = standoutTag(runnerUp, winner);
  if (runnerUpTag) {
    const label = labelForTag(runnerUpTag, locale);
    reasonsAgainst.push(
      locale === "fr"
        ? `${runnerUp.name} a l'avantage sur : ${label}`
        : `${runnerUp.name} has the edge on: ${label}`
    );
  }
  if (reasonsAgainst.length === 0) {
    reasonsAgainst.push(
      locale === "fr"
        ? "Aucun vrai point faible identifié face à l'alternative."
        : "No real weak point compared to the alternative."
    );
  }

  const verdict =
    winnerRec?.reasoning ??
    (locale === "fr"
      ? `${winner.name} reste le choix le plus solide dans l'ensemble.`
      : `${winner.name} remains the strongest overall choice.`);

  return {
    winner,
    runnerUp,
    reasonsFor: [...new Set(reasonsFor)].slice(0, 4),
    reasonsAgainst: [...new Set(reasonsAgainst)].slice(0, 3),
    verdict,
  };
}
