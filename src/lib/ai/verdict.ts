import type { Locale } from "@/lib/i18n/locale";
import type { Product } from "@/lib/types";
import { labelForTag } from "@/lib/ai/keywords";
import { formatNumber } from "@/lib/i18n/format";

// A short, always-available summary of why a product might be worth
// it — shown on every product page regardless of whether someone
// arrived via a search (unlike the personalized `recommendation`
// reasoning, which only exists when search criteria came along in the
// URL). Same deterministic, data-only approach as the rest of lib/ai.
export function buildQuickVerdict(product: Product, locale: Locale): string {
  const labels = [...new Set(product.tags.map((tag) => labelForTag(tag, locale)))].slice(0, 3);
  const rating = product.rating.toFixed(1);
  const reviews = formatNumber(product.reviewCount, locale);

  if (locale === "fr") {
    const strengths =
      labels.length > 0
        ? `Idéal si vous cherchez : ${labels.join(", ")}.`
        : "Un choix solide, tous usages confondus.";
    const ratingLine =
      product.rating >= 4.6
        ? `Excellente réputation (${rating}/5 sur ${reviews} avis).`
        : product.rating >= 4.3
          ? `Bien noté (${rating}/5 sur ${reviews} avis).`
          : `Correctement noté (${rating}/5 sur ${reviews} avis).`;
    return `${strengths} ${ratingLine}`;
  }

  const strengths =
    labels.length > 0
      ? `Great if you're after: ${labels.join(", ")}.`
      : "A solid, all-round choice.";
  const ratingLine =
    product.rating >= 4.6
      ? `Excellent reputation (${rating}/5 from ${reviews} reviews).`
      : product.rating >= 4.3
        ? `Well rated (${rating}/5 from ${reviews} reviews).`
        : `Decently rated (${rating}/5 from ${reviews} reviews).`;
  return `${strengths} ${ratingLine}`;
}
