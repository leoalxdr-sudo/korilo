import type { Locale } from "@/lib/i18n/locale";
import type { Product, Recommendation } from "@/lib/types";

// Below this match score, and only when the product is otherwise
// well-regarded (so this is about fit, not quality), Korilo says so
// plainly instead of staying quiet just because the product is
// popular.
const SCORE_THRESHOLD = 55;
const POPULARITY_THRESHOLD = 4.5;

function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

// Distinct from a deal breaker: nothing explicit was violated, the
// product just doesn't fit well despite being popular — so this only
// fires when there's no deal breaker already saying something
// stronger, and only when there's a concrete negative factor to name.
export function buildNotRecommendedReason(
  product: Product,
  recommendation: Recommendation,
  locale: Locale
): string | null {
  if (recommendation.dealBreakers.length > 0) return null;
  if (recommendation.matchScore >= SCORE_THRESHOLD) return null;
  if (product.rating < POPULARITY_THRESHOLD) return null;

  const negativeFactor = recommendation.factors.find((f) => f.impact === "negative");
  if (!negativeFactor) return null;

  const rating = product.rating.toFixed(1);
  return locale === "fr"
    ? `Il est populaire (${rating}/5), mais ${lowerFirst(negativeFactor.detail)}.`
    : `It's popular (${rating}/5), but ${lowerFirst(negativeFactor.detail)}.`;
}
